"use client";

import { useState } from "react";
import { HeaderBar } from "../components/HeaderBar";
import { PacientesList } from "../components/PacientesList";
import { DietaForm } from "../components/DietaForm";
import { DietaCard } from "../components/DietaCard";
import { Dieta } from "../components/types";

interface Paciente {
  id: string;
  nome: string;
  email: string;
}

export default function NutricionistaPage() {
  const [pacienteSelecionado, setPacienteSelecionado] = useState<Paciente | null>(null);
  const [dietas, setDietas] = useState<Dieta[]>([]);
  const [editando, setEditando] = useState<Dieta | null>(null);

  const handleSalvarDieta = (novaDieta: Omit<Dieta, "id" | "pacienteId">) => {
    if (!pacienteSelecionado) return;

    if (editando) {
      // Atualiza dieta existente
      const atualizadas = dietas.map((d) =>
        d.id === editando.id ? { ...editando, ...novaDieta } : d
      );
      setDietas(atualizadas);
      setEditando(null);
    } else {
      // Cadastra nova dieta
      const nova = {
        ...novaDieta,
        id: Date.now().toString(), // Simulação de ID
        pacienteId: pacienteSelecionado.id,
      };
      setDietas([...dietas, nova]);
    }
  };

  const handleExcluir = (id: string) => {
    setDietas(dietas.filter((d) => d.id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <HeaderBar toggleSidebar={() => {}} />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        <PacientesList onPacienteSelect={setPacienteSelecionado} />

        <div className="md:col-span-2 bg-white p-6 rounded-lg shadow-md">
          {pacienteSelecionado ? (
            <>
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                Dietas de {pacienteSelecionado.nome}
              </h2>

              <div className="space-y-4 mb-6">
                {dietas
                  .filter((d) => d.pacienteId === pacienteSelecionado.id)
                  .map((dieta) => (
                    <DietaCard
                      key={dieta.id}
                      dieta={dieta}
                      onEdit={() => setEditando(dieta)}
                      onDelete={() => handleExcluir(dieta.id)}
                    />
                  ))}
              </div>

              <DietaForm
                onSubmit={handleSalvarDieta}
                initialData={editando || undefined}
              />
            </>
          ) : (
            <p className="text-gray-500">Selecione um paciente para ver as dietas</p>
          )}
        </div>
      </div>
    </div>
  );
}
