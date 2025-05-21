import React from "react";

interface ProfileCardProps {
  name: string;
  age: number;
  weight: number;
  height: number;
  goal: string;
  photoUrl: string;
  sex?: string;
  birthDate?: string; // formato dd/mm/yyyy
  imc?: number; // Agora opcional
}

export function ProfileCard({
  name,
  age,
  weight,
  height,
  goal,
  photoUrl,
  sex,
  birthDate,
  imc,
}: ProfileCardProps) {
  return (
    <div className="mt-6 bg-white rounded-2xl shadow-lg p-6 md:p-8 flex flex-col md:flex-row items-center gap-8">
      <div className="w-32 h-32 md:w-48 md:h-48 rounded-full overflow-hidden shadow-md border-4 border-lime-500">
        <img
          src={photoUrl}
          alt={`Foto de ${name}`}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="flex-1 text-center md:text-left">
        <h2 className="text-2xl md:text-3xl font-semibold text-gray-800">
          {name}
        </h2>
        <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-4 text-sm text-gray-600">
          <p>
            <span className="font-medium text-gray-700">Idade:</span> {age} anos
          </p>
          <p>
            <span className="font-medium text-gray-700">Sexo:</span> {sex}
          </p>
          <p>
            <span className="font-medium text-gray-700">Nascimento:</span> {birthDate}
          </p>
          <p>
            <span className="font-medium text-gray-700">Peso:</span> {weight} kg
          </p>
          <p>
            <span className="font-medium text-gray-700">Altura:</span> {height} m
          </p>
          <p>
            <span className="font-medium text-gray-700">IMC:</span> {imc !== undefined ? imc.toFixed(1) : "—"}
          </p>
          <p className="md:col-span-3">
            <span className="font-medium text-gray-700">Objetivo:</span> {goal}
          </p>
        </div>
      </div>
    </div>
  );
}
