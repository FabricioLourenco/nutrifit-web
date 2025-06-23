// app/components/PendingRequests.tsx
"use client";

import { useEffect } from 'react';

// Dados de exemplo
const pendingRequests = [
  { id: 'req1', title: 'Maria Oliveira' },
  { id: 'req2', title: 'Carlos Souza' },
  { id: 'req3', title: 'Ana Beatriz' },
];

export function PendingRequests() {
  useEffect(() => {
    // Usamos 'require' aqui para garantir que o código só seja executado no lado do cliente,
    // onde o 'document' está disponível.
    const { Draggable } = require('@fullcalendar/interaction');
    const containerEl = document.getElementById('pending-requests-container');
    
    if (containerEl) {
      new Draggable(containerEl, {
        itemSelector: '.fc-event-draggable',
        // CORREÇÃO: Adicionamos o tipo HTMLElement ao parâmetro eventEl
        eventData: function(eventEl: HTMLElement) {
          return {
            title: eventEl.innerText,
            duration: '01:00' // Define a duração padrão da consulta para 1h
          };
        }
      });
    }
  }, []);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4 text-gray-700">Solicitações Pendentes</h2>
      <div id="pending-requests-container" className="space-y-3">
        {pendingRequests.map(req => (
          // A classe foi alterada para corresponder ao itemSelector
          <div
            key={req.id}
            className="fc-event-draggable bg-lime-100 border border-lime-300 text-lime-800 p-3 rounded-md cursor-grab"
          >
            {req.title}
          </div>
        ))}
        {pendingRequests.length === 0 && (
            <p className="text-sm text-gray-500">Nenhuma solicitação no momento.</p>
        )}
      </div>
    </div>
  );
}