"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation"; // PASSO 1: Importar o useRouter

// 🔐 Função para gerar hash SHA-256 (LÓGICA PRESERVADA)
async function hashSHA256(text: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
}

export default function SignupForm() {
  const router = useRouter(); // PASSO 2: Inicializar o router

  const inputClass =
    "w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500";

  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    senha: "",
    confirmarSenha: "",
    telefone: "",
    fotoPerfilUrl: "",
    dataNascimento: "",
    sexo: "",
    crefNutricionista: "",
    especialidades: "",
  });

  const [isNutricionista, setIsNutricionista] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.senha !== formData.confirmarSenha) {
      alert("As senhas não coincidem.");
      return;
    }
    
    const senhaHash = await hashSHA256(formData.senha);

    const userPayload = {
      nome: formData.nome,
      email: formData.email,
      senhaHash: senhaHash,
      tipoUsuario: isNutricionista ? 1 : 2,
      telefone: formData.telefone,
      fotoPerfilUrl: formData.fotoPerfilUrl || "",
      ativo: true,
      autenticacaoDoisFatoresHabilitada: true,
      paciente: !isNutricionista
        ? {
            sexo: formData.sexo,
            dataNascimento: formData.dataNascimento,
          }
        : null,
      nutricionista: isNutricionista
        ? {
            crefNutricionista: formData.crefNutricionista,
            especialidades: formData.especialidades,
          }
        : null,
    };

    try {
      const response = await fetch("https://localhost:7058/api/v1/Usuario/inserir-usuario", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userPayload),
      });

      if (!response.ok) throw new Error("Erro ao criar o usuário");

      const result = await response.json();
      alert("Usuário criado com sucesso!");
      console.log(result);
      
      router.push("/login"); // PASSO 3: Redirecionar para a tela de login

    } catch (error) {
      console.error("Erro:", error);
      alert("Erro ao criar o usuário.");
    }
  };

  return (
    <div className="w-full md:w-[30%] flex items-start justify-center bg-white p-8 shadow-lg">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center">
            <img src="/logotipo/logo.png" alt="Logo" className="mx-auto mb-0 h-35 w-35" />
            <h2 className="text-2xl font-bold">Crie sua conta</h2>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* O restante do seu formulário permanece igual */}
          <input type="text" name="nome" placeholder="Nome" value={formData.nome} onChange={handleChange} className={inputClass} />
          <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} className={inputClass} />
          <input type="password" name="senha" placeholder="Senha" value={formData.senha} onChange={handleChange} className={inputClass} />
          <input
            type="password"
            name="confirmarSenha"
            placeholder="Confirmar senha"
            value={formData.confirmarSenha}
            onChange={handleChange}
            className={inputClass}
          />
          <input type="text" name="telefone" placeholder="Telefone" value={formData.telefone} onChange={handleChange} className={inputClass} />

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="nutricionista"
              checked={isNutricionista}
              onChange={() => setIsNutricionista(!isNutricionista)}
              className="h-4 w-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
            />
            <label htmlFor="nutricionista" className="text-sm text-gray-700">
              Sou nutricionista
            </label>
          </div>

          {isNutricionista ? (
            <>
              <input
                type="text"
                name="crefNutricionista"
                placeholder="CREF Nutricionista"
                value={formData.crefNutricionista}
                onChange={handleChange}
                className={inputClass}
              />
              <input
                type="text"
                name="especialidades"
                placeholder="Especialidades"
                value={formData.especialidades}
                onChange={handleChange}
                className={inputClass}
              />
            </>
          ) : (
            <>
              <input
                type="date"
                name="dataNascimento"
                value={formData.dataNascimento}
                onChange={handleChange}
                className={inputClass}
              />
              <input type="text" name="sexo" placeholder="Sexo" value={formData.sexo} onChange={handleChange} className={inputClass} />
            </>
          )}

          <button type="submit" className="w-full py-2 bg-black text-white font-semibold rounded-md hover:bg-gray-800 transition">
            Criar Conta
          </button>
        </form>

        <p className="text-center text-sm">
          Já possui uma conta?{" "}
          <Link href="/login" passHref>
            <span className="text-orange-600 hover:underline cursor-pointer">
              Entre agora!
            </span>
          </Link>
        </p>
      </div>
    </div>
  );
}