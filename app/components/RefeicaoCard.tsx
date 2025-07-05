"use client";

import { useState } from "react";
import { Coffee, Sun, Utensils, Apple, Moon, MessageSquarePlus } from "lucide-react";
import { ComentarioModal } from "./ComentarioModal";

// --- Interfaces para os dados da refeição ---
interface Item {
  id: number;
  nome: string;
  quantidade: number;
  unidadeMedida: number;
}
interface Refeicao {
  id: number;
  nome: string;
  horario: string;
  itens: Item[];
}

interface RefeicaoCardProps {
  refeicao: Refeicao;
}

// --- AQUI ESTÁ A LÓGICA DOS ÍCONES ---
// Função auxiliar que retorna um ícone com base no nome da refeição
const getIconeRefeicao = (nome: string) => {
  const nomeLower = nome.toLowerCase();
  if (nomeLower.includes("café")) return <Coffee className="w-8 h-8 text-yellow-700" />;
  if (nomeLower.includes("almoço")) return <Utensils className="w-8 h-8 text-orange-600" />;
  if (nomeLower.includes("jantar")) return <Moon className="w-8 h-8 text-indigo-600" />;
  if (nomeLower.includes("lanche")) return <Apple className="w-8 h-8 text-red-500" />;
  if (nomeLower.includes("ceia")) return <Moon className="w-8 h-8 text-gray-500" />;
  return <Sun className="w-8 h-8 text-yellow-500" />; // Ícone padrão
};

const getUnidadeMedidaNome = (id: number) => {
    switch (id) {
      case 1: return "g";
      case 2: return "un";
      case 3: return "ml";
      default: return "";
    }
};

// --- O COMPONENTE ATUALIZADO ---
export function RefeicaoCard({ refeicao }: RefeicaoCardProps) {
  const [modalAberto, setModalAberto] = useState(false);
  // --- ADIÇÃO: Estado para controlar o envio do comentário ---
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleComentarioSubmit = async (comentario: string, imagem?: File) => {
    setIsSubmitting(true);
    console.log(`Comentário para a refeição ${refeicao.id}:`, { comentario, imagem });
    // Aqui você pode adicionar a lógica para enviar o comentário para a API
    // Exemplo: await fetch(...)
    
    // Simula um tempo de espera da API
    await new Promise(resolve => setTimeout(resolve, 1000)); 

    setIsSubmitting(false);
    setModalAberto(false); // Fecha o modal após o envio
  };

  return (
    <>
      <div className="bg-white p-6 rounded-lg shadow-md w-full h-full flex flex-col">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* O ícone é renderizado aqui */}
            <div className="bg-lime-100 p-4 rounded-full">
              {getIconeRefeicao(refeicao.nome)}
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{refeicao.nome}</p>
              <p className="text-md font-medium text-gray-500">{refeicao.horario.substring(0, 5)}</p>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-gray-200 flex-grow">
          <ul className="space-y-3">
            {refeicao.itens.map((item) => (
              <li key={item.id} className="flex justify-between items-center text-gray-700 text-lg">
                <span>{item.nome}</span>
                <span className="font-medium bg-gray-100 px-3 py-1 rounded-md">
                  {item.quantidade}{getUnidadeMedidaNome(item.unidadeMedida)}
                </span>
              </li>
            ))}
          </ul>
        </div>
        
        <div className="mt-6">
            <button 
              onClick={() => setModalAberto(true)}
              className="w-full flex items-center justify-center gap-2 text-sm font-semibold text-white bg-lime-600 hover:bg-lime-700 transition-colors py-2 rounded-lg"
            >
              <MessageSquarePlus className="w-5 h-5" />
              Adicionar Comentário
            </button>
        </div>
      </div>

      {/* --- AQUI ESTÁ A CORREÇÃO --- */}
      {/* Adicionando a propriedade 'isSubmitting' que estava faltando */}
      <ComentarioModal
        isOpen={modalAberto}
        onClose={() => setModalAberto(false)}
        onSubmit={handleComentarioSubmit}
        isSubmitting={isSubmitting}
      />
    </>
  );
}
