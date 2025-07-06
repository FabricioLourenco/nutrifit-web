"use client";

import { useState } from "react";
import Select from "react-select";

// Tipos usados no componente
interface Alimento {
  id: number;
  nome: string;
}
interface OptionType {
  value: number;
  label: string;
}

// Propriedades que o formulário espera receber da página principal
interface FormSubstituicaoProps {
  onBuscar: (alimentoId: number, gramagem: number) => void;
  alimentosList: Alimento[];
  isLoading: boolean; // Para o loading da lista inicial
  isSearching: boolean; // Para o loading da busca de substituições
}

export default function FormSubstituicao({ onBuscar, alimentosList, isLoading, isSearching }: FormSubstituicaoProps) {
  const [selectedAlimento, setSelectedAlimento] = useState<OptionType | null>(null);
  const [gramagem, setGramagem] = useState<number | string>(100);

  // Mapeia a lista de alimentos para o formato que o react-select precisa
  const options: OptionType[] = alimentosList.map((alimento) => ({
    value: alimento.id,
    label: alimento.nome,
  }));

  // Função chamada ao enviar o formulário
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedAlimento) {
      alert("Por favor, selecione um alimento.");
      return;
    }
    // Chama a função da página principal enviando o ID do alimento e a gramagem
    onBuscar(selectedAlimento.value, Number(gramagem));
  };

  // Estilos para o dropdown
  const customStyles = {
    control: (provided: any) => ({ ...provided, borderColor: '#e5e7eb', '&:hover': { borderColor: '#9ca3af' }, boxShadow: 'none', minHeight: '42px'}),
    option: (provided: any, state: any) => ({ ...provided, backgroundColor: state.isSelected ? '#3b82f6' : state.isFocused ? '#eff6ff' : 'white', color: state.isSelected ? 'white' : 'black' }),
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
      <form onSubmit={handleSubmit} className="flex flex-col md:flex-row items-center gap-4">
        <div className="flex-1 w-full">
          <label htmlFor="alimento-select" className="block text-sm font-medium text-gray-700 mb-1">
            Selecione o Alimento
          </label>
          <Select
            id="alimento-select"
            instanceId="alimento-select-instance"
            options={options}
            value={selectedAlimento}
            onChange={(option) => setSelectedAlimento(option)}
            placeholder="Digite para buscar um alimento..."
            isLoading={isLoading}
            loadingMessage={() => "Carregando alimentos..."}
            noOptionsMessage={() => "Nenhum alimento encontrado"}
            styles={customStyles}
            isClearable
          />
        </div>

        <div className="w-full md:w-auto">
          <label htmlFor="gramagem" className="block text-sm font-medium text-gray-700 mb-1">
            Gramagem (g)
          </label>
          <input
            id="gramagem"
            type="number"
            value={gramagem}
            onChange={(e) => setGramagem(e.target.value)}
            placeholder="Ex: 100"
            className="w-full md:w-32 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        <div className="w-full md:w-auto mt-4 md:mt-0 self-end">
          <button
            type="submit"
            className="w-full md:w-auto bg-blue-600 text-white font-semibold px-6 py-2.5 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out disabled:bg-gray-400 disabled:cursor-not-allowed"
            disabled={isLoading || isSearching}
          >
            {isSearching ? 'Buscando...' : 'Buscar'}
          </button>
        </div>
      </form>
    </div>
  );
}