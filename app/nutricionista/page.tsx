"use client";
import { useState } from "react";
import { HeaderBar } from "../components/HeaderBar";
import Sidebar from "../components/Sidebar";

import { PacientesList } from "../components/PacientesList";
import { DietaForm } from "../components/DietaForm";
import { DietaCard } from "../components/DietaCard";
import { Dieta } from "../components/types";
import Link from "next/link";

interface Paciente {
  id: string;
  nome: string;
  email: string;
}

export default function NutricionistaPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [pacienteSelecionado, setPacienteSelecionado] =
    useState<Paciente | null>(null);
  const [dietas, setDietas] = useState<Dieta[]>([]);
  const [editando, setEditando] = useState<Dieta | null>(null);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const handleSalvarDieta = (novaDieta: Omit<Dieta, "id" | "pacienteId">) => {
    if (!pacienteSelecionado) return;

    if (editando) {
      const atualizadas = dietas.map((d) =>
        d.id === editando.id ? { ...editando, ...novaDieta } : d
      );
      setDietas(atualizadas);
      setEditando(null);
    } else {
      const nova = {
        ...novaDieta,
        id: Date.now().toString(),
        pacienteId: pacienteSelecionado.id,
      };
      setDietas([...dietas, nova]);
    }
  };

  const handleExcluir = (id: string) => {
    setDietas(dietas.filter((d) => d.id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Main Content */}
      <div className="flex-1 p-4 md:p-8">
        {/* Header */}
        <HeaderBar toggleSidebar={toggleSidebar} />

        <main className="p-4 md:p-8">
          {/* Dashboard Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-lg shadow p-4">
              <p className="text-sm text-gray-500">Total de Pacientes</p>
              <p className="text-2xl font-bold text-green-600">12</p>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <p className="text-sm text-gray-500">Dietas Cadastradas</p>
              <p className="text-2xl font-bold text-blue-600">
                {dietas.length}
              </p>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <p className="text-sm text-gray-500">Consultas Agendadas</p>
              <p className="text-2xl font-bold text-orange-500">5</p>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <p className="text-sm text-gray-500">Avaliações</p>
              <p className="text-2xl font-bold text-purple-600">3</p>
            </div>
          </div>

          {/* Botões de Ação */}
          {/* Botões de Ação */}
          <div className="flex flex-wrap gap-4 mb-6">
            {["Meus Pacientes", "Consultas", "Relatórios", "Avaliações"].map(
              (item) =>
                item === "Consultas" ? (
                  // Envolvemos o botão "Consultas" com o componente Link
                  <Link key={item} href="/consultas" passHref>
                    <button className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg shadow">
                      {item}
                    </button>
                  </Link>
                ) : (
                  // Os outros botões continuam como estavam
                  <button
                    key={item}
                    className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg shadow"
                  >
                    {item}
                  </button>
                )
            )}
          </div>

          {/* Conteúdo principal */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Lista de Pacientes */}
            <PacientesList onPacienteSelect={setPacienteSelecionado} />

            {/* Dietas */}
            <div className="md:col-span-2 bg-white p-6 rounded-lg shadow-md">
              {pacienteSelecionado ? (
                <>
                  {/* Cabeçalho com botão de nova dieta */}
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-gray-800">
                      Dietas de {pacienteSelecionado.nome}
                    </h2>
                    <button
                      onClick={() => setEditando(null)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
                    >
                      + Nova Dieta
                    </button>
                  </div>

                  <div className="space-y-4 mb-6 max-h-[400px] overflow-auto">
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
                <p className="text-gray-500">
                  Selecione um paciente para ver as dietas
                </p>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
