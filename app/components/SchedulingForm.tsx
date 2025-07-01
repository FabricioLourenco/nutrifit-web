"use client";

import { useState, useEffect } from "react";

// Função para decodificar o token JWT
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

// Interfaces
interface Paciente {
  id: number;
  usuarioId: number;
  nome: string; 
}
interface Nutricionista {
  id: number;
  usuarioId: number;
}

interface SchedulingFormProps {
  selectedDate: Date;
}

export function SchedulingForm({ selectedDate }: SchedulingFormProps) {
  const [patients, setPatients] = useState<Paciente[]>([]);
  const [selectedPatient, setSelectedPatient] = useState("");
  const [time, setTime] = useState("14:00");
  const [observacoes, setObservacoes] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Lógica de busca dos pacientes
    const fetchCorrectPatients = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem("authToken");
        if (!token) throw new Error("Token de autenticação não encontrado.");
        
        const decodedToken = decodeJWT(token);
        const loggedInUsuarioId = decodedToken?.Id;
        if (!loggedInUsuarioId) throw new Error("ID do usuário não encontrado no token.");

        const nutricionistasResponse = await fetch("https://localhost:7058/api/v1/Nutricionista/buscar-nutricionistas");
        const nutricionistasResult = await nutricionistasResponse.json();
        const nutricionistaLogado = nutricionistasResult.data.find(
          (n: Nutricionista) => n.usuarioId === Number(loggedInUsuarioId)
        );
        
        if (nutricionistaLogado) {
          const nutricionistaEntityId = nutricionistaLogado.id;
          const pacientesResponse = await fetch(`https://localhost:7058/api/v1/Paciente/buscar-pacientes-por-nutricionista?nutricionistaId=${nutricionistaEntityId}`);
          const pacientesResult = await pacientesResponse.json();
          if (pacientesResult.sucesso) setPatients(pacientesResult.data);
        } else {
            throw new Error("Nutricionista correspondente ao usuário logado não encontrado.");
        }
      } catch (error) {
        console.error("Erro no processo de busca:", error);
        setPatients([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCorrectPatients();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPatient) {
      alert("Por favor, selecione um paciente.");
      return;
    }

    // --- AQUI ESTÁ A CORREÇÃO ---
    const [hours, minutes] = time.split(":").map(Number);
    // Criamos a data em UTC para evitar a conversão de fuso horário.
    const dataHora = new Date(Date.UTC(
      selectedDate.getFullYear(),
      selectedDate.getMonth(),
      selectedDate.getDate(),
      hours,
      minutes
    ));

    const pacienteSelecionado = patients.find(p => p.id === Number(selectedPatient));
    if (!pacienteSelecionado) {
        alert("Paciente selecionado não encontrado na lista.");
        return;
    }
    
    const payload = {
      id: 0,
      dataHora: dataHora.toISOString(), // Agora o ISO string estará com a hora correta
      observacoes: observacoes,
      pacienteId: Number(selectedPatient),
      nomePaciente: pacienteSelecionado.nome 
    };

    try {
      const response = await fetch("https://localhost:7058/api/v1/Consulta/inserir-consulta", {
        method: "POST",
        headers: { "Content-Type": "application/json-patch+json" },
        body: JSON.stringify(payload),
      });
      if (response.ok) {
        alert("Consulta agendada com sucesso!");
        window.location.reload(); 
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
          <label htmlFor="patient-schedule" className="block text-sm font-medium text-gray-700">Paciente</label>
          <select
            id="patient-schedule"
            value={selectedPatient}
            onChange={(e) => setSelectedPatient(e.target.value)}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-lime-500 focus:border-lime-500 sm:text-sm rounded-md"
            required
            disabled={isLoading}
          >
            <option value="" disabled>
              {isLoading ? "Carregando..." : (patients.length > 0 ? "Selecione" : "Nenhum paciente")}
            </option>
            {patients.map((paciente) => (
              <option key={paciente.id} value={paciente.id}>
                {paciente.nome}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="date" className="block text-sm font-medium text-gray-700">Data</label>
          <input type="text" id="date" value={selectedDate.toLocaleDateString("pt-BR")} readOnly className="mt-1 block w-full bg-gray-100 border-gray-300 rounded-md shadow-sm sm:text-sm p-2" />
        </div>
        <div>
          <label htmlFor="time" className="block text-sm font-medium text-gray-700">Horário</label>
          <input type="time" id="time" value={time} onChange={(e) => setTime(e.target.value)} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-lime-500 focus:border-lime-500 sm:text-sm p-2" required />
        </div>
        <div>
          <label htmlFor="observacoes" className="block text-sm font-medium text-gray-700">Observações</label>
          <textarea id="observacoes" value={observacoes} onChange={(e) => setObservacoes(e.target.value)} rows={3} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-lime-500 focus:border-lime-500 sm:text-sm p-2" />
        </div>
        <div className="pt-2">
          <button type="submit" className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-lime-600 hover:bg-lime-700">
            Confirmar Agendamento
          </button>
        </div>
      </form>
    </div>
  );
}