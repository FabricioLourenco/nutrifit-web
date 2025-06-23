// app/components/DailySchedule.tsx
"use client";

import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface ScheduleProps {
  date: Date;
  events: { id: string; title: string; start: Date }[];
  onAdd: () => void;
}

export function DailySchedule({ date, events, onAdd }: ScheduleProps) {
  const dayEvents = events.filter(
    (event) => format(event.start, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
  );

  return (
    <div className="bg-white p-6 rounded-lg shadow-md h-full">
      <h2 className="text-xl font-bold text-gray-700 capitalize">
        {format(date, "EEEE, dd 'de' MMMM", { locale: ptBR })}
      </h2>
      <div className="mt-4 border-t pt-4 space-y-3">
        {dayEvents.length > 0 ? (
          dayEvents.map((event) => (
            <div key={event.id} className="bg-lime-100 p-3 rounded-md">
              <p className="font-semibold text-lime-800">{event.title}</p>
              <p className="text-sm text-lime-600">{format(event.start, 'HH:mm')}</p>
            </div>
          ))
        ) : (
          <p className="text-gray-500">Nenhuma consulta agendada para este dia.</p>
        )}
      </div>
      <div className="mt-6 text-center">
        <button
          onClick={onAdd}
          className="bg-lime-600 hover:bg-lime-700 text-white font-semibold py-2 px-6 rounded-lg shadow"
        >
          Agendar neste dia
        </button>
      </div>
    </div>
  );
}