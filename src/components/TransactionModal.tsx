import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useFinanceData } from '../hooks/useFinanceData';
import { Transaction, TransactionType } from '../types/finance';
import { CATEGORY_GROUPS } from '../utils/categories';

interface TransactionModalProps {
    isOpen: boolean;
    onClose: () => void;
    type: TransactionType;
    initialData?: Transaction | null;
}

export function TransactionModal({ isOpen, onClose, type, initialData }: TransactionModalProps) {
    const { addTransaction, editTransaction } = useFinanceData();
    const [amount, setAmount] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

    useEffect(() => {
        if (initialData) {
            setAmount(initialData.amount.toString());
            setDescription(initialData.description);
            setCategory(initialData.category);
            setDate(initialData.date.split('T')[0]);
        } else {
            setAmount('');
            setDescription('');
            setCategory('');
            setDate(new Date().toISOString().split('T')[0]);
        }
    }, [initialData, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const txData = {
            type,
            amount: parseFloat(amount),
            description,
            category,
            date: new Date(date).toISOString()
        };

        if (initialData) {
            editTransaction(initialData.id, txData);
        } else {
            addTransaction(txData);
        }

        onClose();
        // Reset form if not editing (though useEffect handles this on re-open)
        if (!initialData) {
            setAmount('');
            setDescription('');
            setCategory('');
        }
    };

    const isEditing = !!initialData;
    const categoryGroup = CATEGORY_GROUPS.find(g => g.id === (type === 'income' ? 'income' : 'expense'))
        || (type === 'expense' ? CATEGORY_GROUPS.find(g => g.id === 'savings') : null);

    // Flatten logic for categories:
    // If expense, show expense + savings groups
    // If income, show income group

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-md shadow-2xl p-6 relative animate-in zoom-in-95 duration-200">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-zinc-400 hover:text-white transition-colors"
                >
                    <X size={24} />
                </button>

                <h3 className="text-xl font-bold text-white mb-6">
                    {isEditing ? 'Editar Transacción' : (type === 'income' ? 'Nuevo Ingreso' : 'Nuevo Gasto')}
                </h3>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-zinc-400 mb-2">Importe (€)</label>
                        <input
                            type="number"
                            step="0.01"
                            required
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#b4f827] focus:ring-1 focus:ring-[#b4f827] transition-all"
                            placeholder="0.00"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-zinc-400 mb-2">Descripción</label>
                        <input
                            type="text"
                            required
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#b4f827] focus:ring-1 focus:ring-[#b4f827] transition-all"
                            placeholder="Ej: Compra supermercado"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-zinc-400 mb-2">Categoría</label>
                        <select
                            required
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#b4f827] focus:ring-1 focus:ring-[#b4f827] transition-all appearance-none"
                        >
                            <option value="">Seleccionar categoría</option>
                            {type === 'expense' ? (
                                <>
                                    {CATEGORY_GROUPS.filter(g => g.id === 'expense' || g.id === 'savings').map(group => (
                                        <optgroup key={group.id} label={group.title}>
                                            {group.items.map(item => (
                                                <option key={item.id} value={item.id}>
                                                    {item.label}
                                                </option>
                                            ))}
                                        </optgroup>
                                    ))}
                                </>
                            ) : (
                                <>
                                    {CATEGORY_GROUPS.filter(g => g.id === 'income').map(group => (
                                        <optgroup key={group.id} label={group.title}>
                                            {group.items.map(item => (
                                                <option key={item.id} value={item.id}>
                                                    {item.label}
                                                </option>
                                            ))}
                                        </optgroup>
                                    ))}
                                </>
                            )}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-zinc-400 mb-2">Fecha</label>
                        <input
                            type="date"
                            required
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#b4f827] focus:ring-1 focus:ring-[#b4f827] transition-all"
                        />
                    </div>

                    <div className="flex gap-3 mt-8">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-3 rounded-xl bg-zinc-800 text-white font-medium hover:bg-zinc-700 transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="flex-1 px-4 py-3 rounded-xl bg-[#b4f827] text-black font-bold hover:bg-[#a3e622] transition-colors"
                        >
                            {isEditing ? 'Actualizar' : 'Guardar'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
