"use client";

export default function SignupForm() {
  return (
    <div className="w-full md:w-[30%] p-8 bg-white shadow-md rounded-lg flex flex-col justify-start">
      <img src="/logotipo/logo.png" alt="Logo" className="mx-auto mb-0 h-35 w-35" />
      <h2 className="text-2xl font-bold mb-0 text-center">Inscreva-se</h2>
      <form className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700" htmlFor="nome">Nome</label>
          <input
            type="text"
            id="nome"
            name="nome"
            placeholder="Digite seu nome"
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700" htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="Digite seu email"
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700" htmlFor="senha">Senha</label>
          <input
            type="password"
            id="senha"
            name="senha"
            placeholder="Digite sua senha"
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700" htmlFor="confirmar-senha">Confirmar Senha</label>
          <input
            type="password"
            id="confirmar-senha"
            name="confirmar-senha"
            placeholder="Confirme sua senha"
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="mt-6">
          <button
            type="submit"
            className="w-full py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors"
          >
            Criar Conta
          </button>
        </div>
      </form>
    </div>
  );
}
