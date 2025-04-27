"use client";

import Link from "next/link";

export default function Header() {
  return (
    <header className="bg-green-900 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        {/* Título à esquerda */}
        <Link href="/" className="text-2xl font-bold tracking-tight">
          NutriFit
        </Link>

        {/* Navegação à direita */}
        <nav className="flex space-x-8">
          <Link href="/" className="hover:text-gray-300 transition-colors">
            Início
          </Link>
          <Link
            href="/"
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
        </nav>
      </div>
    </header>
  );
}
