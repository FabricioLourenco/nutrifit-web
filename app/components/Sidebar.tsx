
"use client";

import Link from "next/link";

export default function Sidebar({
  sidebarOpen,
  toggleSidebar,
}: {
  sidebarOpen: boolean;
  toggleSidebar: () => void;
}) {
  return (
    <div
      className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 z-50 ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      {/* Top bar do sidebar */}
      <div className="p-4 flex justify-between items-center border-b">
        <h2 className="text-lg font-bold">Menu</h2>
        <button onClick={toggleSidebar} className="text-gray-600 text-xl">
          ✕
        </button>
      </div>

      {/* Navegação */}
      <nav className="p-4 space-y-4">
        <Link href="/home" className="block text-gray-700 hover:text-lime-600">
          Home
        </Link>
        <Link href="/perfil-user" className="block text-gray-700 hover:text-lime-600">
          Perfil
        </Link>
        <Link href="/profile" className="block text-gray-700 hover:text-lime-600">
          Profile
        </Link>
        <Link href="/settings" className="block text-gray-700 hover:text-lime-600">
          Settings
        </Link>
      </nav>
    </div>
  );
}
