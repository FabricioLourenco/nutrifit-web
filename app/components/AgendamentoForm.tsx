// app/components/AgendamentoForm.tsx
"use client";

import { useState } from "react";

export function AgendamentoForm() {
  const [paciente, setPaciente] = useState("");
  const [data, setData] = useState("");
  const [hora, setHora] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Lógica para salvar o agendamento no backend
    alert(`Consulta agendada para ${paciente} no dia ${data} às ${hora}`);
    // Limpar formulário
    setPaciente("");
    setData("");
    setHora("");
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4 text-gray-700">Agendar Nova Consulta</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-600">Paciente</label>
          {/* Este input pode ser substituído por um Select com a lista de pacientes */}
          <input
            type="text"
            value={paciente}
            onChange={(e) => setPaciente(e.target.value)}
            className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-lime-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-600">Data</label>
          <input
            type="date"
            value={data}
            onChange={(e) => setData(e.target.value)}
            className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-lime-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-600">Hora</label>
          <input
            type="time"
            value={hora}
            onChange={(e) => setHora(e.target.value)}
            className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-lime-500"
            required
          />
        </div>
        <div className="text-right">
          <button
            type="submit"
            className="bg-lime-600 hover:bg-lime-700 text-white font-semibold py-2 px-4 rounded-lg shadow"
          >
            Agendar
          </button>
        </div>
      </form>
    </div>
  );
}