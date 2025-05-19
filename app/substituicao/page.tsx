"use client";

import { useState } from "react";
import Sidebar from "../components/Sidebar";
import { HeaderBar } from "../components/HeaderBar";

import FormSubstituicao from "../components/FormSubstituicao";
import TabelaSubstituicoes from "../components/TabelaSubstituicoes";
import Header from "../components/Header";

interface Substituicao {
  id: number;
  alimento: string;
  substituto: string;
  gramagem: number;
  calorias: number;
}

export default function SubstituicaoPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [substituicoes, setSubstituicoes] = useState<Substituicao[]>([]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Simula requisição para backend
  const buscarSubstituicoes = (alimento: string, gramagem: number) => {
    const trocasSimuladas: Substituicao[] = [
      {
        id: 1,
        alimento,
        substituto: "Maçã",
        gramagem,
        calorias: 52,
      },
      {
        id: 2,
        alimento,
        substituto: "Pêra",
        gramagem,
        calorias: 57,
      },
      {
        id: 3,
        alimento,
        substituto: "Banana",
        gramagem,
        calorias: 89,
      },
    ];

    setSubstituicoes(trocasSimuladas);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Main Content */}
      <div className="flex-1 p-4 md:p-8">
        {/* Header */}
         
        
        <HeaderBar toggleSidebar={toggleSidebar} />

        {/* Conteúdo da página Substituição */}
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6 text-center">
            Tabela de Substituição
          </h1>

          <FormSubstituicao onBuscar={buscarSubstituicoes} />

          <div className="mt-10">
            <TabelaSubstituicoes substituicoes={substituicoes} />
          </div>
        </div>
      </div>
    </div>
  );
}
