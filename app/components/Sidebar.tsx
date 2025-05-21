"use client";

import Link from "next/link";
import { X, Home, User, RefreshCcw, Settings } from "lucide-react";

export default function Sidebar({
  sidebarOpen,
  toggleSidebar,
}: {
  sidebarOpen: boolean;
  toggleSidebar: () => void;
}) {
  return (
    <div
      className={`fixed top-0 left-0 h-full w-64 bg-white shadow-xl rounded-r-lg transform transition-transform duration-300 z-50 ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      {/* Top bar do sidebar */}
      <div className="bg-lime-500 text-white p-4 flex justify-between items-center rounded-tr-lg">
        <h2 className="text-lg font-bold">Menu</h2>
        <button onClick={toggleSidebar} className="hover:text-gray-200">
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Navegação */}
      <nav className="p-4 space-y-3">
        <Link
          href="/home"
          className="flex items-center gap-2 text-gray-700 hover:text-lime-600 transition-colors"
        >
          <Home className="w-5 h-5" />
          Home
        </Link>
        <Link
          href="/perfil"
          className="flex items-center gap-2 text-gray-700 hover:text-lime-600 transition-colors"
        >
          <User className="w-5 h-5" />
          Perfil
        </Link>
        <Link
          href="/substituicao"
          className="flex items-center gap-2 text-gray-700 hover:text-lime-600 transition-colors"
        >
          <RefreshCcw className="w-5 h-5" />
          Substituição
        </Link>
        <Link
          href="/settings"
          className="flex items-center gap-2 text-gray-700 hover:text-lime-600 transition-colors"
        >
          <Settings className="w-5 h-5" />
          Configurações
        </Link>
      </nav>
    </div>
  );
}
