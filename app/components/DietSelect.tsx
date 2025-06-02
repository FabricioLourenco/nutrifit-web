import React from "react";

interface DietSelectProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

export function DietSelect({ label, name, value, onChange }: DietSelectProps) {
  return (
    <div className="flex flex-col">
      <label className="mb-1 text-sm font-semibold text-gray-700">{label}</label>
      <select
        name={name}
        value={value}
        onChange={onChange}
        className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-lime-500"
      >
        <option value="">Selecione</option>
        <option value="Café da Manhã">Café da Manhã</option>
        <option value="Lanche da Manhã">Lanche da Manhã</option>
        <option value="Almoço">Almoço</option>
        <option value="Lanche da Tarde">Lanche da Tarde</option>
        <option value="Jantar">Jantar</option>
        <option value="Ceia">Ceia</option>
      </select>
    </div>
  );
}
