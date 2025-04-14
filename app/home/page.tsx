// app/home/page.tsx

"use client";

import { useState, useEffect } from "react";

const images = [
  "/login/img1.jpg",
  "/login/img2.jpg",
  "/login/img3.jpg",
];


export default function LoginPage() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex h-screen w-full flex-col md:flex-row">
  {/* Carrossel - 70% em telas grandes, escondido em telas pequenas */}
  <div className="hidden md:flex md:w-[70%] items-center justify-center relative overflow-hidden">
    <img
      src={images[current]}
      alt="Carrossel"
      className="object-cover w-full h-full transition-all duration-700"
    />

    <div className="absolute inset-0 bg-black/40" />
  </div>

  {/* Área de Login - 100% em telas pequenas, 30% em grandes */}
  <div className="w-full md:w-[30%] flex items-center justify-center bg-white p-8 shadow-lg">
    <div className="w-full max-w-sm space-y-6">
      <div className="text-center">
        <img src="/logo.svg" alt="Logo" className="mx-auto mb-4 h-12" />
        <h2 className="text-2xl font-bold">Acesse sua conta</h2>
      </div>

      <form className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Usuário</label>
          <input
            type="text"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Senha</label>
          <input
            type="password"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>

        <div className="flex items-center justify-between">
          <label className="flex items-center text-sm">
            <input type="checkbox" className="mr-2" />
            Lembrar-me
          </label>
          <a href="#" className="text-sm text-orange-600 hover:underline">
            Esqueceu a senha?
          </a>
        </div>

        <button
          type="submit"
          className="w-full py-2 bg-black text-white font-semibold rounded-md hover:bg-gray-800 transition"
        >
          Entrar
        </button>
      </form>

      <p className="text-center text-sm">
        Não possui uma conta?{" "}
        <a href="#" className="text-orange-600 hover:underline">
          Saiba mais!
        </a>
      </p>
    </div>
  </div>
</div>
  );
}
