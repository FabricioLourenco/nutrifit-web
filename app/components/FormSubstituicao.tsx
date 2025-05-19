// components/FormSubstituicao.tsx
"use client";

import { useState } from "react";

interface Props {
  onBuscar: (alimento: string, gramagem: number) => void;
}

export default function FormSubstituicao({ onBuscar }: Props) {
  const [alimento, setAlimento] = useState("");
  const [gramagem, setGramagem] = useState<number | "">("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (alimento && gramagem) {
      onBuscar(alimento, Number(gramagem));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto">
      <div>
        <label className="block mb-1 font-medium">Alimento</label>
        <input
          type="text"
          value={alimento}
          onChange={(e) => setAlimento(e.target.value)}
          className="w-full border border-gray-300 rounded px-3 py-2"
          required
        />
      </div>
      <div>
        <label className="block mb-1 font-medium">Gramagem (g)</label>
        <input
          type="number"
          value={gramagem}
          onChange={(e) =>
            setGramagem(e.target.value === "" ? "" : Number(e.target.value))
          }
          className="w-full border border-gray-300 rounded px-3 py-2"
          min={1}
          required
        />
      </div>
      <div  className="flex justify-end">
        <button
        type="submit"
        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-orange-600"
      >
        Substituir
      </button>
      </div>
      
    </form>
  );
}
