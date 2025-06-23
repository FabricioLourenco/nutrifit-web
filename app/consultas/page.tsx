// app/consultas/page.tsx
"use client";

import { useState } from "react";
import Sidebar from "../components/Sidebar";
import { HeaderBar } from "../components/HeaderBar";
import { AppointmentCalendar } from "../components/AppointmentCalendar";
import { DailySchedule } from "../components/DailySchedule";
import { AppointmentModal } from "../components/AppointmentModal"; // Reutilizando nosso modal

// Dados iniciais de exemplo (consultas já marcadas)
const initialEvents = [
  { id: '1', title: 'Consulta - João da Silva', start: new Date() }
];

export default function ConsultasPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [events, setEvents] = useState(initialEvents);
  const [isModalOpen, setModalOpen] = useState(false);

  const handleSave = (title: string) => {
    const newEvent = {
      id: String(Date.now()),
      title,
      // Por simplicidade, adiciona sempre ao meio-dia. Pode ser melhorado no modal.
      start: new Date(selectedDate.setHours(12, 0, 0)),
    };
    setEvents([...events, newEvent]);
    setModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <Sidebar sidebarOpen={sidebarOpen} toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

      <div className="flex-1 p-4 md:p-8">
        <HeaderBar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

        <main>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-white p-4 rounded-lg shadow-md">
              <AppointmentCalendar 
                selectedDate={selectedDate}
                onDateChange={setSelectedDate}
              />
            </div>

            <div className="md:col-span-1">
              <DailySchedule 
                date={selectedDate}
                events={events}
                onAdd={() => setModalOpen(true)}
              />
            </div>
          </div>
        </main>
      </div>
      
      <AppointmentModal 
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
      />
    </div>
  );
}