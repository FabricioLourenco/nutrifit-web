// app/components/AppointmentModal.tsx
"use client";

import { useState, useEffect } from "react"; // Importamos useState e useEffect

interface AppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (title: string) => void;
  eventInfo?: { title: string };
}

export function AppointmentModal({ isOpen, onClose, onSave, eventInfo }: AppointmentModalProps) {
  // PASSO 1: Criamos um estado para controlar o valor do input
  const [inputValue, setInputValue] = useState('');

  // PASSO 2: Usamos useEffect para atualizar o estado quando o modal é aberto
  // Isso garante que o título correto apareça ao editar um evento
  useEffect(() => {
    if (isOpen) {
      setInputValue(eventInfo?.title || '');
    }
  }, [isOpen, eventInfo]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // PASSO 3: Usamos o valor do nosso estado, que é seguro e sem erros de tipo
    if (inputValue) {
      onSave(inputValue);
      setInputValue(''); // Limpa o input após salvar
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex justify-center items-center">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md relative">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">
          {eventInfo ? 'Editar Consulta' : 'Agendar Consulta'}
        </h2>
        <form onSubmit={handleSubmit}>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            Título (Paciente)
          </label>
          <input
            id="title"
            name="title"
            type="text"
            // PASSO 4: O input agora é controlado pelo estado do React
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-lime-500"
            required
            autoFocus // Adiciona foco automático ao abrir o modal
          />
          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="bg-lime-600 text-white px-4 py-2 rounded-lg hover:bg-lime-700"
            >
              {eventInfo ? 'Salvar Alterações' : 'Salvar Consulta'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}