"use client";

import React from 'react';
import { Search, Calendar, Filter, Download } from 'lucide-react';

export function AnalyticsToolbar() {
    return (
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-[#1A2326] p-4 rounded-2xl border border-white/5 shadow-sm">

            {/* Left: Search */}
            <div className="relative w-full md:w-96">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
                <input
                    type="text"
                    placeholder="Buscar transacciones, categorías..."
                    className="w-full pl-10 pr-4 py-2.5 bg-black/20 border border-white/5 rounded-xl text-sm text-white focus:outline-none focus:border-[#9AD93D] transition-colors placeholder:text-zinc-600"
                />
            </div>

            {/* Right: Actions */}
            <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 font-medium">

                <button className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 text-zinc-300 rounded-xl text-sm transition-colors border border-white/5 whitespace-nowrap">
                    <Calendar size={16} />
                    <span>Este Año</span>
                </button>

                <button className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 text-zinc-300 rounded-xl text-sm transition-colors border border-white/5 whitespace-nowrap">
                    <Filter size={16} />
                    <span>Filtros</span>
                </button>

                <button className="flex items-center gap-2 px-4 py-2 bg-[#9AD93D]/10 hover:bg-[#9AD93D]/20 text-[#9AD93D] rounded-xl text-sm transition-colors border border-[#9AD93D]/20 whitespace-nowrap">
                    <Download size={16} />
                    <span>Exportar</span>
                </button>
            </div>
        </div>
    );
}
