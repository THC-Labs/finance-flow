"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { FinanceData, Transaction, initialFinanceData } from '../types/finance';

interface FinanceContextType {
    data: FinanceData;
    addTransaction: (transaction: Transaction) => void;
    deleteTransaction: (id: string) => void;
    updateSettings: (settings: Partial<FinanceData>) => void;
    resetData: () => void;
}

const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

export const FinanceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [data, setData] = useState<FinanceData>(initialFinanceData);
    const [isLoaded, setIsLoaded] = useState(false);

    // Load from localStorage on mount
    useEffect(() => {
        const saved = localStorage.getItem('financeData');
        if (saved) {
            try {
                setData(JSON.parse(saved));
            } catch (e) {
                console.error("Failed to parse finance data", e);
            }
        } else {
            // Initialize with sample data if empty? Or keep it empty?
            // Based on app.js `initializeSampleData`, we might want to do that.
            // For now, let's keep it clean or we can add a "seed" function.
        }
        setIsLoaded(true);
    }, []);

    // Save to localStorage on change
    useEffect(() => {
        if (isLoaded) {
            localStorage.setItem('financeData', JSON.stringify(data));
        }
    }, [data, isLoaded]);

    const addTransaction = (transaction: Transaction) => {
        setData(prev => {
            // Logic for updating balance
            const newBalance = transaction.type === 'income'
                ? prev.currentAccountBalance + transaction.amount
                : prev.currentAccountBalance - transaction.amount;

            return {
                ...prev,
                currentAccountBalance: newBalance,
                transactions: [...prev.transactions, transaction]
            };
        });
    };

    const deleteTransaction = (id: string) => {
        setData(prev => {
            const transaction = prev.transactions.find(t => t.id === id);
            if (!transaction) return prev;

            const newBalance = transaction.type === 'income'
                ? prev.currentAccountBalance - transaction.amount
                : prev.currentAccountBalance + transaction.amount;

            return {
                ...prev,
                currentAccountBalance: newBalance,
                transactions: prev.transactions.filter(t => t.id !== id)
            };
        });
    };

    const updateSettings = (settings: Partial<FinanceData>) => {
        setData(prev => ({ ...prev, ...settings }));
    };

    const resetData = () => {
        setData(initialFinanceData);
        localStorage.removeItem('financeData');
    }

    return (
        <FinanceContext.Provider value={{ data, addTransaction, deleteTransaction, updateSettings, resetData }}>
            {children}
        </FinanceContext.Provider>
    );
};

export const useFinanceData = () => {
    const context = useContext(FinanceContext);
    if (context === undefined) {
        throw new Error('useFinanceData must be used within a FinanceProvider');
    }
    return context;
};
