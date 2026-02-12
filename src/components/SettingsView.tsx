"use client";

import React, { useState, useEffect } from 'react';
import { useFinanceData } from '../hooks/useFinanceData';
import { Save, Download, Upload, Trash2, AlertTriangle } from 'lucide-react';

export function SettingsView() {
    const { data, updateSettings, resetData } = useFinanceData();
    const [userName, setUserName] = useState(data.userName);
    const [monthlyGoal, setMonthlyGoal] = useState(data.monthlyGoal.toString());

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
        <div className="p-6 md:p-8 space-y-8 animate-in fade-in duration-500">
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
                            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#b4f827]"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-zinc-400 mb-2">Objetivo de ahorro mensual (€)</label>
                        <input
                            type="number"
                            value={monthlyGoal}
                            onChange={(e) => setMonthlyGoal(e.target.value)}
                            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#b4f827]"
                        />
                    </div>

                    <button
                        onClick={handleSave}
                        className="w-full bg-[#b4f827] text-black font-bold py-3 rounded-xl hover:bg-[#a3e622] transition-colors flex items-center justify-center gap-2"
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

            <div className="bg-zinc-900 p-6 rounded-3xl border border-zinc-800">
                <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                    <AlertTriangle className="text-[#b4f827]" /> Acerca de
                </h3>
                <p className="text-zinc-400 text-sm">FinanceFlow v0.1.0</p>
                <p className="text-zinc-500 text-sm mt-1">Tus datos están sincronizados de forma segura con Supabase. Puedes acceder a ellos desde cualquier dispositivo iniciando sesión.</p>
            </div>
        </div>
    );
}
