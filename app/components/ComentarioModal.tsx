"use client";

import { useState } from 'react';

// A correção é nesta interface
interface ComentarioModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (conteudo: string) => void;
  // A LINHA QUE FALTAVA ESTÁ AQUI:
  isSubmitting: boolean;
}

export const ComentarioModal: React.FC<ComentarioModalProps> = ({ isOpen, onClose, onSubmit, isSubmitting }) => {
  const [conteudo, setConteudo] = useState("");

  if (!isOpen) {
    return null;
  }

  const handleSubmit = () => {
    // Validação simples para não enviar comentário vazio
    if (conteudo.trim()) {
      onSubmit(conteudo);
    }
  };

  return (
    // Overlay de fundo transparente
    <div className="fixed inset-0 z-40 flex justify-center items-center p-4">
      {/* Conteúdo do Modal */}
      <div className="bg-white p-6 rounded-lg shadow-xl z-50 w-full max-w-lg mx-4 border border-gray-200">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Deixe seu Comentário</h2>
        <p className="text-gray-600 mb-4">
          Conte ao seu nutricionista como foi a sua experiência com o plano alimentar.
        </p>

        <textarea
          value={conteudo}
          onChange={(e) => setConteudo(e.target.value)}
          className="w-full h-32 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-lime-500 focus:border-lime-500 transition"
          placeholder="Ex: Gostei muito do café da manhã, mas achei o jantar um pouco difícil de preparar..."
          disabled={isSubmitting}
        />

        <div className="mt-6 flex justify-end gap-4">
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 disabled:opacity-50 transition"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting || !conteudo.trim()}
            className="px-4 py-2 bg-lime-600 text-white rounded-md hover:bg-lime-700 disabled:bg-lime-300 disabled:cursor-not-allowed transition"
          >
            {isSubmitting ? 'Enviando...' : 'Enviar Comentário'}
          </button>
        </div>
      </div>
    </div>
  );
};