import { Transaction } from '../types/finance';

export const SALARY_DAY_THRESHOLD = 25;

export function getEffectiveMonth(transaction: Transaction): { month: number; year: number } {
    const date = new Date(transaction.date);
    let month = date.getMonth();
    let year = date.getFullYear();

    if (transaction.type === 'income' && date.getDate() >= SALARY_DAY_THRESHOLD) {
        month++;
        if (month > 11) {
            month = 0;
            year++;
        }
    }

    return { month, year };
}

export function filterTransactionsByMonth(transactions: Transaction[], month: number, year: number): Transaction[] {
    return transactions.filter(t => {
        const eff = getEffectiveMonth(t);
        return eff.month === month && eff.year === year;
    });
}
