"use client";

import { useState } from "react";
import Sidebar from "../components/Sidebar";
import { HeaderBar } from "../components/HeaderBar";
import { ProfileCard } from "../components/ProfileCard";
import { HealthIndicators } from "../components/HealthIndicators";
import { ProfileActions } from "../components/ProfileActions";

export default function PerfilUser() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const indicators = [
    { title: "Progresso", value: "80%" },
    { title: "Adesão", value: "95%" },
    { title: "Última Consulta", value: "23/04/2025" },
    { title: "Refeições", value: "5 por dia" },
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Main Content */}
      <div className="flex-1 p-4 md:p-8">
        {/* HeaderBar */}
        <HeaderBar toggleSidebar={toggleSidebar} />

        {/* Profile Card */}
        <ProfileCard
          name="João Silva"
          age={29}
          weight={70}
          height={1.75}
          goal="Perda de peso"
          photoUrl="https://miro.medium.com/v2/resize:fit:1200/0*XjrJ7-zq7u0D1SSK.jpg"
        />

        {/* Health Indicators */}
        <HealthIndicators indicators={indicators} />

        {/* Actions with navigation links */}
        <ProfileActions />
      </div>
    </div>
  );
}
