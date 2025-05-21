import React from "react";
import Link from "next/link";
import {
  UtensilsCrossed,
  ListOrdered,
  Download,
  CalendarCheck,
} from "lucide-react";

export function ProfileActions() {
  return (
    <div className="mt-10 flex flex-col sm:flex-row gap-4">
      <Link href="/home" passHref>
        <button className="flex items-center justify-center gap-2 bg-lime-500 text-white px-6 py-3 rounded-full shadow hover:bg-lime-600 transition">
          <UtensilsCrossed className="w-5 h-5" />
          Minha Dieta
        </button>
      </Link>

      <Link href="/substituicao" passHref>
        <button className="flex items-center justify-center gap-2 bg-lime-500 text-white px-6 py-3 rounded-full shadow hover:bg-lime-600 transition">
          <ListOrdered className="w-5 h-5" />
          Tabela de Substituição
        </button>
      </Link>

      <Link href="/download-dieta" passHref>
        <button className="flex items-center justify-center gap-2 bg-lime-500 text-white px-6 py-3 rounded-full shadow hover:bg-lime-600 transition">
          <Download className="w-5 h-5" />
          Baixar Dieta
        </button>
      </Link>

      <Link href="/marcar-consulta" passHref>
        <button className="flex items-center justify-center gap-2 bg-lime-500 text-white px-6 py-3 rounded-full shadow hover:bg-lime-600 transition">
          <CalendarCheck className="w-5 h-5" />
          Marcar Consulta
        </button>
      </Link>
    </div>
  );
}
