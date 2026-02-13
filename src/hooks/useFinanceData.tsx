"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { FinanceData, Transaction, initialFinanceData, Card } from '../types/finance';
import { supabase } from '../utils/supabase';
import { User } from '@supabase/supabase-js';

interface FinanceContextType {
    data: FinanceData;
    isLoading: boolean;
    user: User | null;
    addTransaction: (transaction: Omit<Transaction, 'id'>, cardId?: string) => Promise<void>;
    deleteTransaction: (id: string) => Promise<void>;
    editTransaction: (id: string, updatedTx: Partial<Omit<Transaction, 'id'>>) => Promise<void>;
    addCard: (card: Omit<Card, 'id' | 'user_id'>) => Promise<void>; // New
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
                            userName: newProfile.user_name || 'Usuario',
                            monthlyGoal: newProfile.monthly_goal,
                            monthlyBudget: newProfile.monthly_budget,
                            currentAccountBalance: Number(newProfile.current_balance),
                            categoryBudgets: newProfile.category_budgets
                        }));
                    }
                } else if (profile) {
                    setData(prev => ({
                        ...prev,
                        userName: profile.user_name || 'Usuario',
                        monthlyGoal: profile.monthly_goal,
                        monthlyBudget: profile.monthly_budget,
                        currentAccountBalance: Number(profile.current_balance),
                        categoryBudgets: profile.category_budgets
                    }));
                }

                // Fetch Transactions
                const { data: txs } = await supabase
                    .from('transactions')
                    .select('*')
                    .order('date', { ascending: false });

                // Fetch Cards
                const { data: cards } = await supabase
                    .from('cards')
                    .select('*')
                    .order('created_at', { ascending: true });

                if (txs) {
                    setData(prev => ({ ...prev, transactions: txs }));
                }

                if (cards) {
                    const totalBalance = cards.reduce((sum, card) => sum + Number(card.balance), 0);
                    setData(prev => ({
                        ...prev,
                        cards: cards,
                        currentAccountBalance: totalBalance
                    }));
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [user]);

    const addTransaction = async (tx: Omit<Transaction, 'id'>, cardId?: string) => {
        if (!user) return;

        // If no cardId provided, try to use the first card (default)
        const targetCardId = cardId || (data.cards.length > 0 ? data.cards[0].id : null);

        const { data: newTx, error } = await supabase
            .from('transactions')
            .insert({ ...tx, user_id: user.id, card_id: targetCardId })
            .select()
            .single();

        if (error) {
            console.error("Error adding transaction:", error.message, error);
            return;
        }

        // Update Card Balance
        if (targetCardId) {
            const card = data.cards.find(c => c.id === targetCardId);
            if (card) {
                const newCardBalance = tx.type === 'income'
                    ? Number(card.balance) + tx.amount
                    : Number(card.balance) - tx.amount;

                await supabase
                    .from('cards')
                    .update({ balance: newCardBalance })
                    .eq('id', targetCardId);

                // Update local state
                setData(prev => {
                    const updatedCards = prev.cards.map(c =>
                        c.id === targetCardId ? { ...c, balance: newCardBalance } : c
                    );
                    const totalBalance = updatedCards.reduce((sum, c) => sum + Number(c.balance), 0);

                    return {
                        ...prev,
                        cards: updatedCards,
                        currentAccountBalance: totalBalance,
                        transactions: [newTx, ...prev.transactions]
                    };
                });
                return;
            }
        }

        // Fallback if no card (shouldn't happen with migration, but just in case)
        setData(prev => ({
            ...prev,
            transactions: [newTx, ...prev.transactions]
        }));
    };

    const addCard = async (card: Omit<Card, 'id' | 'user_id'>) => {
        if (!user) return;

        const { data: newCard, error } = await supabase
            .from('cards')
            .insert({ ...card, user_id: user.id })
            .select()
            .single();

        if (error) {
            console.error("Error adding card (Raw):", JSON.stringify(error, null, 2));
            console.error("Error object keys:", Object.keys(error));
            console.error("Full Error:", error);
            alert(`Error adding card: ${error.message}`); // Temporary feedback
            return;
        }

        setData(prev => {
            const updatedCards = [...prev.cards, newCard];
            const totalBalance = updatedCards.reduce((sum, c) => sum + Number(c.balance), 0);
            return {
                ...prev,
                cards: updatedCards,
                currentAccountBalance: totalBalance
            };
        });
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

        // Update Card Balance
        if (txToDelete.card_id) {
            const card = data.cards.find(c => c.id === txToDelete.card_id);
            if (card) {
                const newCardBalance = txToDelete.type === 'income'
                    ? Number(card.balance) - txToDelete.amount
                    : Number(card.balance) + txToDelete.amount;

                await supabase.from('cards').update({ balance: newCardBalance }).eq('id', txToDelete.card_id);

                setData(prev => {
                    const updatedCards = prev.cards.map(c =>
                        c.id === txToDelete.card_id ? { ...c, balance: newCardBalance } : c
                    );
                    const totalBalance = updatedCards.reduce((sum, c) => sum + Number(c.balance), 0);
                    return {
                        ...prev,
                        cards: updatedCards,
                        currentAccountBalance: totalBalance,
                        transactions: prev.transactions.filter(t => t.id !== id)
                    }
                });
                return;
            }
        }

        // Fallback
        setData(prev => ({
            ...prev,
            transactions: prev.transactions.filter(t => t.id !== id)
        }));
    };

    const editTransaction = async (id: string, updatedTx: Partial<Omit<Transaction, 'id'>>) => {
        if (!user) return;

        const originalTx = data.transactions.find(t => t.id === id);
        if (!originalTx) return;

        const { error } = await supabase
            .from('transactions')
            .update(updatedTx)
            .eq('id', id);

        if (error) {
            console.error("Error editing transaction:", error.message, error);
            return;
        }

        // Check if balance update is needed
        // Assuming card_id didn't change for MVP simplicity. If it did, we'd need to update 2 cards.
        // Let's assume simplest case: same card, amount/type change.
        const cardId = originalTx.card_id;

        if (cardId) {
            const card = data.cards.find(c => c.id === cardId);
            if (card) {
                const originalAmountSigned = originalTx.type === 'income' ? originalTx.amount : -originalTx.amount;

                const newType = updatedTx.type || originalTx.type;
                const newAmountVal = updatedTx.amount !== undefined ? updatedTx.amount : originalTx.amount;
                const newAmountSigned = newType === 'income' ? newAmountVal : -newAmountVal;

                const diff = newAmountSigned - originalAmountSigned;

                if (diff !== 0) {
                    const newCardBalance = Number(card.balance) + diff;
                    await supabase.from('cards').update({ balance: newCardBalance }).eq('id', cardId);

                    setData(prev => {
                        const updatedCards = prev.cards.map(c =>
                            c.id === cardId ? { ...c, balance: newCardBalance } : c
                        );
                        const totalBalance = updatedCards.reduce((sum, c) => sum + Number(c.balance), 0);
                        return {
                            ...prev,
                            cards: updatedCards,
                            currentAccountBalance: totalBalance,
                            transactions: prev.transactions.map(t =>
                                t.id === id ? { ...t, ...updatedTx } : t
                            )
                        }
                    });
                    return;
                }
            }
        }

        setData(prev => ({
            ...prev,
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
            addCard,
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

