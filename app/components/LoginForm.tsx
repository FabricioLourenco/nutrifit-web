"use client";

import Link from "next/link"; // Importando o componente Link

const LoginForm = () => {
  return (
    <div className="w-full md:w-[30%] flex items-start justify-center bg-white p-8 shadow-lg">

      <div className="w-full max-w-sm space-y-6">
        <div className="text-center">
        <img src="/logotipo/logo.png" alt="Logo" className="mx-auto mb-0 h-35 w-35" />
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
          <Link href="/inscreva-se" passHref>
            <span className="text-orange-600 hover:underline cursor-pointer">
              Inscreva-se!
            </span>
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;
