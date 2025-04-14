// app/home/page.tsx

"use client";

import Carousel from "./components/Carousel";
import LoginForm from "./components/LoginForm";

export default function LoginPage() {
  return (
    <div className="flex h-screen w-full flex-col md:flex-row">
      {/* Carrossel */}
      <Carousel />

      {/* Área de Login */}
      <LoginForm />
    </div>
  );
}
