"use client";
import { useState } from "react";
import { XCardHome } from "../components/card-home";
import { XButtonHome } from "../components/button-home";
import { XInputHome } from "../components/input-home";
import Sidebar from "../components/Sidebar";
import { Menu, Search } from "lucide-react";

import {FeaturedMenuCard} from "../components/FeaturedMenuCard"; // Novo componente para o card de destaque
import {MealCard} from "../components/MealCard"; // Novo componente para o card de refeição
import {HeaderBar} from "../components/HeaderBar"; // Novo componente para o header
import { TabsFilter } from "../components/TabsFilter";

export default function HealthyMenu() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Main Content */}
      <div className="flex-1 p-4 md:p-8">
        {/* Header */}
        <HeaderBar toggleSidebar={toggleSidebar} />

        {/* Featured Menu */}
        <FeaturedMenuCard
          imageSrc="https://img.freepik.com/fotos-premium/servindo-salada-e-peixe-frito-com-arroz-cozido-para-alimentos-saudaveis_38812-75.jpg"
          mealTime="Almoço - 12:00H"
          menuItems={["Arroz", "Feijão", "Salada", "Peixe"]}
          calories="450 kcal"
          carbs="40 g"
          protein="35 g"
          weight="120 g"
        />

        {/* Tabs Filter */}
        <TabsFilter tabs={["Todos", "Café da manhã", "Lanches", "Almoço", "Jantar"]} />

        {/* Menu List */}
        <div className="space-y-4">
          {[
            {
              title: "Avocado com ovo",
              tag: "Café da manhã",
              difficulty: "Fácil",
              info: "320 kcal · 12g carbs · 14g proteína · 8g peso",
              image: "https://www.receiteria.com.br/wp-content/uploads/avocado-toast-com-ovo-2.jpg",
            },
            {
              title: "Sanduíche de frango e requeijão",
              tag: "Lanche",
              difficulty: "Fácil",
              info: "420 kcal · 45g carbs · 28g proteína · 10g peso",
              image: "https://receitatodahora.com.br/wp-content/uploads/2022/07/pate-de-frango-1200x675.jpg",
            },
          ].map((item) => (
            <MealCard
              key={item.title}
              image={item.image}
              title={item.title}
              tag={item.tag}
              difficulty={item.difficulty}
              info={item.info}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
