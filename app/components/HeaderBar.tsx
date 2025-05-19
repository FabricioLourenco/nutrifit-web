import { Menu, Search } from "lucide-react";
import { XInputHome } from "./input-home";
import { XButtonHome } from "./button-home";

interface HeaderBarProps {
  toggleSidebar: () => void;
}

export function HeaderBar({ toggleSidebar }: HeaderBarProps) {
  return (
    <div className="flex justify-between items-center mb-6">
      <div className="flex items-center gap-2">
        <button
          className="text-gray-600 hover:text-gray-800"
          onClick={toggleSidebar}
        >
          <Menu className="w-6 h-6" />
        </button>
        <h1 className="text-2xl font-bold text-gray-800">Minha Dieta</h1>
      </div>

      <div className="flex items-center gap-2">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 text-gray-400 w-4 h-4" />
          <XInputHome
            placeholder="Search menu"
            className="pl-8 w-48 md:w-64"
          />
        </div>
        <XButtonHome className="bg-lime-500 hover:bg-lime-600 text-white">
          Buscar
        </XButtonHome>
      </div>
    </div>
  );
}
