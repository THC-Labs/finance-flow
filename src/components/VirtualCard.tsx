import React from 'react';
import { Wallet, Loader2 } from 'lucide-react';
import { formatCurrency } from '../utils/format';

interface VirtualCardProps {
    balance: number;
    currency?: string;
    loading?: boolean;
    cardNumber?: string;
    expiryDate?: string;
    holderName?: string;
}

export function VirtualCard({
    balance,
    currency = 'EUR',
    loading = false,
    cardNumber = '**** **** **** 4589',
    expiryDate = '09/28',
    holderName = 'John Doe'
}: VirtualCardProps) {
    return (
        <div className="relative overflow-hidden rounded-3xl p-8 h-64 w-full transition-transform hover:scale-[1.01] duration-300 group">
            {/* Background Gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#1A2326] via-[#101618] to-black z-0"></div>

            {/* Corporate Neon Glows */}
            <div className="absolute top-[-50%] right-[-20%] w-[80%] h-[80%] bg-primary/20 blur-[80px] rounded-full pointer-events-none group-hover:bg-primary/30 transition-colors duration-500"></div>
            <div className="absolute bottom-[-20%] left-[-10%] w-[60%] h-[60%] bg-secondary/10 blur-[60px] rounded-full pointer-events-none"></div>

            {/* Pattern/Texture Overlay */}
            <div className="absolute inset-0 opacity-20 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] z-0 mix-blend-overlay"></div>

            <div className="relative z-10 flex flex-col justify-between h-full text-white">

                {/* Header */}
                <div className="flex justify-between items-start">
                    <div className="flex flex-col">
                        <span className="text-zinc-400 text-sm font-medium tracking-wide">Total Balance</span>
                        {loading ? (
                            <Loader2 className="w-8 h-8 animate-spin text-primary mt-2" />
                        ) : (
                            <h3 className="text-4xl font-bold tracking-tight mt-1 text-white">
                                {formatCurrency(balance)}
                            </h3>
                        )}
                    </div>
                    <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/10">
                        <div className="flex -space-x-3">
                            <div className="w-6 h-6 rounded-full bg-red-500/80 mix-blend-screen"></div>
                            <div className="w-6 h-6 rounded-full bg-yellow-500/80 mix-blend-screen"></div>
                        </div>
                    </div>
                </div>

                {/* Footer/Details */}
                <div className="space-y-6">
                    <div className="flex items-center gap-4">
                        <div className="flex gap-1">
                            {[1, 2, 3, 4].map((_, i) => (
                                <div key={i} className="w-1.5 h-1.5 rounded-full bg-zinc-500"></div>
                            ))}
                        </div>
                        <div className="flex gap-1">
                            {[1, 2, 3, 4].map((_, i) => (
                                <div key={i} className="w-1.5 h-1.5 rounded-full bg-zinc-500"></div>
                            ))}
                        </div>
                        <div className="flex gap-1">
                            {[1, 2, 3, 4].map((_, i) => (
                                <div key={i} className="w-1.5 h-1.5 rounded-full bg-zinc-500"></div>
                            ))}
                        </div>
                        <span className="font-mono text-zinc-300 tracking-wider text-lg">{cardNumber.slice(-4)}</span>
                    </div>

                    <div className="flex justify-between items-end">
                        <div>
                            <p className="text-xs text-zinc-500 uppercase tracking-wider mb-1">Card Holder</p>
                            <p className="text-sm font-medium text-zinc-200">{holderName}</p>
                        </div>
                        <div>
                            <p className="text-xs text-zinc-500 uppercase tracking-wider mb-1 text-right">Expires</p>
                            <p className="text-sm font-medium text-zinc-200 text-right">{expiryDate}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Shiny border effect */}
            <div className="absolute inset-0 rounded-3xl border border-white/10 pointer-events-none"></div>
        </div>
    );
}
