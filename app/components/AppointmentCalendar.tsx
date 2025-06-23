// app/components/AppointmentCalendar.tsx
"use client";
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import { ptBR } from 'date-fns/locale';

interface CalendarProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
}

export function AppointmentCalendar({ selectedDate, onDateChange }: CalendarProps) {
  // Estilos customizados para combinar com seu app
  const css = `
    .rdp {
      --rdp-cell-size: 45px;
      --rdp-caption-font-size: 1.25rem;
      --rdp-accent-color: #84cc16; /* Cor lime */
      --rdp-background-color: #bef264;
      border: 1px solid #e2e8f0;
      border-radius: 0.5rem;
      padding: 1rem;
    }
    .rdp-head_cell {
      font-weight: 600;
    }
  `;

  return (
    <>
      <style>{css}</style>
      <DayPicker
        mode="single"
        selected={selectedDate}
        onSelect={(date) => date && onDateChange(date)}
        locale={ptBR}
        className="w-full flex justify-center"
        showOutsideDays
      />
    </>
  );
}