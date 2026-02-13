"use client";

import React from 'react';
import {
    LayoutDashboard,
    CreditCard,
    BarChart3,
    PieChart,
    Tags,
    Settings,
    LogOut
} from 'lucide-react';
import { clsx } from 'clsx';
import { useFinanceData } from '../hooks/useFinanceData';

interface SidebarProps {
    currentView: string;
    onViewChange: (view: string) => void;
}

export function Sidebar({ currentView, onViewChange }: SidebarProps) {
    const { data, signOut } = useFinanceData();
    const navItems = [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'transactions', label: 'Transacciones', icon: CreditCard },
        { id: 'analytics', label: 'Análisis', icon: BarChart3 },
        { id: 'budget', label: 'Presupuesto', icon: PieChart },
        { id: 'categories', label: 'Categorías', icon: Tags },
    ];

    return (
        <aside className="w-20 md:w-64 bg-black/20 backdrop-blur-xl border-r border-white/5 flex flex-col h-screen fixed left-0 top-0 z-50 transition-all duration-300">
            <div className="p-6 flex items-center justify-center md:justify-start gap-3 border-b border-white/5">
                <div className="w-8 h-8 rounded-full border-2 border-primary flex items-center justify-center">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-primary" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                    </svg>
                </div>
                <span className="hidden md:block font-bold text-xl text-white tracking-tight">FinanceFlow</span>
            </div>

            <nav className="flex-1 overflow-y-auto py-6 flex flex-col gap-2 px-3">
                {navItems.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => onViewChange(item.id)}
                        className={clsx(
                            "w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group",
                            currentView === item.id
                                ? "bg-primary text-black shadow-[0_0_20px_rgba(154,217,61,0.2)]"
                                : "text-zinc-400 hover:bg-white/5 hover:text-white"
                        )}
                        title={item.label}
                    >
                        <item.icon size={22} className={clsx(
                            currentView === item.id ? "text-black" : "group-hover:text-primary"
                        )} />
                        <span className={clsx(
                            "hidden md:block font-medium",
                            currentView === item.id ? "font-semibold" : ""
                        )}>{item.label}</span>
                    </button>
                ))}
            </nav>

            <div className="p-4 border-t border-white/5 flex flex-col gap-2">
                <div className="flex items-center gap-3 px-3 py-3 mb-2 rounded-2xl bg-white/5 border border-white/5">
                    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-black font-bold text-xs">
                        {data.userName.charAt(0).toUpperCase()}
                    </div>
                    <div className="hidden md:block overflow-hidden">
                        <p className="text-white text-xs font-bold truncate leading-none mb-1">{data.userName}</p>
                        <p className="text-zinc-500 text-[10px] truncate leading-none">Miembro Premium</p>
                    </div>
                </div>

                <button
                    onClick={() => onViewChange('settings')}
                    className={clsx(
                        "w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group",
                        currentView === 'settings'
                            ? "bg-white/10 text-white"
                            : "text-zinc-400 hover:bg-white/5 hover:text-white"
                    )}
                >
                    <Settings size={22} />
                    <span className="hidden md:block font-medium">Configuración</span>
                </button>

                <button
                    onClick={() => signOut()}
                    className="w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 text-red-400 hover:bg-red-500/10"
                >
                    <LogOut size={22} />
                    <span className="hidden md:block font-medium">Cerrar Sesión</span>
                </button>
            </div>
        </aside>
    );
}
