"use client";

import React, { useState } from "react";
import { FinanceProvider, useFinanceData } from "../hooks/useFinanceData";
import { Sidebar } from "../components/Sidebar";
import { DashboardView } from "../components/DashboardView";
import { TransactionsView } from "../components/TransactionsView";
import { SettingsView } from "../components/SettingsView";
import { AnalyticsView } from "../components/AnalyticsView";
import { BudgetView } from "../components/BudgetView";
import { CategoriesView } from "../components/CategoriesView";

function AppContent() {
  const { user, isLoading, signIn, signUp } = useFinanceData();
  const [currentView, setCurrentView] = useState("dashboard");
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [authLoading, setAuthLoading] = useState(false);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setAuthLoading(true);

    try {
      const result = isLogin
        ? await signIn(email, password)
        : await signUp(email, password);

      if (result.error) {
        setError(result.error.message);
      }
    } catch (err: any) {
      setError("Ocurrió un error inesperado");
    } finally {
      setAuthLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-[#b4f827]"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-md bg-zinc-900/50 border border-zinc-800 p-8 rounded-3xl backdrop-blur-xl">
          <div className="flex flex-col items-center text-center mb-8">
            <div className="w-16 h-16 bg-[#b4f827]/10 rounded-2xl flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-[#b4f827]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">FinanceFlow</h1>
            <p className="text-zinc-400">
              {isLogin ? "Inicia sesión para continuar" : "Crea tu cuenta gratuita"}
            </p>
          </div>

          <form onSubmit={handleAuth} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-1.5 ml-1">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-black/50 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#b4f827] transition-colors"
                placeholder="ejemplo@correo.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-1.5 ml-1">Contraseña</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-black/50 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#b4f827] transition-colors"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-500 text-sm py-3 px-4 rounded-xl text-center">
                {error}
              </div>
            )}

            {!isLogin && (
              <p className="text-xs text-zinc-500 text-center px-4">
                Al registrarte, recibirás un correo de confirmación.
              </p>
            )}

            <button
              disabled={authLoading}
              type="submit"
              className="w-full bg-[#b4f827] text-black py-4 rounded-xl font-bold hover:bg-[#a3e622] transition-all transform active:scale-95 disabled:opacity-50 disabled:scale-100 mt-2"
            >
              {authLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                  Cargando...
                </div>
              ) : (
                isLogin ? "Entrar" : "Registrarse"
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setError("");
              }}
              className="text-zinc-400 hover:text-[#b4f827] text-sm transition-colors"
            >
              {isLogin ? "¿No tienes cuenta? Registrate" : "¿Ya tienes cuenta? Inicia sesión"}
            </button>
          </div>
        </div>
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
