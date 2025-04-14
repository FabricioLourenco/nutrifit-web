"use client";

import Carousel from "../components/Carousel";  // Importando o carrossel
import SignupForm from "../components/SignupForm";  // Formulário de inscrição

export default function SignupPage() {
  return (
    <div className="flex h-screen w-full flex-col md:flex-row">
      {/* Carrossel */}
      <Carousel />

      {/* Área de Inscrição */}
      <SignupForm />
    </div>
  );
}
