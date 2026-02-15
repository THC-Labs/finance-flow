"use client";

import { useState, useEffect, useRef } from 'react';
import { useFinanceData } from '../hooks/useFinanceData';
import { VirtualCard } from './VirtualCard';
import { formatCurrency, formatDate } from '../utils/format';
import { clsx } from 'clsx';
import { ChevronRight, ArrowUpRight, ArrowDownLeft, Wallet } from 'lucide-react';

export function CardsCarousel() {
    const { data, isLoading } = useFinanceData();
    // activeCardId refers to the card currently "selected" and displayed on TOP of the left stack
    const [activeCardId, setActiveCardId] = useState<string | null>(null);

    useEffect(() => {
        if (!isLoading && data.cards.length > 0 && !activeCardId) {
            setActiveCardId(data.cards[0].id);
        }
    }, [data.cards, isLoading, activeCardId]);

    if (isLoading) {
        return <div className="h-80 w-full bg-zinc-900/50 animate-pulse rounded-3xl"></div>;
    }

    const totalBalance = data.cards.reduce((sum, c) => sum + Number(c.balance), 0);

    // 1. STATE & TRANSITION LOGIC
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [displayCardId, setDisplayCardId] = useState<string | null>(null);

    // Initial load
    useEffect(() => {
        if (!isLoading && data.cards.length > 0 && !activeCardId) {
            setActiveCardId(data.cards[0].id);
            setDisplayCardId(data.cards[0].id);
        }
    }, [data.cards, isLoading, activeCardId]);

    // Handle Card Selection Change with Animation
    useEffect(() => {
        if (activeCardId && activeCardId !== displayCardId) {
            setIsTransitioning(true);
            const timer = setTimeout(() => {
                setDisplayCardId(activeCardId);
                setIsTransitioning(false);
            }, 300); // Wait for vanish-out
            return () => clearTimeout(timer);
        }
    }, [activeCardId, displayCardId]);

    // Derived Data based on displayCardId (the one currently animating or shown)
    const activeCard = data.cards.find(c => c.id === (displayCardId || activeCardId)) || data.cards[0];
    const stackedCards = data.cards.filter(c => c.id !== (displayCardId || activeCardId));

    if (!activeCard) {
        return (
            <div className="w-full h-[450px] flex items-center justify-center text-zinc-500 animate-pulse">
                Cargando tarjetas...
            </div>
        );
    }

    // Get last transaction for information display on card
    const lastTransaction = data.transactions.find(t => t.card_id === activeCard.id);
    const lastTransactionInfo = lastTransaction
        ? `${lastTransaction.description.substring(0, 15)}${lastTransaction.description.length > 15 ? '...' : ''}  ${lastTransaction.type === 'income' ? '+' : ''}${formatCurrency(lastTransaction.amount)}`
        : 'Sin movimientos';

    // Helper for card colors
    const getCardColor = (providedColor?: string) => {
        if (providedColor && providedColor.trim() !== '') return providedColor;
        return '#000000';
    };

    const activeCardColors = getCardColor(activeCard.color);

    // 2. SCROLL NAVIGATION LOGIC
    const lastScrollTime = useRef(0);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const handleWheel = (e: WheelEvent) => {
            e.preventDefault();
            e.stopPropagation();

            const now = Date.now();
            // Throttle slightly more than animation + transition delay
            if (now - lastScrollTime.current < 700) return;

            lastScrollTime.current = now;

            const currentIndex = data.cards.findIndex(c => c.id === activeCardId);
            if (currentIndex === -1) return;

            if (e.deltaY > 0) {
                const nextIndex = (currentIndex + 1) % data.cards.length;
                setActiveCardId(data.cards[nextIndex].id);
            } else {
                const prevIndex = (currentIndex - 1 + data.cards.length) % data.cards.length;
                setActiveCardId(data.cards[prevIndex].id);
            }
        };

        container.addEventListener('wheel', handleWheel, { passive: false });
        return () => container.removeEventListener('wheel', handleWheel);
    }, [data.cards, activeCardId]);


    return (
        // Layout: Left = Cards Stack / Right = Wallet Summary
        // Align items-center to vertically center the stack relative to the wallet summary or vice versa
        <div className="w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center px-4">

            {/* LEFT COLUMN: THE CARD STACK (Includes Active Card) */}
            <div
                ref={containerRef}
                className="relative h-[340px] md:h-[380px] flex items-center justify-center perspective-1000"
            >

                {/* 1. Stacked Cards (Behind Active) */}
                {stackedCards.map((card, index) => {
                    const cardColor = getCardColor(card.color);
                    // Visual offset logic:
                    // Stack them upwards/backwards behind the active card?
                    // Or downwards?
                    // Let's stack them BEHIND, slightly offset downwards to simulate a pile.
                    // Scale down slightly.

                    const offset = (index + 1) * 15; // 15px down for each card in stack
                    const scale = 1 - ((index + 1) * 0.05); // slightly smaller
                    const zIndex = 10 - index; // lower z-index

                    return (
                        <div
                            key={card.id}
                            className="absolute w-full max-w-[420px] aspect-[1.586] transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] cursor-pointer shadow-xl rounded-[32px] group"
                            style={{
                                zIndex: zIndex,
                                left: '50%',
                                top: '50%',
                                transform: `translate(-50%, -50%) translateY(${offset}px) scale(${scale})`,
                                opacity: 1, // FORCE OPAQUE
                            }}
                            onClick={() => setActiveCardId(card.id)}
                        >
                            <div
                                className="w-full h-full relative overflow-hidden rounded-[32px] border border-white/10 transition-colors duration-300"
                                style={{ backgroundColor: cardColor, opacity: 1 }}
                            >
                                {/* Align with VirtualCard layers for consistent color appearance */}
                                <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]"></div>
                                <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-black/20 group-hover:from-white/20 group-hover:to-black/10 transition-colors duration-300"></div>
                            </div>
                        </div>
                    );
                })}

                {/* 2. Active Card - FRONT & CENTER */}
                <div
                    key={displayCardId}
                    className={clsx(
                        "relative w-full max-w-[420px] z-50 transition-transform duration-300",
                        isTransitioning ? "animate-card-out" : "animate-card-in"
                    )}
                >
                    <div className="aspect-[1.586] w-full relative shadow-2xl">
                        <VirtualCard
                            balance={Number(activeCard.balance)}
                            holderName={data.userName}
                            cardName={activeCard.name}
                            type={activeCard.type}
                            color={activeCardColors}
                            cardNumber={`**** **** **** ${activeCard.last4 || '0000'}`}
                            isStacked={false}
                            lastTransactionInfo={lastTransactionInfo}
                        />
                    </div>
                    {/* Shadow/Glow specific to active card */}
                    <div
                        className="absolute -inset-4 bg-gradient-to-br from-current to-transparent opacity-30 blur-2xl -z-10 rounded-full"
                        style={{ color: activeCardColors }}
                    ></div>
                </div>

            </div>


            {/* RIGHT COLUMN: Wallet Summary (Empty of cards) */}
            <div className="flex flex-col items-center justify-center animate-in fade-in slide-in-from-right-8 duration-700">

                <div className="relative w-full max-w-[380px] group cursor-pointer hover:scale-[1.02] transition-transform duration-300">
                    <div className="w-full h-[240px] bg-black rounded-[40px] p-8 flex flex-col justify-end relative overflow-hidden border border-zinc-800 shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
                        {/* Lip */}
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-10 bg-black rounded-b-[32px] z-30 border-b border-white/5 shadow-lg"></div>

                        <div className="relative z-40 pointer-events-auto">
                            <div className="flex items-center gap-2 mb-2">
                                <Wallet className="w-4 h-4 text-[#9AD93D]" />
                                <span className="text-zinc-500 text-sm font-medium">Billetera</span>
                            </div>
                            <h2 className="text-4xl font-bold text-white tracking-tight">{formatCurrency(totalBalance)}</h2>

                            <div className="mt-4 flex items-center justify-between text-zinc-500 text-sm">
                                <span className="flex items-center gap-2">
                                    <span className="w-6 h-6 rounded-full bg-zinc-800 flex items-center justify-center text-xs text-white border border-white/10">{data.cards.length}</span>
                                    Tarjetas vinculadas
                                </span>
                            </div>
                        </div>
                        {/* Shine */}
                        <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/5 rounded-full blur-3xl pointer-events-none"></div>
                    </div>
                </div>

            </div>
        </div>
    );
}
