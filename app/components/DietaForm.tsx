"use client";
import { useState, useEffect } from "react";
import { Dieta } from "./types";

interface Props {
  onSubmit: (dieta: Omit<Dieta, "id" | "pacienteId">) => void;
  initialData?: Partial<Omit<Dieta, "id" | "pacienteId">>;
}

export function DietaForm({ onSubmit, initialData }: Props) {
  const [form, setForm] = useState<Omit<Dieta, "id" | "pacienteId">>({
    descricao: initialData?.descricao || "",
    tipo: initialData?.tipo || "",
    alimentos: initialData?.alimentos || "",
    kcal: initialData?.kcal || "",
    carbo: initialData?.carbo || "",
    proteina: initialData?.proteina || "",
    peso: initialData?.peso || "",
  });

  useEffect(() => {
    if (initialData) {
      setForm({
        descricao: initialData.descricao || "",
        tipo: initialData.tipo || "",
        alimentos: initialData.alimentos || "",
        kcal: initialData.kcal || "",
        carbo: initialData.carbo || "",
        proteina: initialData.proteina || "",
        peso: initialData.peso || "",
      });
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);

    // Limpa o formulário após envio, só se for inclusão
    if (!initialData) {
      setForm({
        descricao: "",
        tipo: "",
        alimentos: "",
        kcal: "",
        carbo: "",
        proteina: "",
        peso: "",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
      <input
        name="descricao"
        value={form.descricao}
        onChange={handleChange}
        placeholder="Descrição"
        className="border p-2 rounded"
      />
      <select
        name="tipo"
        value={form.tipo}
        onChange={handleChange}
        className="border p-2 rounded"
      >
        <option value="">Tipo de Refeição</option>
        <option value="Café da manhã">Café da manhã</option>
        <option value="Almoço">Almoço</option>
        <option value="Lanche">Lanche</option>
        <option value="Jantar">Jantar</option>
      </select>
      <input
        name="alimentos"
        value={form.alimentos}
        onChange={handleChange}
        placeholder="Alimentos"
        className="border p-2 rounded"
      />
      <input
        name="kcal"
        value={form.kcal}
        onChange={handleChange}
        placeholder="Kcal"
        className="border p-2 rounded"
      />
      <input
        name="carbo"
        value={form.carbo}
        onChange={handleChange}
        placeholder="Carboidratos"
        className="border p-2 rounded"
      />
      <input
        name="proteina"
        value={form.proteina}
        onChange={handleChange}
        placeholder="Proteínas"
        className="border p-2 rounded"
      />
      <input
        name="peso"
        value={form.peso}
        onChange={handleChange}
        placeholder="Peso"
        className="border p-2 rounded"
      />
      <button
        type="submit"
        className="md:col-span-2 bg-lime-600 hover:bg-lime-700 text-white py-2 px-4 rounded"
      >
        Salvar
      </button>
    </form>
  );
}
