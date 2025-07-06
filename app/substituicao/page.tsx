// Caminho: app/substituicao/page.tsx

"use client";

import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import { HeaderBar } from "../components/HeaderBar";
import FormSubstituicao from "../components/FormSubstituicao";
import TabelaSubstituicoes from "../components/TabelaSubstituicoes";

// --- TIPAGENS GLOBAIS PARA A PÁGINA ---

export interface Alimento {
  id: number;
  nome: string;
  calorias: number;
  proteinas: number;
  carboidratos: number;
  gorduras: number;
  alimentoIbgeId: number;
}
interface ApiResponseAlimentos {
  sucesso: boolean;
  data: Alimento[];
}

interface AlimentoAlternativo {
    id: number; nome: string; caloriasPorGrama: number; caloriasNaQuantidadeInformada: number;
    quantidadeGramaNecessaria: number; proteinas: number; carboidratos: number; gorduras: number;
}
interface SubstituicaoData {
    alimentoOriginal: Alimento;
    alimentosAlternativos: AlimentoAlternativo[];
}
interface ApiResponseSubstituicao {
    sucesso: boolean;
    data: SubstituicaoData;
}

export interface SubstituicaoParaTabela {
  id: number; substituto: string; gramagemNecessaria: number; calorias: number;
  proteinas: number; carboidratos: number; gorduras: number;
}


export default function SubstituicaoPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  const [alimentosList, setAlimentosList] = useState<Alimento[]>([]);
  const [isLoadingAlimentos, setIsLoadingAlimentos] = useState(true);
  const [errorAlimentos, setErrorAlimentos] = useState<string | null>(null);

  const [substituicoes, setSubstituicoes] = useState<SubstituicaoParaTabela[]>([]);
  const [alimentoOriginal, setAlimentoOriginal] = useState<Alimento | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  useEffect(() => {
    const fetchAlimentos = async () => {
      try {
        const response = await fetch('https://localhost:7058/api/v1/Alimento/buscar-alimentos');
        if (!response.ok) throw new Error("Falha na rede ao buscar alimentos.");
        const result: ApiResponseAlimentos = await response.json();
        if (result.sucesso) setAlimentosList(result.data);
        else throw new Error("API não retornou sucesso ao buscar lista de alimentos.");
      } catch (err: any) {
        setErrorAlimentos("Não foi possível carregar a lista de alimentos. Verifique se sua API está rodando.");
      } finally {
        setIsLoadingAlimentos(false);
      }
    };
    fetchAlimentos();
  }, []);

  // **** AQUI ESTÁ A CORREÇÃO ****
  // A função agora aceita `alimentoId: number` como o primeiro parâmetro, que corresponde
  // ao que o componente FormSubstituicao está enviando.
  const buscarSubstituicoes = async (alimentoId: number, gramagem: number) => {
    setIsSearching(true);
    setSearchError(null);
    setSubstituicoes([]);
    setAlimentoOriginal(null);

    try {
      // A URL agora usa o `alimentoId` (número) corretamente.
      const url = `https://localhost:7058/api/v1/Alimento/buscar-alimentos-alternativos/${alimentoId}/${gramagem}`;
      const response = await fetch(url);
      if (!response.ok) throw new Error(`Erro na busca: ${response.statusText}`);
      
      const result: ApiResponseSubstituicao = await response.json();
      if (result.sucesso && result.data && result.data.alimentosAlternativos) {
        const dadosFormatados = result.data.alimentosAlternativos.map(alt => ({
            id: alt.id,
            substituto: alt.nome,
            gramagemNecessaria: alt.quantidadeGramaNecessaria,
            calorias: alt.caloriasNaQuantidadeInformada,
            proteinas: alt.proteinas,
            carboidratos: alt.carboidratos,
            gorduras: alt.gorduras
        }));
        setSubstituicoes(dadosFormatados);
        setAlimentoOriginal(result.data.alimentoOriginal);
      } else {
        throw new Error(result.sucesso ? "A API não retornou dados para a substituição." : "A API retornou um erro.");
      }
    } catch (err: any) {
      setSearchError(err.message || "Ocorreu um erro ao buscar as substituições.");
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      <div className="flex-1 p-4 md:p-8">
        <HeaderBar toggleSidebar={toggleSidebar} />
        <main className="p-4 md:p-8">
          <div className="max-w-5xl mx-auto">
            <h1 className="text-3xl font-bold mb-6 text-gray-800">Tabela de Substituição</h1>
            <p className="text-gray-600 mb-8 text-center md:text-left">
              Selecione um alimento e a gramagem para descobrir substitutos com calorias equivalentes.
            </p>
            {errorAlimentos && <div className="bg-red-100 text-red-700 p-3 rounded-md mb-4" role="alert">{errorAlimentos}</div>}
            
            <FormSubstituicao 
              onBuscar={buscarSubstituicoes} 
              alimentosList={alimentosList}
              isLoading={isLoadingAlimentos}
              isSearching={isSearching}
            />

            {searchError && <div className="bg-red-100 text-red-700 p-3 rounded-md mt-6" role="alert">{searchError}</div>}
            
            <TabelaSubstituicoes 
              substituicoes={substituicoes} 
              alimentoOriginal={alimentoOriginal}
              isSearching={isSearching}
            />
          </div>
        </main>
      </div>
    </div>
  );
}