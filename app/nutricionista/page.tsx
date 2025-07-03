// app/nutricionista/page.tsx
"use client";

import { useState, useEffect } from "react";
import Link from 'next/link';
import { HeaderBar } from "../components/HeaderBar";
import Sidebar from "../components/Sidebar";
import { PacientesList } from "../components/PacientesList";
import PlanoAlimentarForm from "../components/PlanoAlimentarForm";
import { PlanoExistenteCard } from "../components/PlanoExistenteCard";

// --- Interfaces ---
interface Paciente { id: string; nome: string; email: string; usuarioId: number; }
interface Plano { id: number; observacoesGerais: string; dataInicio: string; refeicoes: any[] }
interface Nutricionista { id: number; usuarioId: number; }

// Função para decodificar o token JWT
function decodeJWT(token: string): any | null {
  try {
    const payloadBase64 = token.split(".")[1];
    return JSON.parse(atob(payloadBase64));
  } catch (e) { return null; }
}

export default function NutricionistaPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [pacienteSelecionado, setPacienteSelecionado] = useState<Paciente | null>(null);
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [isLoadingPacientes, setIsLoadingPacientes] = useState(true);

  // --- Novos estados para os planos alimentares ---
  const [planos, setPlanos] = useState<Plano[]>([]);
  const [isLoadingPlanos, setIsLoadingPlanos] = useState(false);
  const [planoEmEdicao, setPlanoEmEdicao] = useState<Plano | null>(null);
  const [modo, setModo] = useState<"lista" | "formulario">("lista");
  const [alimentos, setAlimentos] = useState([]); // Estado para a lista de alimentos

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  // Efeito para buscar pacientes e a lista de todos os alimentos
  useEffect(() => {
    const fetchInitialData = async () => {
        setIsLoadingPacientes(true);
        try {
          const token = localStorage.getItem("authToken");
          if (!token) throw new Error("Token não encontrado");
  
          const decodedToken = decodeJWT(token);
          const loggedInUsuarioId = decodedToken?.Id;
          if (!loggedInUsuarioId) throw new Error("ID do usuário não encontrado no token");
  
          const nutricionistasResponse = await fetch("https://localhost:7058/api/v1/Nutricionista/buscar-nutricionistas");
          const nutricionistasResult = await nutricionistasResponse.json();
          const nutricionistaLogado = nutricionistasResult.data.find(
            (n: Nutricionista) => n.usuarioId === Number(loggedInUsuarioId)
          );
  
          if (!nutricionistaLogado) throw new Error("Nutricionista não encontrado");
  
          const nutricionistaEntityId = nutricionistaLogado.id;
  
          const pacientesResponse = await fetch(`https://localhost:7058/api/v1/Paciente/buscar-pacientes-por-nutricionista?nutricionistaId=${nutricionistaEntityId}`);
          const pacientesResult = await pacientesResponse.json();
  
          if (pacientesResult.sucesso && Array.isArray(pacientesResult.data)) {
              const pacientesComDetalhesPromises = pacientesResult.data.map(async (paciente: any) => {
                  const usuarioResponse = await fetch(`https://localhost:7058/api/v1/Usuario/buscar-usuario-por-id?id=${paciente.usuarioId}`);
                  if(usuarioResponse.ok) {
                      const usuarioResult = await usuarioResponse.json();
                      if(usuarioResult.sucesso) {
                          return {
                              ...paciente,
                              nome: usuarioResult.data.nome,
                              email: usuarioResult.data.email,
                          };
                      }
                  }
                  return null;
              });
  
              const pacientesFinais = (await Promise.all(pacientesComDetalhesPromises)).filter(p => p !== null);
              setPacientes(pacientesFinais);
          }
        } catch (error) {
          console.error("Erro ao buscar pacientes:", error);
        } finally {
          setIsLoadingPacientes(false);
        }
      };
  
      fetchInitialData();
  }, []);

  // Efeito para buscar os PLANOS quando um paciente é selecionado
  useEffect(() => {
    if (!pacienteSelecionado) {
      setPlanos([]);
      return;
    }
    const fetchPlanos = async () => {
      setIsLoadingPlanos(true);
      setModo("lista"); // Sempre volta para a lista ao trocar de paciente
      try {
        const response = await fetch(`https://localhost:7058/api/v1/PlanoAlimentar/buscar-planos-alimentares-por-paciente?pacienteId=${pacienteSelecionado.id}`);
        if (response.ok) {
          const result = await response.json();
          setPlanos(result.data || []);
        }
      } catch (error) {
        console.error("Erro ao buscar planos:", error);
      } finally {
        setIsLoadingPlanos(false);
      }
    };
    fetchPlanos();
  }, [pacienteSelecionado]);

  // Função para buscar os detalhes completos de um plano
  const fetchPlanoDetails = async (planoId: number): Promise<Plano | null> => {
    try {
      const response = await fetch(`https://localhost:7058/api/v1/PlanoAlimentar/buscar-plano-alimentar-por-id?id=${planoId}`);
      if (!response.ok) return null;
      const result = await response.json();
      return result.sucesso ? result.data : null;
    } catch (error) {
      console.error("Erro ao buscar detalhes do plano:", error);
      return null;
    }
  };

  const handleSavePlano = async (planoPayload: any) => {
    const isEditing = !!planoPayload.id;
    const url = isEditing
      ? `https://localhost:7058/api/v1/PlanoAlimentar/editar-plano-alimentar`
      : "https://localhost:7058/api/v1/PlanoAlimentar/inserir-plano-alimentar";
    const method = isEditing ? "PUT" : "POST";

    try {
      const response = await fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json-patch+json" },
        body: JSON.stringify(planoPayload),
      });
      if (response.ok) {
        alert(`Plano ${isEditing ? 'editado' : 'salvo'} com sucesso!`);
        // Força o refresh dos planos ao "selecionar" o paciente de novo
        setPacienteSelecionado(paciente => ({...paciente!})); 
      } else {
        const errorData = await response.json();
        throw new Error(errorData.title || "Falha ao salvar o plano.");
      }
    } catch (error) {
      alert((error as Error).message);
    }
  };

  const handleDeletePlano = async (id: number) => {
    if (!window.confirm(`Tem certeza que deseja excluir o plano ID: ${id}?`)) return;
    try {
      const response = await fetch("https://localhost:7058/api/v1/PlanoAlimentar/excluir-plano-alimentar", {
        method: "DELETE",
        headers: { "Content-Type": "application/json-patch+json" },
        body: JSON.stringify({ id }),
      });
      if (response.ok) {
        alert("Plano excluído com sucesso!");
        setPlanos(planos.filter(p => p.id !== id));
      } else {
        throw new Error("Falha ao excluir o plano.");
      }
    } catch (error) {
      alert((error as Error).message);
    }
  };

  const handleEditClick = async (planoParaEditar: Plano) => {
    const planoDetalhado = await fetchPlanoDetails(planoParaEditar.id);
    if (planoDetalhado) {
        setPlanoEmEdicao(planoDetalhado);
        setModo("formulario");
    } else {
        alert("Não foi possível carregar os detalhes do plano para edição.");
    }
  };
  
  const handleNewClick = () => {
    setPlanoEmEdicao(null);
    setModo("formulario");
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <Sidebar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      <div className="flex-1 p-4 md:p-8">
        <HeaderBar toggleSidebar={toggleSidebar} />
        <main className="p-4 md:p-8">
          {/* Dashboard Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-lg shadow p-4">
              <p className="text-sm text-gray-500">Total de Pacientes</p>
              <p className="text-2xl font-bold text-green-600">{pacientes.length}</p>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <p className="text-sm text-gray-500">Dietas Cadastradas</p>
              <p className="text-2xl font-bold text-blue-600">{planos.length}</p>
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

          {/* --- AQUI ESTÁ A CORREÇÃO --- */}
          {/* Botões de Ação restaurados */}
          <div className="flex flex-wrap gap-4 mb-6">
            {["Meus Pacientes", "Consultas", "Relatórios", "Avaliações"].map((item) =>
              item === "Consultas" ? (
                <Link key={item} href="/consultas" passHref>
                  <button className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg shadow">
                    {item}
                  </button>
                </Link>
              ) : (
                <button key={item} className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg shadow">
                  {item}
                </button>
              )
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <PacientesList 
              pacientes={pacientes} 
              onPacienteSelect={setPacienteSelecionado}
              isLoading={isLoadingPacientes}
            />
            
            <div className="md:col-span-2 bg-white p-6 rounded-lg shadow-md">
              {pacienteSelecionado ? (
                <>
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-gray-800">Planos de {pacienteSelecionado.nome}</h2>
                    {modo === "lista" && (
                      <button onClick={handleNewClick} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md">+ Novo Plano</button>
                    )}
                     {modo === "formulario" && (
                      <button onClick={() => setModo("lista")} className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md">← Voltar para a Lista</button>
                    )}
                  </div>

                  {modo === "lista" ? (
                     <div className="space-y-4">
                      {isLoadingPlanos ? <p>Carregando planos...</p> : 
                        planos.length > 0 ? planos.map(plano => (
                          <PlanoExistenteCard 
                            key={plano.id} 
                            plano={plano} 
                            alimentos={alimentos}
                            onFetchDetails={fetchPlanoDetails}
                            onEdit={() => handleEditClick(plano)} 
                            onDelete={() => handleDeletePlano(plano.id)} 
                          />
                        )) : <p>Nenhum plano encontrado para este paciente.</p>
                      }
                     </div>
                  ) : (
                    <PlanoAlimentarForm 
                      pacienteId={pacienteSelecionado.id} 
                      onSave={handleSavePlano} 
                      initialData={planoEmEdicao || undefined} 
                    />
                  )}
                </>
              ) : (
                <div className="flex items-center justify-center h-full">
                    <p className="text-gray-500 text-lg">Selecione um paciente para gerenciar os planos alimentares.</p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
