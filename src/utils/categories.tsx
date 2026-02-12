import {
    Home, Smartphone, Shield, Tv,
    ShoppingCart, Car, Lightbulb, HeartPulse,
    Utensils, Clapperboard, ShoppingBag, Plane,
    Briefcase, Laptop, TrendingUp, PiggyBank,
    Wallet
} from 'lucide-react';

export const CATEGORY_GROUPS = [
    {
        id: 'income',
        title: "Ingresos",
        color: "text-[#9AD93D]", // Lime Green
        bgColor: "bg-[#9AD93D]/10",
        icon: TrendingUp,
        items: [
            { id: 'salario', label: 'Salario', icon: Briefcase },
            { id: 'freelance', label: 'Freelance', icon: Laptop },
            { id: 'inversiones', label: 'Inversiones', icon: TrendingUp },
            { id: 'otros_ingresos', label: 'Otros Ingresos', icon: Wallet },
        ]
    },
    {
        id: 'expense',
        title: "Gastos",
        color: "text-[#9AD93D]", // Lime Green
        bgColor: "bg-[#9AD93D]/10",
        icon: ShoppingCart,
        items: [
            { id: 'vivienda', label: 'Vivienda', icon: Home },
            { id: 'alimentacion', label: 'Alimentación', icon: ShoppingCart },
            { id: 'transporte', label: 'Transporte', icon: Car },
            { id: 'suministros', label: 'Suministros', icon: Lightbulb },
            { id: 'telecomunicaciones', label: 'Telecomunicaciones', icon: Smartphone },
            { id: 'salud', label: 'Salud', icon: HeartPulse },
            { id: 'seguros', label: 'Seguros', icon: Shield },
            { id: 'suscripciones', label: 'Suscripciones', icon: Tv },
            { id: 'ocio', label: 'Ocio y Restaurantes', icon: Utensils },
            { id: 'entretenimiento', label: 'Entretenimiento', icon: Clapperboard },
            { id: 'compras', label: 'Compras Personales', icon: ShoppingBag },
            { id: 'viajes', label: 'Viajes', icon: Plane },
        ]
    },
    {
        id: 'savings',
        title: "Ahorros e Inversión",
        color: "text-[#9AD93D]", // Lime Green
        bgColor: "bg-[#9AD93D]/10",
        icon: PiggyBank,
        items: [
            { id: 'ahorro', label: 'Ahorro General', icon: PiggyBank },
            { id: 'fondo_emergencia', label: 'Fondo de Emergencia', icon: Shield },
            { id: 'inversion_largo_plazo', label: 'Inversión a Largo Plazo', icon: TrendingUp },
            { id: 'objetivo_especifico', label: 'Objetivo Específico', icon: Plane },
        ]
    }
];

export const getCategoryInfo = (categoryId: string) => {
    for (const group of CATEGORY_GROUPS) {
        const item = group.items.find(i => i.id === categoryId);
        if (item) return item;
    }
    return { id: categoryId, label: categoryId, icon: Wallet }; // Fallback
};
