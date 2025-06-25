"use client";
import { Sidebar } from "../../components/dashboard/sidebar";
import { Header } from "../../components/dashboard/header";
import { PanelLeftIcon } from "lucide-react";
import { useState } from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    <div className="flex flex-col md:flex-row min-h-screen w-full bg-gray-50">
      {/* Sidebar: always visible on desktop, toggled on mobile */}
      <div className="hidden md:block">
        <Sidebar />
      </div>
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      <div
        className={`fixed top-0 left-0 z-50 transition-transform duration-300 md:hidden ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        style={{ width: "16rem", height: "100vh" }}
      >
        <Sidebar />
      </div>
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header with hamburger */}
        <div className="relative">
          <button
            className="absolute left-4 top-1/2 -translate-y-1/2 z-50 md:hidden p-2 rounded-lg bg-white/80 dark:bg-gray-900/80 shadow hover:bg-white"
            onClick={() => setSidebarOpen((v) => !v)}
            aria-label="Open sidebar"
          >
            <PanelLeftIcon className="w-7 h-7 text-indigo-500" />
          </button>
          <Header />
        </div>
        <main className="p-2 sm:p-4 md:p-6 flex-1 overflow-auto w-full max-w-full">
          {children}
        </main>
      </div>
    </div>
  );
}
