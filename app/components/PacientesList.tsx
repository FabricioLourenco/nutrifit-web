"use client";

// --- AQUI ESTÁ A CORREÇÃO ---
// 1. Atualizamos a interface para ser idêntica à da página principal
interface Paciente {
  id: string;
  nome: string;
  email: string;
  usuarioId: number; // Adicionamos o campo que faltava
}

// 2. A interface das props agora espera a lista de pacientes correta
interface PacientesListProps {
  pacientes: Paciente[];
  onPacienteSelect: (paciente: Paciente) => void;
  isLoading: boolean;
}

export function PacientesList({ pacientes, onPacienteSelect, isLoading }: PacientesListProps) {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Meus Pacientes</h2>
      
      {isLoading ? (
        <p className="text-gray-500">Carregando pacientes...</p>
      ) : (
        <ul className="space-y-3 max-h-[600px] overflow-y-auto">
          {pacientes.length > 0 ? (
            pacientes.map((paciente) => (
              <li
                key={paciente.id}
                onClick={() => onPacienteSelect(paciente)}
                className="cursor-pointer border p-3 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <p className="font-medium">{paciente.nome}</p>
                <p className="text-sm text-gray-500">{paciente.email}</p>
              </li>
            ))
          ) : (
            <p className="text-gray-500">Nenhum paciente encontrado.</p>
          )}
        </ul>
      )}
    </div>
  );
}