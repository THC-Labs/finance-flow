"use client";

import { useState } from 'react';
import { X } from 'lucide-react';
import { useFinanceData } from '../hooks/useFinanceData';
import { TransactionType } from '../types/finance';

interface TransactionModalProps {
    isOpen: boolean;
    onClose: () => void;
    type: TransactionType;
}

export function TransactionModal({ isOpen, onClose, type }: TransactionModalProps) {
    const { addTransaction } = useFinanceData();
    const [amount, setAmount] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        addTransaction({
            type,
            amount: parseFloat(amount),
            description,
            category,
            date: new Date(date).toISOString()
        });

        onClose();
        // Reset form
        setAmount('');
        setDescription('');
        setCategory('');
    };

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
                    {type === 'income' ? 'Nuevo Ingreso' : 'Nuevo Gasto'}
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
                                    <optgroup label="Gastos Fijos">
                                        <option value="vivienda">🏠 Vivienda</option>
                                        <option value="telecomunicaciones">📱 Telecomunicaciones</option>
                                        <option value="seguros">🛡️ Seguros</option>
                                        <option value="suscripciones">📺 Suscripciones</option>
                                    </optgroup>
                                    <optgroup label="Gastos Variables">
                                        <option value="alimentacion">🛒 Alimentación</option>
                                        <option value="transporte">🚗 Transporte</option>
                                        <option value="suministros">💡 Suministros</option>
                                        <option value="salud">🏥 Salud</option>
                                    </optgroup>
                                    <optgroup label="Gastos Discrecionales">
                                        <option value="ocio">🍽️ Ocio/Restaurantes</option>
                                        <option value="entretenimiento">🎬 Entretenimiento</option>
                                        <option value="compras">🛍️ Compras personales</option>
                                        <option value="viajes">✈️ Viajes</option>
                                    </optgroup>
                                </>
                            ) : (
                                <optgroup label="Ingresos">
                                    <option value="salario">💼 Salario</option>
                                    <option value="freelance">💻 Freelance</option>
                                    <option value="inversiones">📈 Inversiones</option>
                                    <option value="otros_ingresos">💰 Otros ingresos</option>
                                </optgroup>
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
                            Guardar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
