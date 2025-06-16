"use client";

interface PacienteCardProps {
  nome: string;
  onVerDieta?: () => void;
  onEditar?: () => void;
  onAcompanhamento?: () => void;
}

export function PacienteCard({
  nome,
  onVerDieta,
  onEditar,
  onAcompanhamento,
}: PacienteCardProps) {
  return (
    <div className="p-4 border border-gray-300 rounded-lg shadow-sm bg-white flex flex-col md:flex-row justify-between items-center gap-4">
      <p className="text-gray-800 font-medium text-lg">{nome}</p>
      <div className="flex gap-2">
        <button
          onClick={onVerDieta}
          className="bg-lime-500 hover:bg-lime-600 text-white px-4 py-2 rounded-md text-sm"
        >
          Ver Dieta
        </button>
        <button
          onClick={onEditar}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm"
        >
          Editar
        </button>
        <button
          onClick={onAcompanhamento}
          className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-md text-sm"
        >
          Acompanhamento
        </button>
      </div>
    </div>
  );
}
