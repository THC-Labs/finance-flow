"use client";

import React, { useState, useEffect } from 'react';
import { useFinanceData } from '../hooks/useFinanceData';
import { Save, Download, Upload, Trash2, AlertTriangle, CreditCard, Plus, Edit2, X, Wallet } from 'lucide-react';
import { clsx } from 'clsx';

export function SettingsView() {
    const { data, updateSettings, resetData, addCard, deleteCard, updateCard } = useFinanceData();
    const [userName, setUserName] = useState(data.userName);
    const [monthlyGoal, setMonthlyGoal] = useState(data.monthlyGoal.toString());

    // Card Management State
    const [showCardModal, setShowCardModal] = useState(false);
    const [editingCardId, setEditingCardId] = useState<string | null>(null);
    const [cardForm, setCardForm] = useState({
        name: '',
        balance: '',
        type: 'debit' as 'debit' | 'credit' | 'cash' | 'savings',
        color: 'bg-gradient-to-br from-zinc-800 to-zinc-950'
    });

    const colors = [
        { label: 'Obsidian', value: '#18181b' },  // zinc-950
        { label: 'Emerald', value: '#064e3b' },  // emerald-900
        { label: 'Midnight', value: '#1e3a8a' }, // blue-900
        { label: 'Ruby', value: '#7f1d1d' },     // red-900
        { label: 'Gold', value: '#78350f' },     // amber-900
        { label: 'Purple', value: '#581c87' },   // purple-900
        { label: 'Sky', value: '#0c4a6e' },      // sky-900
    ];

    // Sync input state if data loads after mount or is updated elsewhere
    useEffect(() => {
        setUserName(data.userName);
        setMonthlyGoal(data.monthlyGoal.toString());
    }, [data.userName, data.monthlyGoal]);

    const handleSave = () => {
        updateSettings({
            userName,
            monthlyGoal: parseFloat(monthlyGoal)
        });
        alert('Configuración guardada correctamente.');
    };

    const handleSaveCard = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingCardId) {
                await updateCard(editingCardId, {
                    name: cardForm.name,
                    balance: Number(cardForm.balance),
                    type: cardForm.type,
                    color: cardForm.color
                });
            } else {
                await addCard({
                    name: cardForm.name,
                    balance: Number(cardForm.balance),
                    type: cardForm.type,
                    color: cardForm.color,
                    last4: Math.floor(1000 + Math.random() * 9000).toString()
                });
            }
            setShowCardModal(false);
            resetCardForm();
        } catch (error) {
            console.error(error);
        }
    };

    const resetCardForm = () => {
        setCardForm({
            name: '',
            balance: '',
            type: 'debit',
            color: '#18181b'
        });
        setEditingCardId(null);
    };

    const openEditCard = (card: any) => {
        setCardForm({
            name: card.name,
            balance: card.balance.toString(),
            type: card.type,
            color: card.color
        });
        setEditingCardId(card.id);
        setShowCardModal(true);
    };

    const handleDeleteCard = async (id: string) => {
        if (confirm('¿Estás seguro de eliminar esta tarjeta?')) {
            await deleteCard(id);
        }
    };

    const handleExport = () => {
        const dataStr = JSON.stringify(data, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);

        const exportFileDefaultName = 'finance_data.json';

        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
    };

    const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
        const fileReader = new FileReader();
        if (event.target.files && event.target.files.length > 0) {
            fileReader.readAsText(event.target.files[0], "UTF-8");
            fileReader.onload = (e) => {
                if (e.target?.result) {
                    try {
                        const parsedData = JSON.parse(e.target.result as string);
                        updateSettings(parsedData);
                        alert('Datos importados correctamente.');
                    } catch (error) {
                        alert('Error al leer el archivo. Asegúrate de que es un JSON válido.');
                    }
                }
            };
        }
    };

    return (
        <div className="p-6 md:p-8 space-y-8 animate-in fade-in duration-500 pb-24">
            <div>
                <h2 className="text-3xl font-bold text-white">Configuración</h2>
                <p className="text-zinc-400 mt-1">Personaliza tu experiencia y gestiona tus datos</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Profile Settings */}
                <div className="bg-zinc-900 p-6 rounded-3xl border border-zinc-800 space-y-6">
                    <h3 className="text-xl font-bold text-white mb-4 border-b border-zinc-800 pb-2">Perfil</h3>

                    <div>
                        <label className="block text-sm font-medium text-zinc-400 mb-2">Nombre</label>
                        <input
                            type="text"
                            value={userName}
                            onChange={(e) => setUserName(e.target.value)}
                            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#9AD93D]"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-zinc-400 mb-2">Objetivo de ahorro mensual (€)</label>
                        <input
                            type="number"
                            value={monthlyGoal}
                            onChange={(e) => setMonthlyGoal(e.target.value)}
                            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#9AD93D]"
                        />
                    </div>

                    <button
                        onClick={handleSave}
                        className="w-full bg-[#9AD93D] text-black font-bold py-3 rounded-xl hover:bg-[#8ac236] transition-colors flex items-center justify-center gap-2"
                    >
                        <Save size={18} /> Guardar Cambios
                    </button>
                </div>

                {/* Data Management */}
                <div className="bg-zinc-900 p-6 rounded-3xl border border-zinc-800 space-y-6">
                    <h3 className="text-xl font-bold text-white mb-4 border-b border-zinc-800 pb-2">Gestión de Datos</h3>

                    <div className="space-y-4">
                        <button
                            onClick={handleExport}
                            className="w-full bg-zinc-800 text-white font-medium py-3 rounded-xl hover:bg-zinc-700 transition-colors flex items-center justify-center gap-2 border border-zinc-700"
                        >
                            <Download size={18} /> Exportar Datos (JSON)
                        </button>

                        <div className="relative">
                            <button className="w-full bg-zinc-800 text-white font-medium py-3 rounded-xl hover:bg-zinc-700 transition-colors flex items-center justify-center gap-2 border border-zinc-700">
                                <Upload size={18} /> Importar Datos
                            </button>
                            <input
                                type="file"
                                accept=".json"
                                onChange={handleImport}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            />
                        </div>

                        <div className="pt-4 border-t border-zinc-800">
                            <button
                                onClick={() => {
                                    if (confirm('¿Estás seguro de que quieres borrar todos los datos? Esta acción no se puede deshacer.')) {
                                        resetData();
                                    }
                                }}
                                className="w-full bg-red-500/10 text-red-400 font-medium py-3 rounded-xl hover:bg-red-500/20 transition-colors flex items-center justify-center gap-2 border border-red-500/20"
                            >
                                <Trash2 size={18} /> Borrar todos los datos
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Card Management Section */}
            <div className="bg-zinc-900 p-6 rounded-3xl border border-zinc-800">
                <div className="flex items-center justify-between mb-6 border-b border-zinc-800 pb-2">
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                        <CreditCard className="text-[#9AD93D]" /> Gestión de Tarjetas
                    </h3>
                    <button
                        onClick={() => { resetCardForm(); setShowCardModal(true); }}
                        className="bg-[#9AD93D] text-black hover:bg-[#8ac236] p-2 rounded-lg transition-colors"
                        title="Añadir Tarjeta"
                    >
                        <Plus size={20} />
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {data.cards.map(card => (
                        <div key={card.id} className="bg-zinc-950 border border-zinc-800 rounded-2xl p-4 flex items-center justify-between group hover:border-zinc-700 transition-colors">
                            <div className="flex items-center gap-4">
                                <div
                                    className="w-12 h-8 rounded-md shadow-sm"
                                    style={{ backgroundColor: card.color || '#000000' }}
                                />
                                <div>
                                    <p className="font-bold text-white">{card.name}</p>
                                    <p className="text-xs text-zinc-500 uppercase">{card.type} • **** {card.last4}</p>
                                </div>
                            </div>
                            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                    onClick={() => openEditCard(card)}
                                    className="p-2 bg-zinc-800 text-zinc-300 rounded-lg hover:bg-zinc-700 hover:text-white transition-colors"
                                    title="Editar"
                                >
                                    <Edit2 size={16} />
                                </button>
                                <button
                                    onClick={() => handleDeleteCard(card.id)}
                                    className="p-2 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 transition-colors"
                                    title="Eliminar"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                    ))}
                    {data.cards.length === 0 && (
                        <div className="col-span-full py-8 text-center text-zinc-500 italic border border-dashed border-zinc-800 rounded-2xl">
                            No tienes tarjetas añadidas.
                        </div>
                    )}
                </div>
            </div>

            <div className="bg-zinc-900 p-6 rounded-3xl border border-zinc-800">
                <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                    <AlertTriangle className="text-[#9AD93D]" /> Acerca de
                </h3>
                <p className="text-zinc-400 text-sm">FinanceFlow v0.1.0</p>
                <p className="text-zinc-500 text-sm mt-1">Tus datos están sincronizados de forma segura con Supabase. Puedes acceder a ellos desde cualquier dispositivo iniciando sesión.</p>
            </div>

            {/* Add/Edit Card Modal */}
            {showCardModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-zinc-900/80 backdrop-blur-xl border border-white/5 rounded-[40px] w-full max-w-md shadow-2xl p-8 relative animate-in zoom-in-95 duration-200">
                        <button
                            onClick={() => setShowCardModal(false)}
                            className="absolute top-6 right-6 text-zinc-500 hover:text-white transition-colors"
                        >
                            <X size={24} />
                        </button>

                        <h2 className="text-2xl font-bold text-white mb-2">
                            {editingCardId ? 'Editar Tarjeta' : 'Nueva Tarjeta'}
                        </h2>
                        <p className="text-zinc-400 text-sm mb-8">
                            {editingCardId ? 'Modifica los datos de tu tarjeta.' : 'Añade una nueva fuente de fondos a tu cartera.'}
                        </p>

                        <form onSubmit={handleSaveCard} className="space-y-5">
                            <div className="space-y-2">
                                <label className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Nombre</label>
                                <input
                                    type="text"
                                    value={cardForm.name}
                                    onChange={e => setCardForm({ ...cardForm, name: e.target.value })}
                                    placeholder="Ej. Cuenta Personal"
                                    className="w-full bg-black/20 border border-white/5 rounded-2xl px-4 py-3.5 text-white focus:outline-none focus:border-[#9AD93D] focus:ring-1 focus:ring-[#9AD93D] transition-all placeholder:text-zinc-500"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Saldo {editingCardId ? '(Ajuste manual)' : 'Inicial'}</label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500">€</span>
                                    <input
                                        type="number"
                                        value={cardForm.balance}
                                        onChange={e => setCardForm({ ...cardForm, balance: e.target.value })}
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
                                        value={cardForm.type}
                                        onChange={e => setCardForm({ ...cardForm, type: e.target.value as any })}
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
                                    <div className="flex gap-2 flex-wrap">
                                        {colors.map((c) => (
                                            <button
                                                key={c.value}
                                                type="button"
                                                onClick={() => setCardForm({ ...cardForm, color: c.value })}
                                                className={clsx(
                                                    "w-8 h-8 rounded-full border border-white/10 transition-transform hover:scale-110",
                                                    cardForm.color === c.value ? "ring-2 ring-white ring-offset-2 ring-offset-[#09090b] scale-110" : "opacity-60 hover:opacity-100"
                                                )}
                                                title={c.label}
                                            >
                                                <div
                                                    className="w-full h-full rounded-full"
                                                    style={{ backgroundColor: c.value }}
                                                ></div>
                                            </button>
                                        ))}
                                        {/* Custom HEX color input */}
                                        <div className="relative w-8 h-8 rounded-full overflow-hidden border border-white/10 opacity-60 hover:opacity-100 transition-opacity">
                                            <input
                                                type="color"
                                                value={cardForm.color}
                                                onChange={(e) => setCardForm({ ...cardForm, color: e.target.value })}
                                                className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%] p-0 m-0 border-0 cursor-pointer"
                                                title="Personalizado"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-[#9AD93D] hover:bg-[#8ac336] text-black font-bold py-4 rounded-2xl transition-all transform active:scale-[0.98] mt-4 shadow-[0_0_20px_rgba(154,217,61,0.2)] hover:shadow-[0_0_30px_rgba(154,217,61,0.3)]"
                            >
                                {editingCardId ? 'Guardar Cambios' : 'Crear Tarjeta'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
