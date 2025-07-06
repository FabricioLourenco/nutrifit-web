"use client";

// Importa os tipos da página principal para garantir consistência
import { SubstituicaoParaTabela, Alimento } from "../substituicao/page";

interface TabelaSubstituicoesProps {
  substituicoes: SubstituicaoParaTabela[];
  alimentoOriginal: Alimento | null;
  isSearching: boolean;
}

export default function TabelaSubstituicoes({ substituicoes, alimentoOriginal, isSearching }: TabelaSubstituicoesProps) {
  // Mostra mensagem de "Buscando..."
  if (isSearching) {
    return <div className="text-center p-10 text-gray-600 animate-pulse">Buscando substituições...</div>;
  }
  
  // Mensagem inicial antes da primeira busca
  if (!alimentoOriginal && substituicoes.length === 0) {
    return <div className="text-center text-gray-500 p-10">Faça uma busca para ver os resultados aqui.</div>;
  }
  
  // Mensagem se a busca não retornou resultados
  if (substituicoes.length === 0 && alimentoOriginal) {
    return <div className="text-center text-gray-500 p-10">Nenhuma substituição encontrada para {alimentoOriginal.nome}.</div>;
  }
  
  // Renderiza a tabela se houver resultados
  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden mt-6">
      {alimentoOriginal && (
          <h2 className="text-xl font-semibold p-4 bg-gray-50 border-b">
              Opções para substituir: <span className="text-blue-600">{alimentoOriginal.nome}</span>
          </h2>
      )}
      <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Substituto</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Qtd. Necessária (g)</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Calorias</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Proteínas (g)</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Carbs (g)</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Gorduras (g)</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {substituicoes.map((sub) => (
                <tr key={sub.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{sub.substituto}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-bold">{sub.gramagemNecessaria.toFixed(1)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{sub.calorias.toFixed(1)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{sub.proteinas.toFixed(1)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{sub.carboidratos.toFixed(1)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{sub.gorduras.toFixed(1)}</td>
                </tr>
              ))}
            </tbody>
          </table>
      </div>
    </div>
  );
}