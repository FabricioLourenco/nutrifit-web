"use client";

import { useState } from "react";
import { HeaderBar } from "../components/HeaderBar";
import { DietInput } from "../components/DietInput";
import { DietSelect } from "../components/DietSelect";

export default function CadastrarDieta() {
  const [form, setForm] = useState({
    descricao: "",
    tipo: "",
    alimentos: "",
    kcal: "",
    carbo: "",
    proteina: "",
    peso: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/api/dietas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      if (response.ok) {
        alert("Dieta cadastrada com sucesso!");
        setForm({
          descricao: "",
          tipo: "",
          alimentos: "",
          kcal: "",
          carbo: "",
          proteina: "",
          peso: "",
        });
      } else {
        alert("Erro ao cadastrar dieta");
      }
    } catch (err) {
      console.error(err);
      alert("Erro ao se conectar com a API");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-6">
      <HeaderBar toggleSidebar={() => {}} />
      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-lg p-8">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">Cadastrar Nova Dieta</h1>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <DietInput label="Descrição da Refeição" name="descricao" value={form.descricao} onChange={handleChange} />
          <DietSelect label="Tipo da Refeição" name="tipo" value={form.tipo} onChange={handleChange} />

          {/* Substituindo campo por textarea */}
          <div className="md:col-span-2 flex flex-col">
            <label className="mb-1 text-sm font-semibold text-gray-700">Alimentos Incluídos</label>
            <textarea
              name="alimentos"
              value={form.alimentos}
              onChange={handleChange}
              rows={5}
              className="p-3 border border-gray-300 rounded-md resize-y focus:outline-none focus:ring-2 focus:ring-lime-500"
              placeholder="Ex: Arroz integral, peito de frango grelhado, brócolis cozidos..."
            />
          </div>

          <DietInput label="Kcal" name="kcal" value={form.kcal} onChange={handleChange} type="number" />
          <DietInput label="Carboidratos (g)" name="carbo" value={form.carbo} onChange={handleChange} type="number" />
          <DietInput label="Proteínas (g)" name="proteina" value={form.proteina} onChange={handleChange} type="number" />
          <DietInput label="Peso da Refeição (g)" name="peso" value={form.peso} onChange={handleChange} type="number" />

          <button
            type="submit"
            className="md:col-span-2 bg-lime-600 hover:bg-lime-700 text-white font-semibold py-2 px-4 rounded-lg mt-4"
          >
            Salvar Dieta
          </button>
        </form>
      </div>
    </div>
  );
}
