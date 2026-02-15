"use client";

import React from 'react';
import { clsx } from 'clsx';
import { formatCurrency, formatDate } from '../utils/format';
import { useFinanceData } from '../hooks/useFinanceData';

export function MasterDataGrid() {
    const { data } = useFinanceData();

    // Enriched mock data for demo purposes (extending the base transactions)
    const transactions = [...data.transactions, ...data.transactions, ...data.transactions].map((t, i) => ({
        ...t,
        id: `${t.id}-${i}`, // Ensure unique IDs
        status: i % 5 === 0 ? 'Pending' : 'Completed',
        merchant: t.description, // Simplified mapping
        categoryTag: t.category
    })).slice(0, 15); // Show top 15

    return (
        <div className="w-full overflow-hidden rounded-2xl border border-white/5 bg-[#1A2326]">
            <div className="overflow-x-auto">
                <table className="w-full border-collapse text-left text-sm">
                    <thead>
                        <tr className="border-b border-white/5 bg-white/[0.02]">
                            <th className="px-6 py-4 font-medium text-zinc-500 uppercase tracking-wider text-[11px]">Fecha</th>
                            <th className="px-6 py-4 font-medium text-zinc-500 uppercase tracking-wider text-[11px]">Transacción</th>
                            <th className="px-6 py-4 font-medium text-zinc-500 uppercase tracking-wider text-[11px]">Categoría</th>
                            <th className="px-6 py-4 font-medium text-zinc-500 uppercase tracking-wider text-[11px]">Estado</th>
                            <th className="px-6 py-4 font-medium text-zinc-500 uppercase tracking-wider text-[11px] text-right">Monto</th>
                            <th className="px-6 py-4 font-medium text-zinc-500 uppercase tracking-wider text-[11px] text-right">% Impacto</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {transactions.map((t) => (
                            <tr key={t.id} className="group hover:bg-white/[0.02] transition-colors">
                                <td className="px-6 py-3 text-zinc-400 font-mono text-xs whitespace-nowrap">
                                    {formatDate(t.date)}
                                </td>
                                <td className="px-6 py-3">
                                    <div className="flex flex-col">
                                        <span className="text-zinc-200 font-medium">{t.description}</span>
                                        <span className="text-zinc-600 text-[10px]">**** 4589</span>
                                    </div>
                                </td>
                                <td className="px-6 py-3">
                                    <span className={clsx(
                                        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border",
                                        "bg-zinc-900 border-zinc-800 text-zinc-400" // Default style
                                    )}>
                                        {t.category}
                                    </span>
                                </td>
                                <td className="px-6 py-3">
                                    <div className="flex items-center gap-2">
                                        <div className={clsx(
                                            "w-1.5 h-1.5 rounded-full",
                                            t.status === 'Completed' ? "bg-[#9AD93D] shadow-[0_0_8px_rgba(154,217,61,0.5)]" : "bg-yellow-500"
                                        )}></div>
                                        <span className={clsx(
                                            "text-xs",
                                            t.status === 'Completed' ? "text-[#9AD93D]" : "text-yellow-500"
                                        )}>{t.status}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-3 text-right">
                                    <span className={clsx(
                                        "font-mono font-medium",
                                        t.type === 'income' ? "text-[#9AD93D]" : "text-white"
                                    )}>
                                        {t.type === 'income' ? '+' : ''}{formatCurrency(t.amount)}
                                    </span>
                                </td>
                                <td className="px-6 py-3 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <div className="w-16 h-1 bg-zinc-800 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-[#9AD93D]/50"
                                                style={{ width: `${Math.random() * 60}%` }} // Mock data for demo
                                            ></div>
                                        </div>
                                        <span className="text-[10px] text-zinc-600 font-mono">
                                            {Math.floor(Math.random() * 20)}%
                                        </span>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Table Footer / Pagination */}
            <div className="border-t border-white/5 bg-white/[0.02] px-6 py-3 flex items-center justify-between text-xs text-zinc-500">
                <span>Mostrando 15 de 1,234 transacciones</span>
                <div className="flex gap-2">
                    <button className="hover:text-white transition-colors">Anterior</button>
                    <button className="hover:text-white transition-colors">Siguiente</button>
                </div>
            </div>
        </div>
    );
}
