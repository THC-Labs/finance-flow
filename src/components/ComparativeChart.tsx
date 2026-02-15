"use client";

import React from 'react';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Filler,
    Legend,
    ScriptableContext
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Filler,
    Legend
);

export function ComparativeChart() {
    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: true,
                align: 'end' as const,
                labels: {
                    color: '#A1A1AA',
                    usePointStyle: true,
                    boxWidth: 8,
                    font: { size: 11 }
                }
            },
            tooltip: {
                backgroundColor: '#09090b', // Zinc 950
                titleColor: '#fff',
                bodyColor: '#A1A1AA',
                borderColor: 'rgba(255,255,255,0.1)',
                borderWidth: 1,
                padding: 10,
                displayColors: true,
                boxPadding: 4
            }
        },
        scales: {
            x: {
                grid: {
                    display: true,
                    color: 'rgba(255, 255, 255, 0.02)'
                },
                ticks: {
                    color: '#52525b', // Zinc 600
                    font: { size: 11 }
                },
                border: { display: false }
            },
            y: {
                grid: {
                    display: true,
                    color: 'rgba(255, 255, 255, 0.02)'
                },
                ticks: {
                    color: '#52525b',
                    font: { size: 11 },
                    callback: (value: any) => `$${value / 1000}k`
                },
                border: { display: false }
            },
        },
        interaction: {
            mode: 'index' as const,
            intersect: false,
        },
        tension: 0.4,
    };

    const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    const data = {
        labels,
        datasets: [
            {
                fill: true,
                label: '2026 (Actual)',
                data: [12000, 19000, 15000, 25000, 22000, 30000, 28000, 35000, 20000, 40000, 42000, 50000],
                borderColor: '#9AD93D',
                backgroundColor: (context: ScriptableContext<'line'>) => {
                    const ctx = context.chart.ctx;
                    const gradient = ctx.createLinearGradient(0, 0, 0, 300);
                    gradient.addColorStop(0, 'rgba(154, 217, 61, 0.2)');
                    gradient.addColorStop(1, 'rgba(154, 217, 61, 0)');
                    return gradient;
                },
                borderWidth: 2,
                pointRadius: 0,
                pointHoverRadius: 6,
                order: 1
            },
            {
                fill: false,
                label: '2025 (Previo)',
                data: [10000, 15000, 13000, 20000, 18000, 24000, 22000, 28000, 26000, 29000, 35000, 38000],
                borderColor: '#52525b', // Zinc 600
                borderWidth: 2,
                borderDash: [4, 4],
                pointRadius: 0,
                pointHoverRadius: 4,
                order: 2
            },
        ],
    };

    return <Line options={options} data={data} />;
}
