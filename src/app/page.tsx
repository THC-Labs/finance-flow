"use client";

import { useState } from "react";
import { FinanceProvider, useFinanceData } from "@/hooks/useFinanceData";
import { Sidebar } from "@/components/Sidebar";
import { DashboardView } from "@/components/DashboardView";
import { TransactionsView } from "@/components/TransactionsView";
import { SettingsView } from "@/components/SettingsView";
import { AnalyticsView, BudgetView, CategoriesView } from "@/components/PlaceholderViews";

function AppContent() {
  const { user, isLoading, signIn } = useFinanceData();
  const [currentView, setCurrentView] = useState("dashboard");

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-[#b4f827]"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 text-center">
        <div className="w-20 h-20 bg-[#b4f827]/10 rounded-3xl flex items-center justify-center mb-8">
          <svg className="w-10 h-10 text-[#b4f827]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
        <h1 className="text-4xl font-bold text-white mb-4">Bienvenido a FinanceFlow</h1>
        <p className="text-zinc-400 mb-8 max-w-md">Inicia sesión para empezar a controlar tus finanzas y sincronizar tus datos en todos tus dispositivos.</p>
        <button
          onClick={signIn}
          className="bg-[#b4f827] text-black px-8 py-3 rounded-full font-bold hover:bg-[#a3e622] transition-all transform active:scale-95"
        >
          Iniciar sesión con GitHub
        </button>
      </div>
    );
  }

  const renderView = () => {
    switch (currentView) {
      case "dashboard":
        return <DashboardView />;
      case "transactions":
        return <TransactionsView />;
      case "analytics":
        return <AnalyticsView />;
      case "budget":
        return <BudgetView />;
      case "categories":
        return <CategoriesView />;
      case "settings":
        return <SettingsView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="flex min-h-screen bg-black text-white font-sans selection:bg-[#b4f827] selection:text-black">
      <Sidebar currentView={currentView} onViewChange={setCurrentView} />

      <main className="flex-1 ml-0 md:ml-64 w-full">
        {renderView()}
      </main>
    </div>
  );
}

export default function Home() {
  return (
    <FinanceProvider>
      <AppContent />
    </FinanceProvider>
  );
}
