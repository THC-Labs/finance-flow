"use client";

import { useState } from "react";
import { FinanceProvider } from "@/hooks/useFinanceData";
import { Sidebar } from "@/components/Sidebar";
import { DashboardView } from "@/components/DashboardView";
import { TransactionsView } from "@/components/TransactionsView";
import { SettingsView } from "@/components/SettingsView";
import { AnalyticsView, BudgetView, CategoriesView } from "@/components/PlaceholderViews";

function AppContent() {
  const [currentView, setCurrentView] = useState("dashboard");

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
