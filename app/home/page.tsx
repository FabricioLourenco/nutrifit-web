"use client";

import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import { HeaderBar } from "../components/HeaderBar";
// A correção principal está aqui: importamos com chaves { }
import { RefeicaoCard } from "../components/RefeicaoCard";
import { ResumoMacrosCard } from "../components/ResumoMacrosCard";
import { ComentarioModal } from "../components/ComentarioModal";

// --- Interfaces ---
interface ItemRefeicao {
  id: number;
  nome: string;
  quantidade: number;
  unidadeMedida: number; 
  alimentoId: number;
}
interface Alimento {
    id: number;
    nome: string;
    calorias: number;
    proteinas: number;
    carboidratos: number;
    gorduras: number;
}
interface Refeicao {
  id: number;
  nome: string;
  horario: string;
  itens: ItemRefeicao[];
  macrosTotais?: {
    calorias: number;
    proteinas: number;
    carboidratos: number;
    gorduras: number;
  }
}
interface PlanoAlimentar {
  id: number;
  observacoesGerais: string;
  refeicoes: Refeicao[];
}

function decodeJWT(token: string): any | null {
  try {
    const payloadBase64 = token.split(".")[1];
    return JSON.parse(atob(payloadBase64));
  } catch (e) { return null; }
}

export default function HomePage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [plano, setPlano] = useState<PlanoAlimentar | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isClient, setIsClient] = useState(false);
  const [pacienteId, setPacienteId] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  
  const handleSubmeterComentario = async (conteudo: string) => {
    if (!pacienteId) {
        alert("Erro: ID do paciente não encontrado.");
        return;
    }

    setIsSubmitting(true);
    try {
        const comentarioParaEnviar = {
            id: 0,
            dataComentario: new Date().toISOString(),
            conteudo: conteudo,
            pacienteId: pacienteId
        };

        const response = await fetch('https://localhost:7058/api/v1/ComentarioPaciente/inserir-comentario-paciente', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json-patch+json' },
            body: JSON.stringify(comentarioParaEnviar)
        });

        if (!response.ok) throw new Error("Falha ao enviar o comentário.");
        
        const result = await response.json();
        if (result.sucesso) {
            alert("Comentário enviado com sucesso!");
            setIsModalOpen(false);
        } else {
            throw new Error(result.mensagens?.join(", ") || "Ocorreu um erro.");
        }
    } catch (error: any) {
        console.error("Erro ao submeter comentário:", error);
        alert(`Erro: ${error.message}`);
    } finally {
        setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (!isClient) return;

    const fetchPlanoAlimentar = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem("authToken");
        if (!token) throw new Error("Token não encontrado");

        const decodedToken = decodeJWT(token);
        const usuarioId = decodedToken?.Id;
        if (!usuarioId) throw new Error("ID do usuário não encontrado no token");
        
        const pacienteResponse = await fetch(`https://localhost:7058/api/v1/Paciente/buscar-paciente-por-usuario-id?usuarioId=${usuarioId}`);
        if (!pacienteResponse.ok) throw new Error("Falha ao buscar dados do paciente.");

        const pacienteResult = await pacienteResponse.json();
        if (!pacienteResult.sucesso || !pacienteResult.data) throw new Error("Paciente não encontrado.");
        
        const idDoPaciente = pacienteResult.data.id;
        setPacienteId(idDoPaciente);

        const response = await fetch(`https://localhost:7058/api/v1/PlanoAlimentar/buscar-planos-alimentares-por-paciente?pacienteId=${idDoPaciente}`);
        if (!response.ok) throw new Error("Falha ao buscar plano alimentar.");

        const result = await response.json();
        if (result.sucesso && result.data && result.data.length > 0) {
          const planoRecebido: PlanoAlimentar = result.data[0];

          const promessasDeAlimentos = planoRecebido.refeicoes.flatMap(r => r.itens).map(item =>
              fetch(`https://localhost:7058/api/v1/Alimento/buscar-alimento-por-id?id=${item.alimentoId}`).then(res => res.json())
          );
          const resultadosAlimentos = await Promise.all(promessasDeAlimentos);
          const alimentosMap = new Map<number, Alimento>();
          resultadosAlimentos.forEach(res => { if (res.sucesso && res.data) alimentosMap.set(res.data.id, res.data); });

          const planoAtualizado: PlanoAlimentar = {
            ...planoRecebido,
            refeicoes: planoRecebido.refeicoes.map(refeicao => {
              const totais = { calorias: 0, proteinas: 0, carboidratos: 0, gorduras: 0 };
              refeicao.itens.forEach(item => {
                const dadosAlimento = alimentosMap.get(item.alimentoId);
                if (dadosAlimento && item.unidadeMedida === 1) {
                  const mult = item.quantidade / 100;
                  totais.calorias += dadosAlimento.calorias * mult;
                  totais.proteinas += dadosAlimento.proteinas * mult;
                  totais.carboidratos += dadosAlimento.carboidratos * mult;
                  totais.gorduras += dadosAlimento.gorduras * mult;
                }
              });
              return { ...refeicao, macrosTotais: totais };
            })
          };
          setPlano(planoAtualizado);
        } else {
          setPlano(null);
        }
      } catch (error) {
        console.error("Erro ao carregar plano alimentar:", error);
        setPlano(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPlanoAlimentar();
  }, [isClient]);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

      <div className="flex-1 p-4 md:p-8">
        <HeaderBar toggleSidebar={toggleSidebar} />
        
        <div className="mt-8">
            {!isClient || isLoading ? (
                <p className="text-center text-gray-500">Carregando seu plano alimentar...</p>
            ) : plano ? (
                <div className="space-y-6">
                    <div className="p-8 bg-lime-100 text-lime-800 rounded-lg">
                        <h2 className="font-bold">Observações do seu Nutricionista:</h2>
                        <p>{plano.observacoesGerais || "Nenhuma observação geral."}</p>
                    </div>

                    {plano.refeicoes.map((refeicao) => (
                      <div key={refeicao.id} className="flex flex-col md:flex-row gap-6 items-start">
                        <div className="flex-1 w-full"><RefeicaoCard refeicao={refeicao} /></div>
                        {refeicao.macrosTotais && <ResumoMacrosCard macros={refeicao.macrosTotais} />}
                      </div>
                    ))}
                    
                    <div className="mt-8 p-6 bg-white rounded-lg shadow-md text-center">
                        <h3 className="text-xl font-bold text-gray-700">Gostou do seu plano?</h3>
                        <p className="text-gray-500 mt-2 mb-4">Seu feedback é muito importante. Envie um comentário para seu nutricionista!</p>
                        <button 
                            onClick={() => setIsModalOpen(true)}
                            className="bg-green-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-green-700 transition-transform transform hover:scale-105"
                        >
                            Adicionar Comentário
                        </button>
                    </div>
                </div>
            ) : (
                <div className="text-center p-10 bg-white rounded-lg shadow-md">
                    <h2 className="text-2xl font-bold text-gray-700">Nenhum plano alimentar encontrado!</h2>
                    <p className="text-gray-500 mt-2">Parece que seu nutricionista ainda não cadastrou uma dieta para você.</p>
                </div>
            )}
        </div>
      </div>
      
      <ComentarioModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmeterComentario}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}