"use client";

import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css"; // Importa o CSS base da estrutura
import { ptBR } from "date-fns/locale";

interface CalendarProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
}

export function AppointmentCalendar({
  selectedDate,
  onDateChange,
}: CalendarProps) {
  // O componente agora está 100% limpo, sem nenhuma customização de estilo.
  // Ele apenas renderiza o calendário, que pegará os estilos do globals.css
  return (
    <DayPicker
        mode="single"
        navLayout="around"
        selected={selectedDate}
        onSelect={(date) => date && onDateChange(date)}
        locale={ptBR}
        showOutsideDays
        numberOfMonths={1} pagedNavigation
      />
  );
}