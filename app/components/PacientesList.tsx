"use client";
import { useState, useEffect } from "react";

interface Paciente {
  id: string;
  nome: string;
  email: string;
}

interface Props {
  onPacienteSelect: (paciente: Paciente) => void;
}

export function PacientesList({ onPacienteSelect }: Props) {
  const [pacientes, setPacientes] = useState<Paciente[]>([]);

  useEffect(() => {
    // Mock de pacientes (troque pelo fetch real depois)
    setPacientes([
      { id: "1", nome: "Maria da Silva", email: "maria@example.com" },
      { id: "2", nome: "João Pereira", email: "joao@example.com" },
    ]);
  }, []);

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Pacientes</h2>
      <ul className="space-y-3">
        {pacientes.map((paciente) => (
          <li
            key={paciente.id}
            onClick={() => onPacienteSelect(paciente)}
            className="cursor-pointer border p-3 rounded-lg hover:bg-gray-100"
          >
            <p className="font-medium">{paciente.nome}</p>
            <p className="text-sm text-gray-500">{paciente.email}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
