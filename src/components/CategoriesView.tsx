"use client";

import { clsx } from 'clsx';
import {
    Calendar, X
} from 'lucide-react';
import { CATEGORY_GROUPS } from '../utils/categories';
import { useState } from 'react';
import { useFinanceData } from '../hooks/useFinanceData';
import { getEffectiveMonth } from '../utils/finance';
import { formatCurrency, formatDate } from '../utils/format';
import { Transaction } from '../types/finance';

export function CategoriesView() {
    const { data } = useFinanceData();
    const [selectedCategory, setSelectedCategory] = useState<{ id: string, label: string, icon: any } | null>(null);

    const categories = CATEGORY_GROUPS;

    // Filter transactions for the selected category and current month
    const getCategoryTransactions = () => {
        if (!selectedCategory) return [];
        const today = new Date();
        const currentMonth = today.getMonth();
        const currentYear = today.getFullYear();

        return data.transactions.filter(t => {
            const eff = getEffectiveMonth(t);
            return t.category === selectedCategory.id &&
                eff.month === currentMonth &&
                eff.year === currentYear;
        });
    };

    const categoryTransactions = getCategoryTransactions();
    const totalAmount = categoryTransactions.reduce((sum, t) => sum + t.amount, 0);

    return (
        <div className="p-6 md:p-8 space-y-8 animate-in fade-in duration-500 pb-24">
            <div>
                <h2 className="text-3xl font-bold text-white">Categorías</h2>
                <p className="text-zinc-400 mt-1">Estructura de tus finanzas</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {categories.map((group) => (
                    <div key={group.title} className="bg-zinc-900 rounded-[30px] p-6 border border-zinc-800 flex flex-col gap-6 h-fit">
                        <div className="flex items-center gap-3 border-b border-zinc-800/50 pb-4">
                            <div className={clsx("w-10 h-10 rounded-xl flex items-center justify-center", group.bgColor)}>
                                <group.icon className={group.color} size={20} />
                            </div>
                            <h3 className="text-lg font-bold text-[#9AD93D]">{group.title}</h3>
                        </div>

                        <div className="flex flex-col gap-2">
                            {group.items.map((item) => (
                                <button
                                    key={item.id}
                                    onClick={() => setSelectedCategory(item)}
                                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-zinc-800/50 transition-colors group w-full text-left"
                                >
                                    <div className="w-8 h-8 rounded-lg bg-zinc-950 flex items-center justify-center text-[#B3F2CF] group-hover:text-[#9AD93D] transition-colors">
                                        <item.icon size={16} />
                                    </div>
                                    <span className="text-zinc-300 font-medium text-sm group-hover:text-white transition-colors">
                                        {item.label}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {/* Category Details Modal */}
            {selectedCategory && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-zinc-900 border border-zinc-800 rounded-3xl w-full max-w-lg shadow-2xl p-6 relative animate-in zoom-in-95 duration-200">
                        <button
                            onClick={() => setSelectedCategory(null)}
                            className="absolute top-4 right-4 text-zinc-400 hover:text-white transition-colors"
                        >
                            <X size={24} />
                        </button>

                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-12 h-12 rounded-2xl bg-[#9AD93D]/10 flex items-center justify-center text-[#9AD93D]">
                                <selectedCategory.icon size={24} />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-white">{selectedCategory.label}</h3>
                                <p className="text-zinc-400 text-sm">Detalle del mes actual</p>
                            </div>
                        </div>

                        <div className="bg-zinc-950 rounded-2xl p-4 border border-zinc-900 mb-6 flex justify-between items-center">
                            <span className="text-zinc-400 font-medium">Total Mes</span>
                            <span className="text-2xl font-bold text-white">{formatCurrency(totalAmount)}</span>
                        </div>

                        <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                            <h4 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider">Transacciones</h4>

                            {categoryTransactions.length > 0 ? (
                                categoryTransactions.map((t) => (
                                    <div key={t.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-zinc-800/30 transition-colors border border-transparent hover:border-zinc-800/50">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-400">
                                                <Calendar size={16} />
                                            </div>
                                            <div>
                                                <p className="text-white font-medium text-sm">{t.description}</p>
                                                <p className="text-zinc-500 text-xs">{formatDate(t.date)}</p>
                                            </div>
                                        </div>
                                        <span className={clsx(
                                            "font-medium",
                                            t.type === 'income' ? 'text-[#9AD93D]' : 'text-white'
                                        )}>
                                            {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount)}
                                        </span>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-8 text-zinc-500">
                                    No hay movimientos este mes.
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
