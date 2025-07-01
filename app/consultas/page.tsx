// app/consultas/page.tsx
"use client";

import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import { HeaderBar } from "../components/HeaderBar";
import { AppointmentCalendar } from "../components/AppointmentCalendar";
import { SchedulingForm } from "../components/SchedulingForm";
import { ConsultationList } from "../components/ConsultationList";

// Interfaces
interface Consulta {
  id: number;
  dataHora: string;
  observacoes: string;
  pacienteId: number;
  nomePaciente?: string; // O nome é opcional, pois será adicionado depois
}
interface Paciente {
  id: number;
  usuarioId: number;
  nome: string;
}

export default function ConsultasPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const [allPatients, setAllPatients] = useState<Paciente[]>([]);
  const [patientConsultations, setPatientConsultations] = useState<Consulta[]>([]);
  const [selectedPatientForFilter, setSelectedPatientForFilter] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);

  // Efeito para buscar a lista de pacientes do nutricionista (INTACTO)
  useEffect(() => {
    const fetchPatients = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem("authToken");
        if (!token) return;
        const decodedToken = JSON.parse(atob(token.split('.')[1]));
        const loggedInUsuarioId = decodedToken?.Id;
        if (!loggedInUsuarioId) return;
        
        const nutricionistasResponse = await fetch("https://localhost:7058/api/v1/Nutricionista/buscar-nutricionistas");
        const nutricionistasResult = await nutricionistasResponse.json();
        const nutricionistaLogado = nutricionistasResult.data.find((n: any) => n.usuarioId === Number(loggedInUsuarioId));
        
        if (nutricionistaLogado) {
          const nutricionistaEntityId = nutricionistaLogado.id;
          const pacientesResponse = await fetch(`https://localhost:7058/api/v1/Paciente/buscar-pacientes-por-nutricionista?nutricionistaId=${nutricionistaEntityId}`);
          const pacientesResult = await pacientesResponse.json();
          if (pacientesResult.sucesso) setAllPatients(pacientesResult.data);
        }
      } catch (error) {
        console.error("Erro ao buscar pacientes:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPatients();
  }, []);

  // --- AQUI ESTÁ A LÓGICA CORRIGIDA ---
  const handleSearchConsultations = async () => {
    if (!selectedPatientForFilter) {
      alert("Por favor, selecione um paciente para buscar.");
      return;
    }
    setIsSearching(true);
    setPatientConsultations([]);
    try {
      // 1. Busca a lista de consultas pelo ID do paciente
      const consultasResponse = await fetch(`https://localhost:7058/api/v1/Consulta/buscar-consultas-por-paciente?pacienteId=${selectedPatientForFilter}`);
      if(!consultasResponse.ok) throw new Error("Falha ao buscar consultas.");

      const consultasResult = await consultasResponse.json();
      
      if (consultasResult.sucesso && Array.isArray(consultasResult.data)) {
        // 2. Para cada consulta, busca o nome do paciente
        const consultasComNomePromises = consultasResult.data.map(async (consulta: Consulta) => {
          const pacienteResponse = await fetch(`https://localhost:7058/api/v1/Paciente/buscar-paciente-por-id?id=${consulta.pacienteId}`);
          if (pacienteResponse.ok) {
            const pacienteResult = await pacienteResponse.json();
            // 3. Adiciona o nome do paciente ao objeto da consulta
            return { ...consulta, nomePaciente: pacienteResult.data.nome };
          }
          return { ...consulta, nomePaciente: `ID ${consulta.pacienteId}` }; // Fallback
        });
        
        // 4. Espera todas as buscas terminarem e atualiza o estado
        const consultasFinais = await Promise.all(consultasComNomePromises);
        setPatientConsultations(consultasFinais);
      }
    } catch (error) {
      console.error("Erro ao buscar consultas:", error);
      setPatientConsultations([]);
    } finally {
      setIsSearching(false);
    }
  };

  useEffect(() => {
    setSelectedDate(new Date());
  }, []);

  if (!selectedDate) {
    return <div className="min-h-screen bg-gray-100 flex items-center justify-center"><p>Carregando...</p></div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <Sidebar sidebarOpen={sidebarOpen} toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      <div className="flex-1 p-4 md:p-8">
        <HeaderBar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        <main className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            <div className="lg:col-span-2 bg-white p-4 rounded-xl shadow-lg flex justify-center items-center">
              <AppointmentCalendar selectedDate={selectedDate} onDateChange={setSelectedDate} />
            </div>
            <div className="lg:col-span-1">
              <SchedulingForm selectedDate={selectedDate} />
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Buscar Histórico de Consultas</h3>
            <div className="flex justify-end items-end gap-4">
              <div className="flex-1">
                <label htmlFor="patient-search" className="block text-sm font-medium text-gray-700">Selecione o Paciente</label>
                <select
                  id="patient-search"
                  value={selectedPatientForFilter}
                  onChange={(e) => setSelectedPatientForFilter(e.target.value)}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-lime-500 focus:border-lime-500 sm:text-sm rounded-md"
                  disabled={isLoading}
                >
                  <option value="" disabled>Selecione</option>
                  {allPatients.map((paciente) => (
                    <option key={paciente.id} value={paciente.id}>
                      {paciente.nome || `ID do Paciente: ${paciente.usuarioId}`}
                    </option>
                  ))}
                </select>
              </div>
              <button
                onClick={handleSearchConsultations}
                disabled={isSearching}
                className="py-2 px-6 bg-lime-600 text-white font-semibold rounded-md hover:bg-lime-700 disabled:bg-gray-400 h-10"
              >
                {isSearching ? 'Buscando...' : 'Buscar'}
              </button>
            </div>
            <div className="mt-6">
            <ConsultationList title="Resultados da Busca" consultations={patientConsultations} isLoading={isSearching} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}