"use client";

import { useFinanceData } from '../hooks/useFinanceData';
import { formatCurrency, formatDate } from '../utils/format';
import { SplineChart } from './SplineChart';
import { CardsCarousel } from './CardsCarousel';
import {
    ArrowUpRight,
    ArrowDownRight,
    Wallet,
    PiggyBank,
    TrendingUp,
    Search,
    Plus,
    Minus
} from 'lucide-react';
import { clsx } from 'clsx';
import { useState } from 'react';
import { TransactionModal } from './TransactionModal';
import { TransactionType } from '../types/finance';

export function DashboardView() {
    const { data, isLoading } = useFinanceData();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalType, setModalType] = useState<TransactionType>('expense');

    // Calculate totals
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();

    const monthlyTransactions = data.transactions.filter(t => {
        const date = new Date(t.date);
        return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
    });

    const totalIncome = monthlyTransactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);

    const totalExpenses = monthlyTransactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);

    const savings = Math.max(0, totalIncome - totalExpenses);

    const openModal = (type: TransactionType) => {
        setModalType(type);
        setIsModalOpen(true);
    };

    return (
        <div className="p-6 md:p-8 space-y-8 animate-in fade-in duration-500">

            {/* Welcome Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-white">
                        Buenos días, {' '}
                        {isLoading ? (
                            <span className="inline-block h-8 w-32 bg-white/10 animate-pulse rounded-lg"></span>
                        ) : (
                            <span className="text-[#9AD93D]">{data.userName}</span>
                        )}
                    </h2>
                    <p className="text-zinc-400 mt-1">Controla tus finanzas y alcanza tus objetivos</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Left Column (Main Content) */}
                <div className="lg:col-span-2 space-y-6">

                    {/* Top Section: Card + Quick Actions */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <CardsCarousel />

                        {/* Quick Actions moved here */}
                        <div className="bg-zinc-900/50 backdrop-blur-xl rounded-[32px] p-6 border border-white/5 shadow-2xl flex flex-col justify-center">
                            <h3 className="text-white font-semibold text-lg mb-4">Acciones Rápidas</h3>
                            <div className="grid grid-cols-2 gap-3 h-full">
                                <button
                                    onClick={() => openModal('income')}
                                    className="bg-white/5 hover:bg-white/10 border border-white/5 p-4 rounded-2xl flex flex-col items-center justify-center gap-2 group transition-all duration-300"
                                >
                                    <div className="w-10 h-10 rounded-full bg-[#9AD93D]/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                                        <ArrowUpRight className="text-[#9AD93D]" size={20} />
                                    </div>
                                    <span className="text-zinc-300 font-medium text-sm">Ingreso</span>
                                </button>
                                <button
                                    onClick={() => openModal('expense')}
                                    className="bg-white/5 hover:bg-white/10 border border-white/5 p-4 rounded-2xl flex flex-col items-center justify-center gap-2 group transition-all duration-300"
                                >
                                    <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                                        <ArrowDownRight className="text-red-400" size={20} />
                                    </div>
                                    <span className="text-zinc-300 font-medium text-sm">Gasto</span>
                                </button>
                            </div>
                        </div>
                    </div>



                    {/* Summary Grid (Now 2x2 with Goal) */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <SummaryCard
                            title="Ingresos"
                            amount={totalIncome}
                            icon={TrendingUp}
                            color="text-[#9AD93D]"
                            bgColor="bg-[#9AD93D]/10"
                        />
                        <SummaryCard
                            title="Gastos"
                            amount={totalExpenses}
                            icon={ArrowDownRight}
                            color="text-red-400"
                            bgColor="bg-red-400/10"
                        />
                        <SummaryCard
                            title="Ahorros"
                            amount={savings}
                            icon={PiggyBank}
                            color="text-[#B3F2CF]"
                            bgColor="bg-[#B3F2CF]/10"
                        />

                        {/* Monthly Goal moved here */}
                        <div className="bg-zinc-900/50 backdrop-blur-xl rounded-[24px] p-5 border border-white/5 hover:scale-[1.02] transition-all duration-300 shadow-lg flex flex-col justify-between">
                            <div className="flex justify-between items-center mb-2">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
                                        <Wallet size={20} />
                                    </div>
                                    <div>
                                        <p className="text-zinc-400 text-sm">Objetivo Mensual</p>
                                        <p className="text-white font-bold text-lg">{formatCurrency(savings)}</p>
                                    </div>
                                </div>
                                <span className="text-xs text-zinc-500">/ {formatCurrency(data.monthlyGoal)}</span>
                            </div>
                            <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden mt-3">
                                <div
                                    className="h-full bg-blue-500 rounded-full transition-all duration-1000"
                                    style={{ width: `${Math.min(100, (savings / data.monthlyGoal) * 100)}%` }}
                                ></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column (Sidebar) */}
                <div className="space-y-6">

                    {/* Recent Transactions */}
                    <div className="bg-zinc-900/50 backdrop-blur-xl rounded-[32px] p-6 border border-white/5 shadow-2xl h-full">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-white font-semibold text-lg">Recientes</h3>
                            <button className="text-[#9AD93D] text-sm hover:underline">Ver todas</button>
                        </div>

                        <div className="space-y-4">
                            {data.transactions.slice(-8).map((t) => ( // Showing more transactions since we have height
                                <div key={t.id} className="flex items-center justify-between group p-3 hover:bg-white/5 rounded-2xl transition-all duration-300">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-lg">
                                            {getCategoryIcon(t.category)}
                                        </div>
                                        <div>
                                            <p className="text-white font-medium text-sm">{t.description}</p>
                                            <p className="text-zinc-500 text-xs">{formatDate(t.date)}</p>
                                        </div>
                                    </div>
                                    <span className={clsx(
                                        "font-medium text-sm",
                                        t.type === 'income' ? 'text-[#9AD93D]' : 'text-white'
                                    )}>
                                        {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount)}
                                    </span>
                                </div>
                            ))}

                            {data.transactions.length === 0 && (
                                <div className="text-center py-8 text-zinc-500 text-sm">
                                    No hay transacciones recientes.
                                </div>
                            )}
                        </div>
                    </div>

                </div>
            </div>

            <TransactionModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                type={modalType}
            />
        </div>
    );
}

function SummaryCard({ title, amount, icon: Icon, color, bgColor }: any) {
    return (
        <div className="bg-zinc-900/50 backdrop-blur-xl rounded-[24px] p-5 border border-white/5 hover:scale-[1.02] transition-all duration-300 shadow-lg">
            <div className={clsx("w-10 h-10 rounded-xl flex items-center justify-center mb-4", bgColor, color)}>
                <Icon size={20} />
            </div>
            <div>
                <p className="text-zinc-400 text-sm mb-1">{title}</p>
                <h4 className="text-2xl font-bold text-white">{formatCurrency(amount)}</h4>
            </div>
        </div>
    )
}

function getCategoryIcon(category: string) {
    const icons: { [key: string]: string } = {
        vivienda: '🏠',
        telecomunicaciones: '📱',
        seguros: '🛡️',
        suscripciones: '📺',
        alimentacion: '🛒',
        transporte: '🚗',
        suministros: '💡',
        salud: '🏥',
        ocio: '🍽️',
        entretenimiento: '🎬',
        compras: '🛍️',
        viajes: '✈️',
        salario: '💼',
        freelance: '💻',
        inversiones: '📈',
        otros_ingresos: '💰',
        hogar: '🏠',
        educacion: '🎓'
    };
    return icons[category] || '💰';
}
