"use client";

import Link from "next/link";

export default function Header() {
  return (
    <header className="bg-blue-600 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold tracking-tight">
          NutriFit
        </Link>

        <nav className="space-x-4">
          <Link href="/" className="hover:text-gray-300 transition-colors">
            Início
          </Link>
          <Link
            href="/clientes"
            className="hover:text-gray-300 transition-colors"
          >
            Login
          </Link>
          <Link
            href="/pedidos"
            className="hover:text-gray-300 transition-colors"
          >
            Sobre
          </Link>
        </nav>""
      </div>
    </header>
  );
}
