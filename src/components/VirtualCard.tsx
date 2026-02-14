import { clsx } from "clsx";

interface VirtualCardProps {
    balance: number;
    holderName: string;
    cardName: string;
    type: string;
    color: string;
    cardNumber: string;
    isStacked?: boolean;
    lastTransactionInfo?: string; // New prop for last transaction
}

export function VirtualCard({
    balance,
    holderName,
    cardName,
    type,
    color,
    cardNumber,
    isStacked = false,
    lastTransactionInfo
}: VirtualCardProps) {

    // Format balance
    const formattedBalance = new Intl.NumberFormat('es-ES', {
        style: 'currency',
        currency: 'EUR',
        minimumFractionDigits: 2
    }).format(balance);

    return (
        <div
            className={clsx(
                "relative w-full h-full rounded-[32px] overflow-hidden transition-all duration-300 select-none shadow-2xl",
                isStacked ? "shadow-md" : "shadow-2xl"
            )}
            style={{
                backgroundColor: color,
                opacity: 1 // Force opaque
            }}
        >
            {/* Background Texture/Noise - Adjusted opacity */}
            <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]"></div>

            {/* Glossy Overlay - Reduced intensity to keep color true */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-black/20"></div>

            {/* Content Container */}
            <div className="relative h-full flex flex-col justify-between p-8 text-white z-10">

                {/* Header: Name + Logo */}
                <div className="flex justify-between items-start">
                    <div>
                        <div className="text-xs font-semibold tracking-wider opacity-70 uppercase mb-1">{cardName}</div>
                        <div className="text-4xl font-bold tracking-tight">{formattedBalance}</div>
                    </div>
                    {/* Mastercard Logo Circles */}
                    <div className="flex -space-x-3 opacity-80">
                        <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm"></div>
                        <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm"></div>
                    </div>
                </div>

                {/* Footer: Details */}
                <div className="mt-auto">
                    {/* Middle Section: Card Number OR Last Transaction */}
                    <div className="mb-6 font-mono text-lg tracking-widest opacity-90 truncate">
                        {lastTransactionInfo ? (
                            <div className="flex items-center gap-2 text-base font-sans font-medium">
                                <span className="opacity-70">Último:</span>
                                <span>{lastTransactionInfo}</span>
                            </div>
                        ) : (
                            cardNumber
                        )}
                    </div>

                    <div className="flex justify-between items-end">
                        <div className="font-bold italic opacity-60 tracking-wider">FINANCEFLOW</div>
                        <div className="text-xs opacity-60 text-right">
                            <div className="text-[10px] font-bold">EXP</div>
                            09/28
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
