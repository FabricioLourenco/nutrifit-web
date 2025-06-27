"use client";

// Importações necessárias, incluindo useEffect
import { useState, useEffect } from "react"; 
import Sidebar from "../components/Sidebar";
import { HeaderBar } from "../components/HeaderBar";
import { AppointmentCalendar } from "../components/AppointmentCalendar";
import { SchedulingForm } from "../components/SchedulingForm"; // Importando o formulário novamente
import { AppointmentModal } from "../components/AppointmentModal"; 

const initialEvents = [
  { id: "1", title: "Consulta - João da Silva", start: new Date() },
];

export default function ConsultasPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // Solução para o erro de hidratação
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  useEffect(() => {
    setSelectedDate(new Date());
  }, []);

  const [events, setEvents] = useState(initialEvents);
  const [isModalOpen, setModalOpen] = useState(false);

  const handleSave = (title: string) => {
    if (!selectedDate) return; 

    const newEvent = {
      id: String(Date.now()),
      title,
      start: new Date(selectedDate.setHours(12, 0, 0)),
    };
    setEvents([...events, newEvent]);
    setModalOpen(false);
  };

  // Enquanto a data não é definida no cliente, mostramos um loading
  if (!selectedDate) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p>Carregando agenda...</p>
      </div>
    );
  }

  // O JSX completo, com o SchedulingForm de volta
  return (
    <div className="min-h-screen bg-gray-100 flex">
      <Sidebar
        sidebarOpen={sidebarOpen}
        toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
      />

      <div className="flex-1 p-4 md:p-8">
        <HeaderBar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

        <main>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            {/* Coluna do Calendário */}
            <div className="lg:col-span-2 bg-white p-4 rounded-xl shadow-lg flex justify-center items-center">
              <AppointmentCalendar
                selectedDate={selectedDate}
                onDateChange={setSelectedDate}
              />
            </div>

            {/* Coluna do Formulário de Agendamento (RESTAURADA) */}
            <div className="lg:col-span-1">
              <SchedulingForm selectedDate={selectedDate} />
            </div>
          </div>
        </main>
      </div>

      {/* O AppointmentModal foi mantido, mas não está sendo chamado. Você pode removê-lo se o SchedulingForm for suficiente */}
      <AppointmentModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
      />
    </div>
  );
}