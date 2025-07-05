import React from 'react';

// --- Interface para os props ---
interface ResumoMacrosProps {
  macros: {
    calorias: number;
    proteinas: number;
    carboidratos: number;
    gorduras: number;
  };
}

export const ResumoMacrosCard: React.FC<ResumoMacrosProps> = ({ macros }) => {
  // Função para formatar os números
  const formatNumber = (num: number) => Math.round(num);

  return (
    <div className="bg-white p-8 rounded-lg shadow-md w-full md:w-69 flex-shrink-0 min-h-74">
      <h3 className="text-lg font-bold text-gray-800 mb-3 border-b pb-2">Resumo da Refeição</h3>
      <div className="space-y-2 text-gray-600">
        <div className="flex justify-between">
          <span className="font-semibold">Calorias:</span>
          <span className="font-mono text-lime-700 font-bold">{formatNumber(macros.calorias)} kcal</span>
        </div>
        <div className="flex justify-between">
          <span className="font-semibold">Proteínas:</span>
          <span className="font-mono">{formatNumber(macros.proteinas)} g</span>
        </div>
        <div className="flex justify-between">
          <span className="font-semibold">Carboidratos:</span>
          <span className="font-mono">{formatNumber(macros.carboidratos)} g</span>
        </div>
        <div className="flex justify-between">
          <span className="font-semibold">Gorduras:</span>
          <span className="font-mono">{formatNumber(macros.gorduras)} g</span>
        </div>
      </div>
    </div>
  );
};