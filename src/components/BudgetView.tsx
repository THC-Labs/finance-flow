"use client";

import { useState, useEffect } from 'react';
import { useFinanceData } from '../hooks/useFinanceData';
import { CATEGORY_GROUPS } from '../utils/categories';
import { formatCurrency } from '../utils/format';
import { Save, PiggyBank, ShoppingCart, AlertCircle } from 'lucide-react';
import { clsx } from 'clsx';
import { getEffectiveMonth } from '../utils/finance';

export function BudgetView() {
    const { data, updateSettings } = useFinanceData();
    const [localBudgets, setLocalBudgets] = useState<{ [key: string]: number }>({});
    const [isSaving, setIsSaving] = useState(false);
    const [hasChanges, setHasChanges] = useState(false);

    // Initialize local state from global data
    useEffect(() => {
        if (data.categoryBudgets) {
            setLocalBudgets(data.categoryBudgets);
        }
    }, [data.categoryBudgets]);

    const handleBudgetChange = (categoryId: string, value: string) => {
        const numValue = parseFloat(value);
        if (isNaN(numValue) || numValue < 0) return;

        setLocalBudgets(prev => ({
            ...prev,
            [categoryId]: numValue
        }));
        setHasChanges(true);
    };

    const handleSave = async () => {
        setIsSaving(true);
        await updateSettings({ categoryBudgets: localBudgets });
        setIsSaving(false);
        setHasChanges(false);
    };

    // Calculate totals
    const groupsToDisplay = CATEGORY_GROUPS.filter(g => g.id === 'expense' || g.id === 'savings');

    const totalBudget = Object.values(localBudgets).reduce((sum, val) => sum + val, 0);

    // Calculate current spending per category for this month
    const getCurrentSpending = (categoryId: string) => {
        const today = new Date();
        const currentMonth = today.getMonth();
        const currentYear = today.getFullYear();

        return data.transactions
            .filter(t => {
                const eff = getEffectiveMonth(t);
                return t.category === categoryId &&
                    eff.month === currentMonth &&
                    eff.year === currentYear;
            })
            .reduce((sum, t) => sum + t.amount, 0);
    };

    const totalSpent = groupsToDisplay.flatMap(g => g.items).reduce((sum, item) => {
        return sum + getCurrentSpending(item.id);
    }, 0);

    return (
        <div className="p-6 md:p-8 space-y-8 animate-in fade-in duration-500 pb-24">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-white">Presupuesto Mensual</h2>
                    <p className="text-zinc-400 mt-1">Planifica tus gastos y ahorros</p>
                </div>
                <button
                    onClick={handleSave}
                    disabled={!hasChanges || isSaving}
                    className={clsx(
                        "flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all",
                        hasChanges
                            ? "bg-[#9AD93D] text-black hover:bg-[#8ac236] shadow-lg shadow-[#9AD93D]/20"
                            : "bg-zinc-800 text-zinc-500 cursor-not-allowed"
                    )}
                >
                    <Save size={20} />
                    {isSaving ? 'Guardando...' : 'Guardar Cambios'}
                </button>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-zinc-900/70 backdrop-blur-md p-6 rounded-[30px] border border-zinc-800">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-xl bg-zinc-800 flex items-center justify-center text-zinc-400">
                            <ShoppingCart size={20} />
                        </div>
                        <span className="text-zinc-400 font-medium">Presupuesto Total</span>
                    </div>
                    <p className="text-3xl font-bold text-white">{formatCurrency(totalBudget)}</p>
                </div>

                <div className="bg-zinc-900/70 backdrop-blur-md p-6 rounded-[30px] border border-zinc-800">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-xl bg-zinc-800 flex items-center justify-center text-zinc-400">
                            <AlertCircle size={20} />
                        </div>
                        <span className="text-zinc-400 font-medium">Gasto Actual</span>
                    </div>
                    <p className={clsx("text-3xl font-bold", totalSpent > totalBudget ? "text-red-400" : "text-white")}>
                        {formatCurrency(totalSpent)}
                    </p>
                </div>

                <div className="bg-zinc-900/70 backdrop-blur-md p-6 rounded-[30px] border border-zinc-800">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-xl bg-zinc-800 flex items-center justify-center text-zinc-400">
                            <PiggyBank size={20} />
                        </div>
                        <span className="text-zinc-400 font-medium">Restante</span>
                    </div>
                    <p className={clsx("text-3xl font-bold", (totalBudget - totalSpent) < 0 ? "text-red-400" : "text-[#9AD93D]")}>
                        {formatCurrency(totalBudget - totalSpent)}
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {groupsToDisplay.map(group => (
                    <div key={group.id} className="bg-zinc-900/70 backdrop-blur-md rounded-[30px] p-6 border border-zinc-800 h-fit">
                        <div className="flex items-center gap-3 border-b border-zinc-800/50 pb-4 mb-6">
                            <div className={clsx("w-10 h-10 rounded-xl flex items-center justify-center", group.bgColor)}>
                                <group.icon className={group.color} size={20} />
                            </div>
                            <h3 className="text-xl font-bold text-[#9AD93D]">{group.title}</h3>
                        </div>

                        <div className="space-y-6">
                            {group.items.map(item => {
                                const budget = localBudgets[item.id] || 0;
                                const spent = getCurrentSpending(item.id);
                                const rawPercentage = budget > 0 ? (spent / budget) * 100 : 0;
                                const barPercentage = Math.min(rawPercentage, 100);
                                const isOverBudget = spent > budget;

                                return (
                                    <div key={item.id} className="bg-zinc-950/50 p-4 rounded-2xl border border-zinc-800/50">
                                        <div className="flex items-center justify-between mb-3">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-lg bg-zinc-900/70 backdrop-blur-md flex items-center justify-center text-[#B3F2CF]">
                                                    <item.icon size={16} />
                                                </div>
                                                <span className="text-white font-medium">{item.label}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <input
                                                    type="number"
                                                    value={budget}
                                                    onChange={(e) => handleBudgetChange(item.id, e.target.value)}
                                                    className="w-24 bg-zinc-900/70 backdrop-blur-md border border-zinc-800 rounded-lg px-3 py-1 text-right text-white focus:outline-none focus:border-[#9AD93D] text-sm font-bold no-spinner"
                                                    min="0"
                                                />
                                                <span className="text-zinc-500 text-sm">€</span>
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <div className="flex justify-between text-xs text-zinc-400">
                                                <span>Gastado: {formatCurrency(spent)}</span>
                                                <span className={isOverBudget ? "text-red-400 font-bold" : ""}>
                                                    {Math.round(rawPercentage)}%
                                                </span>
                                            </div>
                                            <div className="h-2 w-full bg-zinc-900/70 backdrop-blur-md rounded-full overflow-hidden">
                                                <div
                                                    className={clsx("h-full rounded-full transition-all duration-500",
                                                        isOverBudget ? "bg-red-500" : "bg-[#9AD93D]"
                                                    )}
                                                    style={{ width: `${barPercentage}%` }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
