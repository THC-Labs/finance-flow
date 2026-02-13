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

export function SplineChart() {
    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false,
            },
            tooltip: {
                backgroundColor: '#1A2326',
                titleColor: '#fff',
                bodyColor: '#A1A1AA',
                borderColor: 'rgba(255,255,255,0.1)',
                borderWidth: 1,
                padding: 10,
                displayColors: false,
            }
        },
        scales: {
            x: {
                grid: {
                    display: true,
                    color: 'rgba(255, 255, 255, 0.05)'
                },
                ticks: {
                    color: '#71717a'
                },
                border: {
                    display: false
                }
            },
            y: {
                grid: {
                    display: true,
                    color: 'rgba(255, 255, 255, 0.05)'
                },
                ticks: {
                    color: '#71717a',
                    callback: (value: any) => `$${value}`
                },
                border: {
                    display: false
                }
            },
        },
        interaction: {
            mode: 'index' as const,
            intersect: false,
        },
        tension: 0.4, // Smooth curve
    };

    const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    const data = {
        labels,
        datasets: [
            {
                fill: true,
                label: 'Income',
                data: [12000, 19000, 15000, 25000, 22000, 30000, 28000, 35000, 20000, 40000, 42000, 50000],
                borderColor: '#9AD93D',
                backgroundColor: (context: ScriptableContext<'line'>) => {
                    const ctx = context.chart.ctx;
                    const gradient = ctx.createLinearGradient(0, 0, 0, 400);
                    gradient.addColorStop(0, 'rgba(154, 217, 61, 0.5)');
                    gradient.addColorStop(1, 'rgba(154, 217, 61, 0)');
                    return gradient;
                },
                borderWidth: 3,
                pointRadius: 0,
                pointHoverRadius: 6,
                pointHoverBackgroundColor: '#9AD93D',
                pointHoverBorderColor: '#fff',
                pointHoverBorderWidth: 2,
            },
            {
                fill: true,
                label: 'Expenses',
                data: [8000, 12000, 10000, 18000, 15000, 22000, 20000, 25000, 15000, 30000, 32000, 38000],
                borderColor: '#4BA66A', // Secondary green
                backgroundColor: 'transparent',
                borderWidth: 2,
                pointRadius: 0,
                pointHoverRadius: 4,
                borderDash: [5, 5], // Dashed line for expenses
            },
        ],
    };

    return <Line options={options} data={data} />;
}
