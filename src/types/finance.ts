export type TransactionType = 'income' | 'expense';

export interface Transaction {
    id: string;
    type: TransactionType;
    amount: number;
    description: string;
    category: string;
    date: string;
}

export interface CategoryBudget {
    [key: string]: number;
}

export interface FinanceData {
    transactions: Transaction[];
    monthlyGoal: number;
    userName: string;
    currentAccountBalance: number;
    monthlyBudget: number;
    categoryBudgets: CategoryBudget;
}

export const initialFinanceData: FinanceData = {
    transactions: [],
    monthlyGoal: 500,
    userName: 'Usuario',
    currentAccountBalance: 0,
    monthlyBudget: 2000,
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
    }
};
