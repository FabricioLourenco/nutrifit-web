// app/marcar-consulta/page.tsx
"use client";

import { useState } from "react";
import Sidebar from "../components/Sidebar";
import { HeaderBar } from "../components/HeaderBar";

function RequestAppointmentForm() {
    const [notes, setNotes] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Lógica para enviar a notificação/solicitação para o backend
        alert("Sua solicitação de consulta foi enviada ao nutricionista. Aguarde a confirmação!");
        setNotes("");
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
                    Preferências ou observações (opcional)
                </label>
                <textarea
                    id="notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={4}
                    className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-lime-500"
                    placeholder="Ex: 'Gostaria de uma consulta no período da manhã' ou 'Preciso de um encaixe urgente'."
                />
            </div>
            <button
                type="submit"
                className="w-full bg-lime-600 hover:bg-lime-700 text-white font-semibold py-3 px-4 rounded-lg shadow"
            >
                Enviar Solicitação de Agendamento
            </button>
        </form>
    );
}


export default function MarcarConsultaPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <Sidebar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

      <div className="flex-1 p-4 md:p-8">
        <HeaderBar toggleSidebar={toggleSidebar} />

        <main className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold mb-2 text-gray-800">Marcar Nova Consulta</h1>
          <p className="text-gray-600 mb-6">
            Envie uma solicitação de agendamento para o seu nutricionista. Você receberá uma notificação assim que a consulta for confirmada no calendário.
          </p>
          
          <div className="bg-white p-8 rounded-lg shadow-md">
            <RequestAppointmentForm />
          </div>
        </main>
      </div>
    </div>
  );
}