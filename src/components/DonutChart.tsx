"use client";

import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend
} from 'chart.js';

ChartJS.register(
    ArcElement,
    Tooltip,
    Legend
);

export function DonutChart() {
    const data = {
        labels: ['Vivienda', 'Alimentación', 'Ocio', 'Transporte', 'Otros'],
        datasets: [
            {
                label: 'Gastos',
                data: [1200, 450, 300, 150, 200],
                backgroundColor: [
                    '#9AD93D', // Primary Neon
                    '#4BA66A', // Secondary Green
                    '#B3F2CF', // Pale Green
                    '#ffffff', // White
                    '#27272a', // Zinc 800
                ],
                borderColor: '#1A2326', // Match background
                borderWidth: 5,
                hoverOffset: 4
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '70%',
        plugins: {
            legend: {
                position: 'right' as const,
                labels: {
                    color: '#A1A1AA',
                    usePointStyle: true,
                    pointStyle: 'circle',
                    padding: 20,
                    font: {
                        size: 12
                    }
                }
            },
            tooltip: {
                backgroundColor: '#1A2326',
                titleColor: '#fff',
                bodyColor: '#A1A1AA',
                borderColor: 'rgba(255,255,255,0.1)',
                borderWidth: 1,
                callbacks: {
                    label: function (context: any) {
                        let label = context.label || '';
                        if (label) {
                            label += ': ';
                        }
                        if (context.parsed !== null) {
                            label += new Intl.NumberFormat('en-US', { style: 'currency', currency: 'EUR' }).format(context.parsed);
                        }
                        return label;
                    }
                }
            }
        },
    };

    return (
        <div className="relative h-full w-full flex items-center justify-center">
            <Doughnut data={data} options={options} />
            {/* Center Text Overlay */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none pr-20 md:pr-24 lg:pr-28 xl:pr-32">
                {/* Padding right is a hack to center it visually relative to the donut, excluding legend */}
                <div className="text-center">
                    <p className="text-zinc-500 text-xs">Total</p>
                    <p className="text-white font-bold text-lg">2.3k€</p>
                </div>
            </div>
        </div>
    );
}
