"use client";

import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

// --- ATUALIZAÇÃO: Adicionando 'nomePaciente' à interface ---
interface Consulta {
  id: number;
  dataHora: string;
  observacoes: string;
  pacienteId: number;
  nomePaciente: string; // Adicionamos o campo que agora vem da API
}

interface ConsultationListProps {
  title: string;
  consultations: Consulta[];
  isLoading: boolean;
}

export function ConsultationList({ title, consultations, isLoading }: ConsultationListProps) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-lg">
      <h3 className="text-xl font-bold text-gray-800 mb-4">{title}</h3>
      <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
        {isLoading ? (
          <p className="text-gray-500">Carregando...</p>
        ) : consultations.length > 0 ? (
          consultations.map((consulta) => (
            <div key={consulta.id} className="p-4 rounded-lg bg-gray-50 border border-gray-200">
              <div className="flex justify-between items-center">
                {/* --- ATUALIZAÇÃO: Exibindo o nome do paciente --- */}
                <p className="font-semibold text-gray-700">
                  Paciente: {consulta.nomePaciente}
                </p>
                <p className="text-sm font-medium text-lime-600">
                  {format(new Date(consulta.dataHora), "dd/MM/yyyy 'às' HH:mm", {
                    locale: ptBR,
                  })}
                </p>
              </div>
              <p className="mt-2 text-sm text-gray-600">
                <span className="font-medium">Observações:</span> {consulta.observacoes}
              </p>
            </div>
          ))
        ) : (
          <p className="text-gray-500">Nenhuma consulta encontrada.</p>
        )}
      </div>
    </div>
  );
}