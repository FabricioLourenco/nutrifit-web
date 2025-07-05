"use client";
import { useState, useEffect } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

// --- Interfaces ---
interface Alimento { id: number; nome: string; }
interface Item { id: number; nome: string; quantidade: number; unidadeMedida: number; alimentoId: number; }
interface Refeicao { id: number; nome: string; horario: string; itens: Item[]; }
interface Plano { id: number; observacoesGerais: string; dataInicio: string; refeicoes?: Refeicao[]; }

interface PlanoExistenteCardProps {
  plano: Plano;
  onFetchDetails: (planoId: number) => Promise<Plano | null>;
  onEdit: () => void;
  onDelete: () => void;
}

export function PlanoExistenteCard({ plano, onFetchDetails, onEdit, onDelete }: PlanoExistenteCardProps) {
  const [detalhesVisiveis, setDetalhesVisiveis] = useState(false);
  const [planoDetalhado, setPlanoDetalhado] = useState<Plano | null>(plano);
  const [isLoadingDetalhes, setIsLoadingDetalhes] = useState(false);

  // Garante que o estado seja resetado se o plano mudar
  useEffect(() => {
    setPlanoDetalhado(plano);
    setDetalhesVisiveis(false); // Oculta detalhes ao trocar de plano
  }, [plano]);

  const handleToggleDetalhes = async () => {
    // Se já temos os detalhes e eles estão visíveis, apenas oculta.
    if (detalhesVisiveis) {
        setDetalhesVisiveis(false);
        return;
    }
    // Se não temos os detalhes ou estão ocultos, busca na API.
    setIsLoadingDetalhes(true);
    const detalhes = await onFetchDetails(plano.id);
    if (detalhes) {
      setPlanoDetalhado(detalhes);
    }
    setIsLoadingDetalhes(false);
    setDetalhesVisiveis(true); // Mostra os detalhes após buscar
  };

  const getUnidadeMedidaNome = (id: number) => {
    switch (id) {
      case 1: return "g";
      case 2: return "un";
      case 3: return "ml";
      default: return "";
    }
  };

  return (
    <div className="bg-gray-50 border border-gray-200 p-4 rounded-lg shadow-sm transition-shadow hover:shadow-md">
      <div className="flex justify-between items-start">
        <div>
          <p className="font-bold text-lg text-gray-800">Plano Alimentar</p>
          <p className="text-sm text-gray-600">
            Início em: {format(new Date(plano.dataInicio), "dd/MM/yyyy", { locale: ptBR })}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleToggleDetalhes}
            className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-1 px-3 rounded-md text-sm"
          >
            {detalhesVisiveis ? "Ocultar" : "Ver Detalhes"}
          </button>
          <button onClick={onEdit} className="bg-yellow-500 hover:bg-yellow-600 text-white font-medium py-1 px-3 rounded-md text-sm">Editar</button>
          <button onClick={onDelete} className="bg-red-600 hover:bg-red-700 text-white font-medium py-1 px-3 rounded-md text-sm">Excluir</button>
        </div>
      </div>
      <p className="mt-2 text-gray-700 text-sm">
        <span className="font-semibold">Observações:</span> {plano.observacoesGerais || "Nenhuma."}
      </p>

      {detalhesVisiveis && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          {isLoadingDetalhes ? <p className="text-sm text-gray-500">Carregando refeições...</p> :
            planoDetalhado?.refeicoes && planoDetalhado.refeicoes.length > 0 ? (
              <div className="space-y-3">
                {planoDetalhado.refeicoes.map(refeicao => (
                  <div key={refeicao.id} className="bg-white p-3 rounded border">
                    <div className="flex justify-between items-center">
                      <p className="font-semibold text-lime-700">{refeicao.nome}</p>
                      <p className="text-sm font-mono text-gray-600">{refeicao.horario.substring(0, 5)}</p>
                    </div>
                    <ul className="mt-2 pl-4 list-disc list-inside space-y-1">
                      {refeicao.itens.map(item => (
                        <li key={item.id} className="text-sm text-gray-700">
                          {item.nome} - {item.quantidade}{getUnidadeMedidaNome(item.unidadeMedida)}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            ) : <p className="text-sm text-gray-500">Nenhuma refeição detalhada encontrada para este plano.</p>
          }
        </div>
      )}
    </div>
  );
}