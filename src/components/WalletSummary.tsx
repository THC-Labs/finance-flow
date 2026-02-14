import { useFinanceData } from '../hooks/useFinanceData';
import { formatCurrency } from '../utils/format';
import { clsx } from 'clsx';

export function WalletSummary() {
    const { data } = useFinanceData();

    // Calculate total balance across all cards
    const totalBalance = data.cards.reduce((sum, card) => sum + Number(card.balance), 0);

    return (
        <div className="relative w-full h-[320px] flex items-center justify-center">
            {/* Back Card (PayPal) */}
            <div className="absolute top-0 w-64 h-40 bg-[#003087] rounded-3xl transform scale-90 -translate-y-12 z-0 flex items-start justify-end p-4 border border-white/5 shadow-2xl">
                <span className="text-white/80 font-bold italic text-lg tracking-wider">PayPal</span>
            </div>

            {/* Middle Card (Revolut/Bank) */}
            <div className="absolute top-8 w-64 h-40 bg-zinc-100 rounded-3xl transform scale-95 -translate-y-6 z-10 flex items-start justify-end p-4 shadow-2xl">
                <span className="text-black/80 font-bold text-lg tracking-tight">Revolut</span>
            </div>

            {/* Front Card (Total Balance) - The "Notched" Wallet Shape */}
            <div className="absolute bottom-0 w-72 h-64 z-20">
                {/* The Main Shape */}
                <div className="w-full h-full bg-black rounded-[40px] p-8 flex flex-col justify-end relative overflow-hidden border border-zinc-800 shadow-2xl">

                    {/* Top "Cutout" Area - Visual trick using gradient/masks or just layering */}
                    {/* Actually, the image shows a black shape with a "dip" in the middle. 
                       We can simulate this with a SVG path or just a simple rounded rect if user permits. 
                       The image shows the white card *behind* the black one, and the black one has a curve.
                       Let's try to achieve the "Card in Pocket" look.
                    */}

                    {/* "Pocket" Curve Effect */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-8 bg-black rounded-b-3xl z-30"></div>
                    {/* The white card behind is actually visible *above* the main black rect? 
                        In the image, the white card is BEHIND the black shape. 
                        The black shape covers the bottom 2/3 of the white card.
                     */}

                    <div className="relative z-40">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="w-2 h-2 rounded-full bg-zinc-500"></div>
                            <span className="text-zinc-500 text-sm font-medium">Total Balance</span>
                        </div>
                        <h2 className="text-4xl font-bold text-white tracking-tight">{formatCurrency(totalBalance)}</h2>
                    </div>

                    {/* Decorative shine */}
                    <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/5 rounded-full blur-3xl pointer-events-none"></div>
                </div>
            </div>
        </div>
    );
}
