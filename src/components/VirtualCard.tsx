import React from 'react';
import { Loader2 } from 'lucide-react';
import { formatCurrency } from '../utils/format';
import { clsx } from 'clsx';

interface VirtualCardProps {
    balance: number;
    currency?: string;
    loading?: boolean;
    cardNumber?: string;
    expiryDate?: string;
    holderName?: string;
    cardName?: string;
    type?: string;
    color?: string;
    isStacked?: boolean; // New prop to control visibility of details when stacked
}

export function VirtualCard({
    balance,
    currency = 'EUR',
    loading = false,
    cardNumber = '**** **** **** 4589',
    expiryDate = '09/28',
    holderName = 'Usuario',
    cardName = 'Main Account',
    type = 'debit',
    color = 'from-[#1A2326]',
    isStacked = false
}: VirtualCardProps) {

    const isTailwindClass = color.startsWith('bg-') || color.startsWith('from-');

    return (
        <div className={clsx(
            "relative overflow-hidden rounded-[24px] p-6 h-full w-full transition-all duration-300 shadow-xl border border-white/10",
            isStacked ? "opacity-100" : ""
        )}
            style={{
                background: isTailwindClass ? undefined : `linear-gradient(135deg, ${color}, #000000)`
            }}
        >
            {/* Background Gradient fallback or override */}
            <div className={clsx(
                "absolute inset-0 z-0 bg-gradient-to-br to-black/80",
                isTailwindClass ? color : ""
            )}></div>

            {/* Noise Texture - Subtle */}
            <div className="absolute inset-0 opacity-10 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] z-0 mix-blend-overlay"></div>

            {/* Content Container */}
            <div className="relative z-10 flex flex-col justify-between h-full text-white">

                {/* Top: Card Name & Logo */}
                <div className="flex justify-between items-start">
                    <div>
                        <p className="text-white/60 text-xs font-medium tracking-wide uppercase mb-1">{cardName}</p>
                        {loading ? (
                            <Loader2 className="w-6 h-6 animate-spin text-white" />
                        ) : (
                            <h3 className="text-3xl font-bold tracking-tight text-white">
                                {formatCurrency(balance)}
                            </h3>
                        )}
                    </div>
                    {/* Mastercard/Visa minimal circle logo */}
                    <div className="flex -space-x-2 opacity-80">
                        <div className="w-6 h-6 rounded-full bg-white/20 backdrop-blur-sm"></div>
                        <div className="w-6 h-6 rounded-full bg-white/40 backdrop-blur-sm"></div>
                    </div>
                </div>

                {/* Bottom: Details (Hidden if stacked to clear visual noise, or keep minimal) */}
                {!isStacked && (
                    <div className="space-y-4">
                        {/* Card Number */}
                        <div className="font-mono text-lg tracking-widest text-white/90">
                            •••• {cardNumber.slice(-4)}
                        </div>

                        {/* Footer Info */}
                        <div className="flex justify-between items-end text-xs text-white/60 font-medium">
                            <div className="uppercase tracking-wider italic">
                                FinanceFlow
                            </div>
                            <div className="flex flex-col items-end">
                                <span className="text-[9px] uppercase tracking-widest opacity-60">Exp</span>
                                <span>{expiryDate}</span>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
