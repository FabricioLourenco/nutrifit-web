"use client";
import { useState } from "react";
import { XButtonHome } from "./button-home";
import { XCardHome } from "./card-home";
import { ComentarioModal } from "./ComentarioModal"; // Novo componente

interface FeaturedMenuCardProps {
  imageSrc: string;
  mealTime: string;
  menuItems: string[];
  calories: string;
  carbs: string;
  protein: string;
  weight: string;
}

export function FeaturedMenuCard({
  imageSrc,
  mealTime,
  menuItems,
  calories,
  carbs,
  protein,
  weight,
}: FeaturedMenuCardProps) {
  const [modalAberto, setModalAberto] = useState(false);

  const handleComentarioSubmit = (comentario: string) => {
    console.log("Comentário enviado:", comentario);
    // Aqui você pode salvar em estado, backend ou onde precisar.
  };

  return (
    <>
      <XCardHome className="mb-8 flex flex-col md:flex-row">
        <img
          src={imageSrc}
          alt={mealTime}
          className="w-full md:w-1/3 h-auto object-cover rounded-t-md md:rounded-l-md md:rounded-tr-none"
        />
        <div className="flex-1 p-4">
          <h2 className="text-xl font-semibold text-gray-800">{mealTime}</h2>
          <div className="text-sm text-gray-600 mt-2 flex flex-wrap gap-2">
            <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded">
              Cardápio
            </span>
            {menuItems.map((item, idx) => (
              <span key={idx} className="text-gray-500">
                {item}
                {idx < menuItems.length - 1 ? "," : ""}
              </span>
            ))}
          </div>
          <XButtonHome
            className="mt-4 bg-lime-500 hover:bg-lime-600 text-white"
            onClick={() => setModalAberto(true)}
          >
            Adicionar comentários
          </XButtonHome>
        </div>
        <div className="p-4 space-y-2 text-sm w-full md:w-1/4">
          <div className="bg-green-100 text-green-800 p-2 rounded">
            Calorias: {calories}
          </div>
          <div className="bg-yellow-100 text-yellow-800 p-2 rounded">
            Carboidratos: {carbs}
          </div>
          <div className="bg-orange-100 text-orange-800 p-2 rounded">
            Proteína: {protein}
          </div>
          <div className="bg-gray-100 text-gray-800 p-2 rounded">
            Peso: {weight}
          </div>
        </div>
      </XCardHome>

      {/* Modal de comentário */}
      <ComentarioModal
        isOpen={modalAberto}
        onClose={() => setModalAberto(false)}
        onSubmit={handleComentarioSubmit}
      />
    </>
  );
}
