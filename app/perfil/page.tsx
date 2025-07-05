"use client";

import { useState, useEffect } from "react";
import Image from 'next/image';
import Link from 'next/link';
import  Sidebar  from "../components/Sidebar";
import { HeaderBar } from "../components/HeaderBar";
import { EditableField } from "../components/EditableField";
import { ComentarioModal } from "../components/ComentarioModal";
import { User, Pencil, Target, TrendingUp, ShieldCheck, ChevronRight, CalendarClock, HelpCircle } from "lucide-react";

// --- Interfaces ---
interface Paciente {
  id: number;
  nome: string;
  dataNascimento: string;
  peso: number;
  altura: number;
  objetivo: string;
  fotoUrl: string | null;
}
interface PlanoAlimentar {
    id: number;
    dataInicio: string;
}

// --- Funções Auxiliares ---
const ProgressBar = ({ value, colorClass }: { value: number, colorClass: string }) => {
  return (
    <div className="w-full bg-gray-200 rounded-full h-2">
        <div className={`${colorClass} h-2 rounded-full transition-all duration-500`} style={{ width: `${value}%` }}></div>
    </div>
  );
};

function decodeJWT(token: string): any | null {
  try {
    const payloadBase64 = token.split(".")[1];
    return JSON.parse(atob(payloadBase64));
  } catch (e) { return null; }
}

const calculateAge = (birthDateString: string) => {
  const birthDate = new Date(birthDateString);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
};

const calculateProgress = (startDate: string, durationDays: number): number => {
    if (!startDate || durationDays <= 0) return 0;
    const inicio = new Date(startDate);
    const hoje = new Date();
    inicio.setHours(0, 0, 0, 0);
    hoje.setHours(0, 0, 0, 0);
    const diffTime = hoje.getTime() - inicio.getTime();
    if (diffTime < 0) return 0;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;
    const percentage = (diffDays / durationDays) * 100;
    return Math.min(100, Math.max(0, percentage));
};


// --- Componente da Página de Perfil ---
export default function PerfilUser() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [paciente, setPaciente] = useState<Paciente | null>(null);
  const [plano, setPlano] = useState<PlanoAlimentar | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isClient, setIsClient] = useState(false);
  
  // CORREÇÃO: Todos os estados editáveis são inicializados e mantidos como strings
  const [adesao, setAdesao] = useState("95%");
  const [peso, setPeso] = useState("0");
  const [altura, setAltura] = useState("0");
  const [objetivo, setObjetivo] = useState("");
  const [duracaoPlano, setDuracaoPlano] = useState("30");

  // Estados para o modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);


  useEffect(() => { setIsClient(true); }, []);
  const toggleSidebar = () => { setSidebarOpen(!sidebarOpen); };
  
  // Função para enviar o comentário
  const handleSubmeterComentario = async (conteudo: string) => {
    if (!paciente) {
        alert("Erro: Dados do paciente não encontrados.");
        return;
    }
    setIsSubmitting(true);
    try {
        const response = await fetch('https://localhost:7058/api/v1/ComentarioPaciente/inserir-comentario-paciente', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json-patch+json' },
            body: JSON.stringify({
              id: 0,
              dataComentario: new Date().toISOString(),
              conteudo: conteudo,
              pacienteId: paciente.id
            })
        });
        if (!response.ok) throw new Error("Falha ao enviar o comentário.");
        const result = await response.json();
        if (result.sucesso) {
            alert("Sua mensagem foi enviada com sucesso!");
            setIsModalOpen(false);
        } else {
            throw new Error(result.mensagens?.join(", ") || "Ocorreu um erro.");
        }
    } catch (error: any) {
        alert(`Erro: ${error.message}`);
    } finally {
        setIsSubmitting(false);
    }
  };


  useEffect(() => {
    if (!isClient) return;
    
    // CORREÇÃO: Lógica de carregar do cache simplificada
    setAdesao(localStorage.getItem('userAdesao') || "95%");
    setPeso(localStorage.getItem('userPeso') || "0");
    setAltura(localStorage.getItem('userAltura') || "0");
    setObjetivo(localStorage.getItem('userObjetivo') || "");
    setDuracaoPlano(localStorage.getItem('userDuracaoPlano') || "30");

    const fetchAllData = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem("authToken");
        if (!token) throw new Error("Token não encontrado");
        const decodedToken = decodeJWT(token);
        const usuarioId = decodedToken?.Id;
        if (!usuarioId) throw new Error("ID do usuário não encontrado");
        
        const pacienteResponse = await fetch(`https://localhost:7058/api/v1/Paciente/buscar-paciente-por-usuario-id?usuarioId=${usuarioId}`);
        if (!pacienteResponse.ok) throw new Error("Falha ao buscar dados do paciente.");
        const pacienteResult = await pacienteResponse.json();
        
        if (pacienteResult.sucesso && pacienteResult.data) {
          const pacienteData = pacienteResult.data;
          setPaciente(pacienteData);
          
          // CORREÇÃO: Define o estado local (convertendo para string) apenas se não houver valor no cache
          if (!localStorage.getItem('userPeso')) setPeso(String(pacienteData.peso));
          if (!localStorage.getItem('userAltura')) setAltura(String(pacienteData.altura));
          if (!localStorage.getItem('userObjetivo')) setObjetivo(pacienteData.objetivo);

          const planoResponse = await fetch(`https://localhost:7058/api/v1/PlanoAlimentar/buscar-planos-alimentares-por-paciente?pacienteId=${pacienteData.id}`);
          if(planoResponse.ok) {
              const planoResult = await planoResponse.json();
              if(planoResult.sucesso && planoResult.data && planoResult.data.length > 0) {
                  setPlano(planoResult.data[0]);
              }
          }
        } else {
          setPaciente(null);
        }
      } catch (error) {
        console.error("Erro ao carregar dados do perfil:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAllData();
  }, [isClient]);

  // Efeitos para salvar no cache. Os valores já são strings.
  useEffect(() => { if(isClient) localStorage.setItem('userAdesao', adesao); }, [adesao, isClient]);
  useEffect(() => { if(isClient) localStorage.setItem('userPeso', peso); }, [peso, isClient]);
  useEffect(() => { if(isClient) localStorage.setItem('userAltura', altura); }, [altura, isClient]);
  useEffect(() => { if(isClient) localStorage.setItem('userObjetivo', objetivo); }, [objetivo, isClient]);
  useEffect(() => { if(isClient) localStorage.setItem('userDuracaoPlano', duracaoPlano); }, [duracaoPlano, isClient]);

  if (isLoading && !paciente) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-50"><p>Carregando perfil...</p></div>;
  }
  
  if (!paciente) {
      return <div className="min-h-screen flex items-center justify-center bg-gray-50"><p>Não foi possível carregar os dados do perfil.</p></div>;
  }

  // CORREÇÃO: Converte a string para número na hora do cálculo
  const progressoCalculado = plano ? calculateProgress(plano.dataInicio, parseInt(duracaoPlano, 10)) : 0;
  const adesaoCalculada = parseInt(adesao.replace('%', '')) || 0;

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      <main className="flex-1 p-4 md:p-8">
        <HeaderBar toggleSidebar={toggleSidebar} />
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 bg-white p-6 rounded-xl shadow-sm flex flex-col items-center text-center border border-gray-200">
            <div className="relative mb-4">
              <div className="w-28 h-28 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden border-4 border-lime-300">
                {paciente.fotoUrl ? (
                  <Image src={paciente.fotoUrl} alt="Foto de Perfil" width={112} height={112} className="object-cover" />
                ) : (
                  <User className="w-16 h-16 text-gray-400" />
                )}
              </div>
              <button
                className="absolute bottom-0 right-0 bg-lime-500 hover:bg-lime-600 text-white p-2 rounded-full shadow-md transition"
                onClick={() => alert("Funcionalidade de editar foto a ser implementada!")}
              >
                <Pencil className="w-4 h-4" />
              </button>
            </div>
            
            <h1 className="text-2xl font-bold text-gray-800">{paciente.nome}</h1>
            <p className="text-sm text-gray-500 mt-1">{calculateAge(paciente.dataNascimento)} anos</p>
            
            <div className="w-full mt-6 pt-6 border-t border-gray-100 flex justify-around">
              <div className="text-center">
                  <p className="text-xs text-gray-500 uppercase">Peso (kg)</p>
                  <EditableField initialValue={peso} onSave={setPeso} inputType="number" />
              </div>
              <div className="text-center">
                  <p className="text-xs text-gray-500 uppercase">Altura (m)</p>
                  <EditableField initialValue={altura} onSave={setAltura} inputType="number" />
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <h2 className="text-lg font-bold text-gray-800 mb-4">Resumo do Acompanhamento</h2>
              <div className="space-y-4">
                
                <div className="flex items-start gap-4 bg-lime-50 p-4 rounded-lg">
                  <Target className="w-6 h-6 text-lime-600 flex-shrink-0 mt-1" />
                  <div>
                    <p className="text-sm font-semibold text-lime-800">Seu objetivo principal</p>
                    <EditableField initialValue={objetivo} onSave={setObjetivo} />
                  </div>
                </div>
                
                <div className="space-y-4 pt-2">
                  <div className="flex items-center gap-3 text-gray-600">
                      <CalendarClock className="w-5 h-5 text-purple-500 flex-shrink-0"/>
                      <span className="flex-shrink-0">Duração do Plano:</span>
                      <EditableField 
                          initialValue={duracaoPlano}
                          onSave={setDuracaoPlano}
                          inputType="number"
                      />
                      <span className="flex-shrink-0">dias</span>
                  </div>
                  <div className="space-y-2">
                      <div className="flex justify-between items-center text-sm">
                          <div className="flex items-center gap-2 font-semibold text-gray-700">
                              <TrendingUp className="w-5 h-5 text-blue-500"/>
                              <span>Progresso do Plano</span>
                          </div>
                          <span className="font-bold text-blue-500">{Math.round(progressoCalculado)}%</span>
                      </div>
                      <ProgressBar value={progressoCalculado} colorClass="bg-blue-500" />
                  </div>
                  <div className="space-y-2">
                      <div className="flex justify-between items-center text-sm">
                          <div className="flex items-center gap-2 font-semibold text-gray-700">
                              <ShieldCheck className="w-5 h-5 text-green-500"/>
                              <span>Adesão (manual)</span>
                          </div>
                          <EditableField initialValue={adesao} onSave={setAdesao} />
                          <span title="Adesão é um valor subjetivo. Preencha como você se sente em relação ao plano.">
                            <HelpCircle size={16} className="text-gray-400 cursor-help" />
                          </span>
                      </div>
                      <ProgressBar value={adesaoCalculada} colorClass="bg-green-500" />
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <h2 className="text-lg font-bold text-gray-800 mb-4">Navegação Rápida</h2>
              <div className="space-y-2">
                <Link href="/home" className="w-full flex items-center justify-between text-left p-3 rounded-lg text-gray-700 font-semibold hover:bg-gray-100 transition">
                  <span>Ver meu Plano Alimentar</span>
                  <ChevronRight className="w-5 h-5" />
                </Link>
                <button className="w-full flex items-center justify-between text-left p-3 rounded-lg text-gray-700 hover:bg-gray-100 transition">
                  <span>Histórico de Consultas</span>
                  <ChevronRight className="w-5 h-5" />
                </button>
                <button 
                  onClick={() => setIsModalOpen(true)}
                  className="w-full flex items-center justify-between text-left p-3 rounded-lg text-gray-700 hover:bg-gray-100 transition"
                >
                  <span>Falar com Nutricionista</span>
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <ComentarioModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmeterComentario}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}