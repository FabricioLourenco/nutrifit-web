import { Menu, Search } from "lucide-react";
import { XInputHome } from "./input-home";
import { XButtonHome } from "./button-home";
import Link from "next/link";

interface HeaderBarProps {
  toggleSidebar: () => void;
}

export function HeaderBar({ toggleSidebar }: HeaderBarProps) {
  return (
    <div className="flex justify-between items-center mb-6 bg-lime-500 p-4 rounded-lg shadow-md">
      <div className="flex items-center gap-2">
        <button
          className="text-gray-700 hover:text-gray-800"
          onClick={toggleSidebar}
        >
          <Menu className="w-6 h-8" strokeWidth={3} color="white"/>
        </button>
      </div>
      <div className="absolute left-1/2 transform -translate-x-1/2 text-white font-bold text-2xl">
        <h1>NUTRIFIT</h1>
      </div>

      <div className="flex items-center gap-4">
        <Link href="/home" className="text-white hover:text-lime-600 font-bold">
          Home
        </Link>
        <Link
          href="/perfil"
          className="text-white hover:text-lime-600 font-bold"
        >
          Perfil
        </Link>
        <Link
          href="/substituicao"
          className="text-white hover:text-lime-600 font-bold"
        >
          Substituição
        </Link>
      </div>
    </div>
  );
}
