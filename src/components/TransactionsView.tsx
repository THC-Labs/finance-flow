"use client";

import { useFinanceData } from '../hooks/useFinanceData';
import { formatCurrency, formatDate } from '../utils/format';
import { Trash2, Search, Filter } from 'lucide-react';
import { useState } from 'react';
import { TransactionType } from '../types/finance';
import { clsx } from 'clsx';

export function TransactionsView() {
    const { data, deleteTransaction } = useFinanceData();
    const [filterMonth, setFilterMonth] = useState('all');
    const [filterType, setFilterType] = useState<TransactionType | 'all'>('all');
    const [searchTerm, setSearchTerm] = useState('');

    const filteredTransactions = data.transactions.filter(t => {
        const date = new Date(t.date);
        const matchesMonth = filterMonth === 'all' || date.getMonth().toString() === filterMonth;
        const matchesType = filterType === 'all' || t.type === filterType;
        const matchesSearch = t.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            t.category.toLowerCase().includes(searchTerm.toLowerCase());

        return matchesMonth && matchesType && matchesSearch;
    }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return (
        <div className="p-6 md:p-8 space-y-6 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-white">Todas las Transacciones</h2>
                    <p className="text-zinc-400 mt-1">Gestiona tus ingresos y gastos</p>
                </div>
            </div>

            <div className="flex flex-col md:flex-row gap-4 bg-zinc-900 p-4 rounded-2xl border border-zinc-800">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
                    <input
                        type="text"
                        placeholder="Buscar por descripción o categoría..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-sm text-white focus:outline-none focus:border-[#b4f827]"
                    />
                </div>
                <div className="flex gap-2">
                    <select
                        value={filterMonth}
                        onChange={(e) => setFilterMonth(e.target.value)}
                        className="bg-zinc-950 border border-zinc-800 text-zinc-300 text-sm rounded-xl px-4 py-2 focus:outline-none focus:border-[#b4f827]"
                    >
                        <option value="all">Todos los meses</option>
                        {Array.from({ length: 12 }, (_, i) => (
                            <option key={i} value={i.toString()}>
                                {new Date(0, i).toLocaleString('es-ES', { month: 'long' })}
                            </option>
                        ))}
                    </select>
                    <select
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value as any)}
                        className="bg-zinc-950 border border-zinc-800 text-zinc-300 text-sm rounded-xl px-4 py-2 focus:outline-none focus:border-[#b4f827]"
                    >
                        <option value="all">Todos los tipos</option>
                        <option value="income">Ingresos</option>
                        <option value="expense">Gastos</option>
                    </select>
                </div>
            </div>

            <div className="bg-zinc-900 rounded-3xl border border-zinc-800 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-zinc-400">
                        <thead className="bg-zinc-950/50 text-xs uppercase font-medium">
                            <tr>
                                <th className="px-6 py-4">Fecha</th>
                                <th className="px-6 py-4">Descripción</th>
                                <th className="px-6 py-4">Categoría</th>
                                <th className="px-6 py-4">Tipo</th>
                                <th className="px-6 py-4 text-right">Importe</th>
                                <th className="px-6 py-4 text-center">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-800">
                            {filteredTransactions.map((t) => (
                                <tr key={t.id} className="hover:bg-zinc-800/50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap">{formatDate(t.date)}</td>
                                    <td className="px-6 py-4 font-medium text-white">{t.description}</td>
                                    <td className="px-6 py-4">
                                        <span className="bg-zinc-800 px-3 py-1 rounded-full text-xs text-zinc-300 border border-zinc-700">
                                            {t.category}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={clsx(
                                            "px-2 py-1 rounded-md text-xs font-semibold uppercase",
                                            t.type === 'income' ? "bg-[#b4f827]/10 text-[#b4f827]" : "bg-red-500/10 text-red-400"
                                        )}>
                                            {t.type === 'income' ? 'Ingreso' : 'Gasto'}
                                        </span>
                                    </td>
                                    <td className={clsx(
                                        "px-6 py-4 text-right font-medium",
                                        t.type === 'income' ? "text-[#b4f827]" : "text-white"
                                    )}>
                                        {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount)}
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <button
                                            onClick={() => deleteTransaction(t.id)}
                                            className="text-zinc-500 hover:text-red-400 transition-colors p-2 hover:bg-zinc-800 rounded-lg"
                                            title="Eliminar"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {filteredTransactions.length === 0 && (
                        <div className="text-center py-12 text-zinc-500">
                            <p>No se encontraron transacciones con los filtros actuales.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
