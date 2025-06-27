"use client";

import { useState, useEffect } from "react";

// Função para decodificar o token JWT (INTACTA)
function decodeJWT(token: string): any | null {
  try {
    const payloadBase64 = token.split(".")[1];
    const payload = atob(payloadBase64);
    return JSON.parse(payload);
  } catch (e) {
    console.error("Erro ao decodificar token:", e);
    return null;
  }
}

// Interfaces para os dados da API
interface Nutricionista {
  id: number;
  usuarioId: number;
}
interface Paciente {
  usuarioId: number;
}

interface SchedulingFormProps {
  selectedDate: Date;
}

export function SchedulingForm({ selectedDate }: SchedulingFormProps) {
  // Estados do componente
  const [patients, setPatients] = useState<Paciente[]>([]);
  const [selectedPatient, setSelectedPatient] = useState("");
  const [time, setTime] = useState("14:00");
  const [observacoes, setObservacoes] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // --- LÓGICA DE BUSCA CORRIGIDA EM DUAS ETAPAS ---
  useEffect(() => {
    const fetchCorrectPatients = async () => {
      try {
        setIsLoading(true);
        // 1. Obter o ID do usuário logado a partir do token
        const token = localStorage.getItem("authToken");
        if (!token) {
          throw new Error("Token de autenticação não encontrado.");
        }
        const decodedToken = decodeJWT(token);
        const loggedInUsuarioId = decodedToken?.nameid;
        if (!loggedInUsuarioId) {
          throw new Error("ID do usuário não encontrado no token.");
        }

        // 2. Buscar TODOS os nutricionistas para encontrar o ID da entidade correto
        const nutricionistasResponse = await fetch("https://localhost:7058/api/v1/Nutricionista/buscar-nutricionistas");
        if (!nutricionistasResponse.ok) throw new Error("Falha ao buscar a lista de nutricionistas.");
        
        const nutricionistasResult = await nutricionistasResponse.json();
        if (!nutricionistasResult.sucesso) throw new Error("Erro na resposta da API de nutricionistas.");

        // 3. Encontrar o nutricionista que corresponde ao usuário logado
        const nutricionistaLogado = nutricionistasResult.data.find(
          (n: Nutricionista) => n.usuarioId === Number(loggedInUsuarioId)
        );
        if (!nutricionistaLogado) {
          throw new Error("Nutricionista correspondente ao usuário logado não encontrado.");
        }
        const nutricionistaEntityId = nutricionistaLogado.id; // Este é o ID correto (ex: 13)

        // 4. Finalmente, buscar os pacientes usando o ID CORRETO do nutricionista
        const pacientesResponse = await fetch(`https://localhost:7058/api/v1/Paciente/buscar-pacientes-por-nutricionista?nutricionistaId=${nutricionistaEntityId}`);
        if (!pacientesResponse.ok) throw new Error("Falha ao buscar os pacientes.");

        const pacientesResult = await pacientesResponse.json();
        if (pacientesResult.sucesso && Array.isArray(pacientesResult.data)) {
          setPatients(pacientesResult.data);
        } else {
          setPatients([]);
        }

      } catch (error) {
        console.error("Erro no processo de busca:", error);
        alert((error as Error).message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCorrectPatients();
  }, []); // Roda apenas uma vez quando o componente é montado

  const handleSubmit = async (e: React.FormEvent) => {
    // A lógica de submit permanece a mesma
    e.preventDefault();
    if (!selectedPatient) {
      alert("Por favor, selecione um paciente.");
      return;
    }

    const [hours, minutes] = time.split(":").map(Number);
    const dataHora = new Date(selectedDate);
    dataHora.setHours(hours, minutes, 0, 0);

    const payload = {
      id: 0,
      dataHora: dataHora.toISOString(),
      observacoes: observacoes,
      pacienteId: Number(selectedPatient),
    };

    try {
      const response = await fetch(
        "https://localhost:7058/api/v1/Consulta/inserir-consulta",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json-patch+json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (response.ok) {
        alert("Consulta agendada com sucesso!");
        setSelectedPatient("");
        setTime("14:00");
        setObservacoes("");
      } else {
        const errorData = await response.json();
        alert(`Erro ao agendar consulta: ${errorData.mensagens?.[0] || response.statusText}`);
      }
    } catch (error) {
      console.error("Erro de rede:", error);
      alert("Não foi possível conectar à API.");
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md h-full">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Agendar Consulta</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label
            htmlFor="patient"
            className="block text-sm font-medium text-gray-700"
          >
            Paciente
          </label>
          <select
            id="patient"
            value={selectedPatient}
            onChange={(e) => setSelectedPatient(e.target.value)}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-lime-500 focus:border-lime-500 sm:text-sm rounded-md"
            required
            disabled={isLoading}
          >
            <option value="" disabled>
              {isLoading ? "Carregando pacientes..." : (patients.length > 0 ? "Selecione um paciente" : "Nenhum paciente encontrado")}
            </option>
            {/* Exibindo o ID do usuário como texto, pois o nome não está disponível na resposta */}
            {patients.map((paciente) => (
              <option key={paciente.usuarioId} value={paciente.usuarioId}>
                ID do Paciente: {paciente.usuarioId}
              </option>
            ))}
          </select>
        </div>

        {/* O resto do formulário permanece o mesmo */}
        <div>
          <label
            htmlFor="date"
            className="block text-sm font-medium text-gray-700"
          >
            Data
          </label>
          <input
            type="text"
            id="date"
            value={selectedDate.toLocaleDateString("pt-BR")}
            readOnly
            className="mt-1 block w-full bg-gray-100 border-gray-300 rounded-md shadow-sm sm:text-sm p-2"
          />
        </div>
        <div>
          <label
            htmlFor="time"
            className="block text-sm font-medium text-gray-700"
          >
            Horário
          </label>
          <input
            type="time"
            id="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-lime-500 focus:border-lime-500 sm:text-sm p-2"
            required
          />
        </div>
        <div>
          <label
            htmlFor="observacoes"
            className="block text-sm font-medium text-gray-700"
          >
            Observações (opcional)
          </label>
          <textarea
            id="observacoes"
            value={observacoes}
            onChange={(e) => setObservacoes(e.target.value)}
            rows={3}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-lime-500 focus:border-lime-500 sm:text-sm p-2"
          />
        </div>
        <div className="pt-2">
          <button
            type="submit"
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-lime-600 hover:bg-lime-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-lime-500"
          >
            Confirmar Agendamento
          </button>
        </div>
      </form>
    </div>
  );
}