"use client";

import { useState, useEffect } from 'react';
import { useFinanceData } from '../hooks/useFinanceData';
import { VirtualCard } from './VirtualCard';
import { Plus, X } from 'lucide-react';
import { clsx } from 'clsx';

export function CardsCarousel() {
    const { data, addCard, isLoading } = useFinanceData();
    const [isAdding, setIsAdding] = useState(false);
    const [activeCardId, setActiveCardId] = useState<string | null>(null);

    // Form State
    const [name, setName] = useState('');
    const [balance, setBalance] = useState('');
    const [type, setType] = useState<'debit' | 'credit' | 'cash' | 'savings'>('debit');
    const [color, setColor] = useState('bg-gradient-to-br from-zinc-800 to-zinc-950');

    // Determine initial active card
    useEffect(() => {
        if (!isLoading && data.cards.length > 0 && !activeCardId) {
            const lastTx = data.transactions[0];
            if (lastTx && lastTx.card_id) {
                const cardExists = data.cards.find(c => c.id === lastTx.card_id);
                if (cardExists) {
                    setActiveCardId(lastTx.card_id);
                    return;
                }
            }
            const lastCard = data.cards[data.cards.length - 1];
            setActiveCardId(lastCard.id);
        }
    }, [data.cards, data.transactions, isLoading, activeCardId]);

    const handleAddCard = async (e: React.FormEvent) => {
        e.preventDefault();
        await addCard({
            name,
            balance: Number(balance),
            type,
            color,
            last4: Math.floor(1000 + Math.random() * 9000).toString()
        });
        setIsAdding(false);
        setName('');
        setBalance('');
        setType('debit');
    };

    const colors = [
        { label: 'Obsidian', value: 'bg-gradient-to-br from-zinc-800 to-zinc-950' },
        { label: 'Emerald', value: 'bg-gradient-to-br from-emerald-900 to-emerald-950' },
        { label: 'Midnight', value: 'bg-gradient-to-br from-blue-900 to-blue-950' },
        { label: 'Ruby', value: 'bg-gradient-to-br from-red-900 to-red-950' },
        { label: 'Gold', value: 'bg-gradient-to-br from-yellow-700 to-yellow-900' },
    ];

    if (isLoading) {
        return <div className="h-64 w-full bg-zinc-900/50 animate-pulse rounded-3xl"></div>;
    }

    const activeCard = data.cards.find(c => c.id === activeCardId) || data.cards[0];

    return (
        /* Container increased height to accommodate vertical stack */
        <div className="w-full h-[360px] flex items-center relative overflow-visible pl-2 md:pl-0">
            {data.cards.length > 0 && activeCard && (
                <div className="relative w-full h-full">
                    {/* Render cards */}
                    {data.cards.map((card, index) => {
                        // Use activeCard.id to ensure fallback works even if activeCardId is null
                        const isActive = card.id === activeCard.id;

                        // Calculate visual stacking relative to the derived active card
                        const inactiveList = data.cards.filter(c => c.id !== activeCard.id);
                        const stackIndex = inactiveList.findIndex(c => c.id === card.id);

                        if (isActive) {
                            return (
                                <div
                                    key={card.id}
                                    className="absolute left-0 bottom-0 z-50 w-[360px] h-[225px] transition-all duration-500 ease-out"
                                >
                                    <VirtualCard
                                        balance={Number(card.balance)}
                                        holderName={data.userName}
                                        cardName={card.name}
                                        type={card.type}
                                        color={card.color}
                                        cardNumber={`**** **** **** ${card.last4 || '0000'}`}
                                        isStacked={false}
                                    />
                                    {/* Glow */}
                                    <div className={clsx(
                                        "absolute -inset-4 rounded-[40px] opacity-40 blur-2xl -z-10",
                                        card.color.replace('bg-', 'bg-').split(' ')[0]
                                    )} style={{ background: card.color.includes('gradient') ? undefined : card.color }}></div>
                                </div>
                            )
                        } else {
                            if (stackIndex === -1) return null;

                            // Visual Position:
                            // Stacked behind and above.
                            return (
                                <div
                                    key={card.id}
                                    onClick={() => setActiveCardId(card.id)}
                                    className="absolute left-0 w-[360px] h-[225px] cursor-pointer transition-all duration-500 ease-[cubic-bezier(0.25,0.8,0.25,1)] hover:-translate-y-4 hover:brightness-110"
                                    style={{
                                        bottom: `${(stackIndex + 1) * 35}px`, // Move UP from bottom
                                        zIndex: 40 - stackIndex,
                                        transform: `scale(${1 - ((stackIndex + 1) * 0.05)})`, // Scale down slightly as they go back
                                        transformOrigin: 'bottom center'
                                    }}
                                >
                                    {/* Darken overlay for inactive */}
                                    <div className="absolute inset-0 z-50 bg-black/40 hover:bg-black/10 transition-colors rounded-[24px]" />

                                    <VirtualCard
                                        balance={Number(card.balance)}
                                        holderName={data.userName}
                                        cardName={card.name}
                                        type={card.type}
                                        color={card.color}
                                        cardNumber={`**** **** **** ${card.last4 || '0000'}`}
                                        isStacked={true}
                                    />
                                </div>
                            );
                        }
                    })}

                    {/* Add Button - Moved to the right of the active card */}
                    <button
                        onClick={() => setIsAdding(true)}
                        className="absolute top-0 right-0 z-10 w-14 h-14 rounded-full bg-[#1A2326] border border-white/5 hover:border-[#9AD93D] hover:text-[#9AD93D] text-zinc-500 flex items-center justify-center transition-all shadow-xl hover:scale-110 group"
                        title="Añadir Tarjeta"
                    >
                        <Plus size={28} className="group-hover:rotate-90 transition-transform" />
                    </button>

                </div>
            )}

            {/* Add Card Modal */}
            {isAdding && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-zinc-900/80 backdrop-blur-xl border border-white/5 rounded-[40px] w-full max-w-md shadow-2xl p-8 relative animate-in zoom-in-95 duration-200">
                        <button
                            onClick={() => setIsAdding(false)}
                            className="absolute top-6 right-6 text-zinc-500 hover:text-white transition-colors"
                        >
                            <X size={24} />
                        </button>

                        <h2 className="text-2xl font-bold text-white mb-2">Nueva Tarjeta</h2>
                        <p className="text-zinc-400 text-sm mb-8">Añade una nueva fuente de fondos a tu cartera.</p>

                        <form onSubmit={handleAddCard} className="space-y-5">
                            <div className="space-y-2">
                                <label className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Nombre</label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={e => setName(e.target.value)}
                                    placeholder="Ej. Cuenta Personal"
                                    className="w-full bg-black/20 border border-white/5 rounded-2xl px-4 py-3.5 text-white focus:outline-none focus:border-[#9AD93D] focus:ring-1 focus:ring-[#9AD93D] transition-all placeholder:text-zinc-500"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Saldo Inicial</label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500">€</span>
                                    <input
                                        type="number"
                                        value={balance}
                                        onChange={e => setBalance(e.target.value)}
                                        placeholder="0.00"
                                        className="w-full bg-black/20 border border-white/5 rounded-2xl pl-8 pr-4 py-3.5 text-white focus:outline-none focus:border-[#9AD93D] focus:ring-1 focus:ring-[#9AD93D] transition-all placeholder:text-zinc-500"
                                        required
                                        min="0"
                                        step="0.01"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-5">
                                <div className="space-y-2">
                                    <label className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Tipo</label>
                                    <select
                                        value={type}
                                        onChange={e => setType(e.target.value as any)}
                                        className="w-full bg-black/20 border border-white/5 rounded-2xl px-4 py-3.5 text-white focus:outline-none focus:border-[#9AD93D] transition-all appearance-none cursor-pointer"
                                    >
                                        <option value="debit">Débito</option>
                                        <option value="credit">Crédito</option>
                                        <option value="cash">Efectivo</option>
                                        <option value="savings">Ahorros</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Color</label>
                                    <div className="flex gap-2">
                                        {colors.map((c) => (
                                            <button
                                                key={c.value}
                                                type="button"
                                                onClick={() => setColor(c.value)}
                                                className={clsx(
                                                    "w-8 h-8 rounded-full border border-white/10 transition-transform hover:scale-110",
                                                    color === c.value ? "ring-2 ring-white ring-offset-2 ring-offset-[#09090b] scale-110" : "opacity-60 hover:opacity-100"
                                                )}
                                                style={{ background: c.value.includes('gradient') ? undefined : c.value }}
                                                title={c.label}
                                            >
                                                <div className={clsx("w-full h-full rounded-full", c.value)}></div>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-[#9AD93D] hover:bg-[#8ac336] text-black font-bold py-4 rounded-2xl transition-all transform active:scale-[0.98] mt-4 shadow-[0_0_20px_rgba(154,217,61,0.2)] hover:shadow-[0_0_30px_rgba(154,217,61,0.3)]"
                            >
                                Crear Tarjeta
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
