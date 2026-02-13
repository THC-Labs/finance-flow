export type TransactionType = 'income' | 'expense';

export interface Card {
    id: string;
    user_id: string;
    name: string;
    last4?: string;
    color: string;
    balance: number;
    type: 'debit' | 'credit' | 'cash' | 'savings';
}

export interface Transaction {
    id: string;
    user_id: string;
    card_id?: string;
    type: TransactionType;
    amount: number;
    description: string;
    category: string;
    date: string;
    created_at: string;
}

export interface CategoryBudget {
    [category: string]: number;
}

export interface FinanceData {
    userName: string;
    currentAccountBalance: number;
    monthlyGoal: number;
    monthlyBudget: number;
    transactions: Transaction[];
    categoryBudgets: CategoryBudget;
    cards: Card[];
}

export const initialFinanceData: FinanceData = {
    userName: 'Usuario',
    currentAccountBalance: 0,
    monthlyGoal: 500,
    monthlyBudget: 2000,
    transactions: [],
    categoryBudgets: {
        vivienda: 500,
        alimentacion: 300,
        transporte: 200,
        ocio: 150,
        suscripciones: 100,
        salud: 100,
        suministros: 150,
        telecomunicaciones: 50,
        compras: 200,
        entretenimiento: 100,
        viajes: 100,
        seguros: 50
    },
    cards: []
};
