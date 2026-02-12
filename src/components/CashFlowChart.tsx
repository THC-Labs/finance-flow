"use client";

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ChartData
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { useFinanceData } from '../hooks/useFinanceData';
import { useMemo } from 'react';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

export function CashFlowChart() {
    const { data } = useFinanceData();

    const chartData = useMemo<ChartData<"bar">>(() => {
        // Current month view logic (default)
        const today = new Date();
        const currentMonth = today.getMonth();
        const currentYear = today.getFullYear();
        const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

        const labels = Array.from({ length: daysInMonth }, (_, i) => (i + 1).toString());
        const incomeData = new Array(daysInMonth).fill(0);
        const expenseData = new Array(daysInMonth).fill(0);
        const savingsData = new Array(daysInMonth).fill(0);

        data.transactions.forEach(t => {
            const date = new Date(t.date);
            if (date.getMonth() === currentMonth && date.getFullYear() === currentYear) {
                const day = date.getDate() - 1;
                if (t.type === 'income') {
                    incomeData[day] += t.amount;
                } else {
                    expenseData[day] += t.amount;
                }
            }
        });

        for (let i = 0; i < daysInMonth; i++) {
            savingsData[i] = Math.max(0, incomeData[i] - expenseData[i]);
        }

        return {
            labels,
            datasets: [
                {
                    label: 'Ingresos',
                    data: incomeData,
                    backgroundColor: '#b4f827',
                    borderRadius: 4,
                },
                {
                    label: 'Gastos',
                    data: expenseData,
                    backgroundColor: '#ef4444',
                    borderRadius: 4,
                },
                {
                    label: 'Ahorros',
                    data: savingsData,
                    backgroundColor: '#3b82f6', // blue-500
                    borderRadius: 4,
                },
            ],
        };
    }, [data.transactions]);

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top' as const,
                labels: {
                    color: '#9ca3af' // zinc-400
                }
            },
            title: {
                display: false,
            },
        },
        scales: {
            y: {
                grid: {
                    color: '#27272a' // zinc-800
                },
                ticks: {
                    color: '#9ca3af'
                }
            },
            x: {
                grid: {
                    display: false
                },
                ticks: {
                    color: '#9ca3af'
                }
            }
        }
    };

    return <Bar options={options} data={chartData} />;
}
