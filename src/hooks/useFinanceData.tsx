"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { FinanceData, Transaction, initialFinanceData } from '../types/finance';
import { supabase } from '../utils/supabase';
import { User } from '@supabase/supabase-js';

interface FinanceContextType {
    data: FinanceData;
    isLoading: boolean;
    user: User | null;
    addTransaction: (transaction: Omit<Transaction, 'id'>) => Promise<void>;
    deleteTransaction: (id: string) => Promise<void>;
    editTransaction: (id: string, updatedTx: Partial<Omit<Transaction, 'id'>>) => Promise<void>;
    updateSettings: (settings: Partial<FinanceData>) => Promise<void>;
    resetData: () => Promise<void>;
    signIn: (email: string, password: string) => Promise<any>;
    signUp: (email: string, password: string) => Promise<any>;
    signOut: () => Promise<void>;
}

const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

// Helper hook to use the finance context
export const useFinanceData = () => {
    const context = useContext(FinanceContext);
    if (context === undefined) {
        throw new Error('useFinanceData must be used within a FinanceProvider');
    }
    return context;
};



export function FinanceProvider({ children }: { children: React.ReactNode }) {
    const [data, setData] = useState<FinanceData>(initialFinanceData);
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Initial session check
    useEffect(() => {
        const checkUser = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            setUser(session?.user ?? null);
            setIsLoading(false);
        };
        checkUser();

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event: string, session: any) => {
            setUser(session?.user ?? null);
        });

        return () => subscription.unsubscribe();
    }, []);

    // Fetch data when user changes
    useEffect(() => {
        if (!user) {
            setData(initialFinanceData);
            return;
        }

        const fetchData = async () => {
            setIsLoading(true);
            try {
                // Fetch Profile
                const { data: profile, error: profileError } = await supabase
                    .from('profiles')
                    .select('*')
                    .single();

                if (profileError && profileError.code === 'PGRST116') {
                    // Profile doesn't exist, create it
                    const { data: newProfile } = await supabase
                        .from('profiles')
                        .insert({ id: user.id })
                        .select()
                        .single();
                    if (newProfile) {
                        setData(prev => ({
                            ...prev,
                            userName: newProfile.user_name,
                            monthlyGoal: newProfile.monthly_goal,
                            monthlyBudget: newProfile.monthly_budget,
                            currentAccountBalance: Number(newProfile.current_balance),
                            categoryBudgets: newProfile.category_budgets
                        }));
                    }
                } else if (profile) {
                    setData(prev => ({
                        ...prev,
                        userName: profile.user_name,
                        monthlyGoal: profile.monthly_goal,
                        monthlyBudget: profile.monthly_budget,
                        currentAccountBalance: Number(profile.current_balance),
                        categoryBudgets: profile.category_budgets
                    }));
                }

                // Fetch Transactions
                const { data: txs, error: txError } = await supabase
                    .from('transactions')
                    .select('*')
                    .order('date', { ascending: false });

                if (txs) {
                    setData(prev => ({ ...prev, transactions: txs }));
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [user]);

    const addTransaction = async (tx: Omit<Transaction, 'id'>) => {
        if (!user) return;

        const { data: newTx, error } = await supabase
            .from('transactions')
            .insert({ ...tx, user_id: user.id })
            .select()
            .single();

        if (error) {
            console.error("Error adding transaction:", error.message, error);
            return;
        }

        // Update local state and balance in DB (ideally via trigger, but doing it here for simplicity)
        const newBalance = tx.type === 'income'
            ? data.currentAccountBalance + tx.amount
            : data.currentAccountBalance - tx.amount;

        await supabase
            .from('profiles')
            .update({ current_balance: newBalance })
            .eq('id', user.id);

        setData(prev => ({
            ...prev,
            currentAccountBalance: newBalance,
            transactions: [newTx, ...prev.transactions]
        }));
    };

    const deleteTransaction = async (id: string) => {
        if (!user) return;

        const txToDelete = data.transactions.find(t => t.id === id);
        if (!txToDelete) return;

        const { error } = await supabase
            .from('transactions')
            .delete()
            .eq('id', id);

        if (error) {
            console.error("Error deleting transaction:", error);
            return;
        }

        const newBalance = txToDelete.type === 'income'
            ? data.currentAccountBalance - txToDelete.amount
            : data.currentAccountBalance + txToDelete.amount;

        await supabase
            .from('profiles')
            .update({ current_balance: newBalance })
            .eq('id', user.id);

        setData(prev => ({
            ...prev,
            currentAccountBalance: newBalance,
            transactions: prev.transactions.filter(t => t.id !== id)
        }));
    };

    const editTransaction = async (id: string, updatedTx: Partial<Omit<Transaction, 'id'>>) => {
        if (!user) return;

        const originalTx = data.transactions.find(t => t.id === id);
        if (!originalTx) return;

        // Calculate potential balance change
        let balanceDiff = 0;

        // If amount or type changed, we need to adjust balance
        // Revert original transaction effect
        const originalAmount = originalTx.type === 'income' ? originalTx.amount : -originalTx.amount;

        // Apply new transaction effect (use new values or fallback to original)
        const newType = updatedTx.type || originalTx.type;
        const newAmountVal = updatedTx.amount !== undefined ? updatedTx.amount : originalTx.amount;
        const newSignedAmount = newType === 'income' ? newAmountVal : -newAmountVal;

        balanceDiff = newSignedAmount - originalAmount;
        const newBalance = data.currentAccountBalance + balanceDiff;

        const { error } = await supabase
            .from('transactions')
            .update(updatedTx)
            .eq('id', id);

        if (error) {
            console.error("Error editing transaction:", error.message, error);
            return;
        }

        if (balanceDiff !== 0) {
            await supabase
                .from('profiles')
                .update({ current_balance: newBalance })
                .eq('id', user.id);
        }

        setData(prev => ({
            ...prev,
            currentAccountBalance: newBalance,
            transactions: prev.transactions.map(t =>
                t.id === id ? { ...t, ...updatedTx } : t
            )
        }));
    };

    const updateSettings = async (settings: Partial<FinanceData>) => {
        if (!user) return;

        const updatePayload: any = {};
        if (settings.userName) updatePayload.user_name = settings.userName;
        if (settings.monthlyGoal) updatePayload.monthly_goal = settings.monthlyGoal;
        if (settings.monthlyBudget) updatePayload.monthly_budget = settings.monthlyBudget;
        if (settings.categoryBudgets) updatePayload.category_budgets = settings.categoryBudgets;

        const { error } = await supabase
            .from('profiles')
            .update(updatePayload)
            .eq('id', user.id);

        if (error) {
            console.error("Error updating settings:", error);
            return;
        }

        setData(prev => ({ ...prev, ...settings }));
    };

    const resetData = async () => {
        if (!user) return;

        await supabase.from('transactions').delete().eq('user_id', user.id);
        await supabase.from('profiles').update({
            current_balance: 0,
            monthly_goal: 500,
            monthly_budget: 2000
        }).eq('id', user.id);

        setData(initialFinanceData);
    };

    const signIn = async (email: string, password: string) => {
        return await supabase.auth.signInWithPassword({ email, password });
    };

    const signUp = async (email: string, password: string) => {
        return await supabase.auth.signUp({ email, password });
    };

    const signOut = async () => {
        await supabase.auth.signOut();
        setUser(null);
        setData(initialFinanceData);
    };

    return (
        <FinanceContext.Provider value={{
            data,
            isLoading,
            user,
            addTransaction,
            deleteTransaction,
            editTransaction,
            updateSettings,
            resetData,
            signIn,
            signUp,
            signOut
        }}>
            {children}
        </FinanceContext.Provider>
    );
};

