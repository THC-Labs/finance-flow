"use client";

import { useFinanceData } from '../hooks/useFinanceData';
import { formatCurrency, formatDate } from '../utils/format';
import { CashFlowChart } from './CashFlowChart';
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
    const { data } = useFinanceData();
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

    // Use currentAccountBalance if available, else derive from monthly (simplified for now)
    // In the original app, currentAccountBalance was hardcoded or accumulated. 
    // Here we use the context state.
    const currentBalance = data.currentAccountBalance;

    const openModal = (type: TransactionType) => {
        setModalType(type);
        setIsModalOpen(true);
    };

    return (
        <div className="p-6 md:p-8 space-y-8 animate-in fade-in duration-500">

            {/* Welcome Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-white">Buenos días, <span className="text-[#b4f827]">{data.userName}</span></h2>
                    <p className="text-zinc-400 mt-1">Controla tus finanzas y alcanza tus objetivos</p>
                </div>
                <div className="relative w-full md:w-auto">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
                    <input
                        type="text"
                        placeholder="Buscar transacción..."
                        className="w-full md:w-64 pl-10 pr-4 py-2 bg-zinc-900 border border-zinc-800 rounded-full text-sm text-white focus:outline-none focus:border-[#b4f827] transition-colors"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Left Column */}
                <div className="lg:col-span-2 space-y-6">

                    {/* Wallet Card */}
                    <div className="bg-zinc-900 rounded-3xl p-6 border border-zinc-800 relative overflow-hidden group hover:border-zinc-700 transition-all">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-[#b4f827]/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>

                        <div className="flex justify-between items-start mb-8 relative z-10">
                            <div>
                                <h3 className="text-white font-semibold text-lg flex items-center gap-2">
                                    <Wallet className="text-[#b4f827]" size={20} /> Mi Cartera
                                </h3>
                                <p className="text-zinc-500 text-sm">Ahorro fácil y eficiente</p>
                            </div>
                            <button
                                onClick={() => openModal('income')}
                                className="bg-[#b4f827] hover:bg-[#a3e622] text-black px-4 py-2 rounded-full font-medium text-sm flex items-center gap-2 transition-transform active:scale-95"
                            >
                                <span>Añadir</span>
                                <Plus size={16} />
                            </button>
                        </div>

                        <div className="mb-8 relative z-10">
                            <span className="text-4xl md:text-5xl font-bold text-white tracking-tight block">
                                {formatCurrency(data.currentAccountBalance)}
                            </span>
                            <span className="text-zinc-500 text-sm font-medium mt-1 block">Balance Total</span>
                        </div>

                        <div className="flex gap-3 relative z-10 overflow-x-auto pb-2 scrollbar-hide">
                            {['Viajes', 'Hogar', 'Educación'].map((cat) => (
                                <div key={cat} className="bg-zinc-950/50 border border-zinc-800/50 px-4 py-2 rounded-xl text-zinc-300 text-sm hover:bg-zinc-800 hover:text-white cursor-pointer transition-colors whitespace-nowrap">
                                    {cat}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Summary Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <SummaryCard
                            title="Ingresos"
                            amount={totalIncome}
                            icon={TrendingUp}
                            color="text-purple-400"
                            bgColor="bg-purple-400/10"
                            trend="+12%"
                        />
                        <SummaryCard
                            title="Gastos"
                            amount={totalExpenses}
                            icon={ArrowDownRight}
                            color="text-red-400"
                            bgColor="bg-red-400/10"
                            trend="-5%"
                        />
                        <SummaryCard
                            title="Ahorros"
                            amount={savings}
                            icon={PiggyBank}
                            color="text-blue-400"
                            bgColor="bg-blue-400/10"
                            trend="+8%"
                        />
                    </div>

                    {/* Chart Section */}
                    <div className="bg-zinc-900 rounded-3xl p-6 border border-zinc-800">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-white font-semibold text-lg">Flujo de Efectivo</h3>
                            <select className="bg-zinc-950 border border-zinc-800 text-zinc-300 text-sm rounded-lg px-3 py-1 focus:outline-none">
                                <option>Mes Actual</option>
                                <option>Anual</option>
                            </select>
                        </div>
                        <div className="h-64 w-full">
                            <CashFlowChart />
                        </div>
                    </div>

                </div>

                {/* Right Column */}
                <div className="space-y-6">

                    {/* Quick Actions */}
                    <div className="bg-zinc-900 rounded-3xl p-6 border border-zinc-800">
                        <h3 className="text-white font-semibold text-lg mb-4">Acciones Rápidas</h3>
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                onClick={() => openModal('income')}
                                className="bg-zinc-950 hover:bg-zinc-800 border border-zinc-800 p-4 rounded-2xl flex flex-col items-center justify-center gap-2 group transition-all"
                            >
                                <div className="w-10 h-10 rounded-full bg-[#b4f827]/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <ArrowUpRight className="text-[#b4f827]" size={20} />
                                </div>
                                <span className="text-zinc-300 font-medium text-sm">Ingreso</span>
                            </button>
                            <button
                                onClick={() => openModal('expense')}
                                className="bg-zinc-950 hover:bg-zinc-800 border border-zinc-800 p-4 rounded-2xl flex flex-col items-center justify-center gap-2 group transition-all"
                            >
                                <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <ArrowDownRight className="text-red-400" size={20} />
                                </div>
                                <span className="text-zinc-300 font-medium text-sm">Gasto</span>
                            </button>
                        </div>
                    </div>

                    {/* Recent Transactions */}
                    <div className="bg-zinc-900 rounded-3xl p-6 border border-zinc-800 h-fit">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-white font-semibold text-lg">Recientes</h3>
                            <button className="text-[#b4f827] text-sm hover:underline">Ver todas</button>
                        </div>

                        <div className="space-y-4">
                            {data.transactions.slice(-5).reverse().map((t) => (
                                <div key={t.id} className="flex items-center justify-between group">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-lg">
                                            {/* Placeholder for category icon until we map it properly */}
                                            {getCategoryIcon(t.category)}
                                        </div>
                                        <div>
                                            <p className="text-white font-medium text-sm">{t.description}</p>
                                            <p className="text-zinc-500 text-xs">{formatDate(t.date)}</p>
                                        </div>
                                    </div>
                                    <span className={clsx(
                                        "font-medium text-sm",
                                        t.type === 'income' ? 'text-[#b4f827]' : 'text-white'
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

                    {/* Monthly Goal */}
                    <div className="bg-zinc-900 rounded-3xl p-6 border border-zinc-800">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-white font-semibold text-lg">Objetivo Mensual</h3>
                            <span className="bg-blue-500/10 text-blue-400 text-xs px-2 py-1 rounded-full border border-blue-500/20">En progreso</span>
                        </div>

                        <div className="flex justify-between text-sm mb-2">
                            <span className="text-zinc-400">Ahorro</span>
                            <span className="text-white font-medium">{formatCurrency(savings)} <span className="text-zinc-500">/ {formatCurrency(data.monthlyGoal)}</span></span>
                        </div>

                        <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-blue-500 rounded-full transition-all duration-1000"
                                style={{ width: `${Math.min(100, (savings / data.monthlyGoal) * 100)}%` }}
                            ></div>
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

function SummaryCard({ title, amount, icon: Icon, color, bgColor, trend }: any) {
    return (
        <div className="bg-zinc-900 rounded-2xl p-5 border border-zinc-800 hover:border-zinc-700 transition-colors">
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
