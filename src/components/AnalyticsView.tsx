"use client";

import React from 'react';
import { AnalyticsToolbar } from './AnalyticsToolbar';
import { ComparativeChart } from './ComparativeChart';
import { MasterDataGrid } from './MasterDataGrid';
import { DonutChart } from './DonutChart';
import { ArrowUpRight, TrendingUp, AlertCircle } from 'lucide-react';

export function AnalyticsView() {
    return (
        <div className="p-6 md:p-8 space-y-6 animate-in fade-in duration-500">
            {/* Header / Toolbar */}
            <div className="flex flex-col gap-6">
                <div>
                    <h2 className="text-3xl font-bold text-white">Análisis Financiero</h2>
                    <p className="text-zinc-400 mt-1">Visión detallada de tu rendimiento anual</p>
                </div>
                <AnalyticsToolbar />
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Main Comparative Trend */}
                <div className="lg:col-span-2 bg-[#1A2326] rounded-3xl p-6 border border-white/5 relative overflow-hidden">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-white font-semibold flex items-center gap-2">
                            <TrendingUp size={18} className="text-[#9AD93D]" />
                            Tendencia Anual
                        </h3>
                        <div className="flex items-center gap-2 text-xs font-medium bg-[#9AD93D]/10 text-[#9AD93D] px-2 py-1 rounded-full border border-[#9AD93D]/20">
                            <ArrowUpRight size={14} />
                            +12.4% vs Año Anterior
                        </div>
                    </div>
                    <div className="h-72 w-full">
                        <ComparativeChart />
                    </div>
                </div>

                {/* Distribution / Insights */}
                <div className="bg-[#1A2326] rounded-3xl p-6 border border-white/5 flex flex-col">
                    <h3 className="text-white font-semibold mb-6">Distribución de Gastos</h3>
                    <div className="flex-1 min-h-[200px] mb-4">
                        <DonutChart />
                    </div>

                    {/* Insight Card */}
                    <div className="bg-white/[0.03] rounded-xl p-4 border border-white/5 mt-auto">
                        <div className="flex items-start gap-3">
                            <div className="p-2 bg-yellow-500/10 rounded-lg text-yellow-500 shrink-0">
                                <AlertCircle size={18} />
                            </div>
                            <div>
                                <h4 className="text-zinc-200 text-sm font-medium mb-1">Nota de Atención</h4>
                                <p className="text-zinc-500 text-xs leading-relaxed">
                                    Tus gastos en "Ocio" han subido un 15% comparado con el mes pasado. Considera ajustar el presupuesto.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Master Grid Section */}
            <div className="space-y-4 pt-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-white font-semibold text-lg">Registro Detallado</h3>
                    <span className="text-zinc-500 text-xs">Actualizado hace 2 min</span>
                </div>
                <MasterDataGrid />
            </div>
        </div>
    );
}
