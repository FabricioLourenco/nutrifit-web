"use client";

import { useState } from "react";

// 🔐 Função para gerar hash SHA-256
async function hashSHA256(text: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
}

export default function SignupForm() {
  const inputClass =
    "w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500";

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

    // 🔐 Gerar hash SHA-256 da senha
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
    } catch (error) {
      console.error("Erro:", error);
      alert("Erro ao criar o usuário.");
    }
  };

  return (
    <div className="w-full md:w-[30%] p-8 bg-white shadow-md rounded-lg flex flex-col justify-start">
      <img src="/logotipo/logo.png" alt="Logo" className="mx-auto mb-4 h-20 w-20" />
      <h2 className="text-2xl font-bold mb-6 text-center">Inscreva-se</h2>

      <form className="space-y-4" onSubmit={handleSubmit}>
        <input type="text" name="nome" placeholder="Nome" onChange={handleChange} className={inputClass} />
        <input type="email" name="email" placeholder="Email" onChange={handleChange} className={inputClass} />
        <input type="password" name="senha" placeholder="Senha" onChange={handleChange} className={inputClass} />
        <input
          type="password"
          name="confirmarSenha"
          placeholder="Confirmar senha"
          onChange={handleChange}
          className={inputClass}
        />
        <input type="text" name="telefone" placeholder="Telefone" onChange={handleChange} className={inputClass} />

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="nutricionista"
            checked={isNutricionista}
            onChange={() => setIsNutricionista(!isNutricionista)}
            className="h-4 w-4 text-blue-600 border-gray-300 rounded"
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
              onChange={handleChange}
              className={inputClass}
            />
            <input
              type="text"
              name="especialidades"
              placeholder="Especialidades"
              onChange={handleChange}
              className={inputClass}
            />
          </>
        ) : (
          <>
            <input
              type="date"
              name="dataNascimento"
              onChange={handleChange}
              className={inputClass}
            />
            <input type="text" name="sexo" placeholder="Sexo" onChange={handleChange} className={inputClass} />
          </>
        )}

        <button type="submit" className="w-full py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700">
          Criar Conta
        </button>
      </form>
    </div>
  );
}
