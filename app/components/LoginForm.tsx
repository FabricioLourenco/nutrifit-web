"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

// Função para decodificar o payload do JWT manualmente (sem jwt-decode)
function decodeJWT(token: string): any | null {
  try {
    const payloadBase64 = token.split(".")[1];
    const payload = atob(payloadBase64);
    return JSON.parse(payload);
  } catch (e) {
    return null;
  }
}

// Função para gerar hash SHA-256 da senha
async function sha256(message: string): Promise<string> {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest("SHA-256", msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
  return hashHex;
}

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Criptografa a senha com SHA-256 (igual ao cadastro)
      const senhaHash = await sha256(senha);

      const payload = {
        email,
        senha: senhaHash,
      };

      const response = await fetch("https://localhost:7058/api/v1/Autenticacao/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": "d657b7829cdcee83f6d70012fffebd1622a9f940ed414b0f41885a782e29a906", 
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        alert("Credenciais inválidas");
        return;
      }

      const data = await response.json();
      const token = data.data.bearerToken; // Ajustado para pegar o token no local correto
      localStorage.setItem("authToken", token);

      const decoded = decodeJWT(token);

      if (!decoded || !decoded.TipoUsuario) {
        alert("Token inválido ou malformado.");
        return;
      }

      if (decoded.TipoUsuario === "Nutricionista") {
        router.push("/nutricionista");
      } else if (decoded.TipoUsuario === "Paciente") {
        router.push("/perfil");
      } else {
        alert("Tipo de usuário desconhecido.");
      }
    } catch (error) {
      console.error("Erro no login:", error);
      alert("Erro ao realizar login.");
    }
  };

  return (
    <div className="w-full md:w-[30%] flex items-start justify-center bg-white p-8 shadow-lg">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center">
          <img src="/logotipo/logo.png" alt="Logo" className="mx-auto mb-0 h-35 w-35" />
          <h2 className="text-2xl font-bold">Acesse sua conta</h2>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Senha</label>
            <input
              type="password"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
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