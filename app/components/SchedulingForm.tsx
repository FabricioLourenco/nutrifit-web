// app/components/SchedulingForm.tsx
"use client";

import { useState, useEffect } from "react"; // Importamos o useEffect

// Interface para definir a estrutura de um paciente, vindo da API
interface Paciente {
  id: number;
  nome: string;
  // Adicione outros campos se a API retornar mais dados úteis
}

interface SchedulingFormProps {
  selectedDate: Date;
}

export function SchedulingForm({ selectedDate }: SchedulingFormProps) {
  // Estados do componente
  const [patients, setPatients] = useState<Paciente[]>([]); // Armazenará a lista de pacientes da API
  const [selectedPatient, setSelectedPatient] = useState("");
  const [time, setTime] = useState("14:00");
  const [observacoes, setObservacoes] = useState("");
  const [isLoading, setIsLoading] = useState(true); // Estado para controlar o loading

  // --- AQUI ESTÁ A LÓGICA DE BUSCA ---
  // O useEffect é executado uma vez, quando o componente é montado
  useEffect(() => {
    const fetchPatients = async () => {
      try {
        setIsLoading(true); // Inicia o loading
        const response = await fetch("https://localhost:7058/api/v1/Paciente/buscar-pacientes");
        
        if (!response.ok) {
          throw new Error("Falha ao buscar pacientes");
        }
        
        const result = await response.json();

        if (result.sucesso && Array.isArray(result.data)) {
          setPatients(result.data); // Armazena a lista de pacientes no estado
        }
      } catch (error) {
        console.error("Erro ao buscar pacientes:", error);
        alert("Não foi possível carregar a lista de pacientes.");
      } finally {
        setIsLoading(false); // Finaliza o loading, mesmo se der erro
      }
    };

    fetchPatients();
  }, []); // O array vazio [] garante que a busca seja feita apenas uma vez

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
            disabled={isLoading} // Desabilita o campo enquanto carrega
          >
            <option value="" disabled>
              {isLoading ? "Carregando pacientes..." : "Selecione um paciente"}
            </option>
            {/* Popula o dropdown com os pacientes da API */}
            {patients.map((paciente) => (
              <option key={paciente.id} value={paciente.id}>
                {paciente.nome}
              </option>
            ))}
          </select>
        </div>

        {/* O resto do formulário permanece igual */}
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