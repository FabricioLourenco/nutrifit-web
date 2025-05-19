// components/TabelaSubstituicoes.tsx
"use client";

interface Substituicao {
  id: number;
  alimento: string;
  substituto: string;
  gramagem: number;
  calorias: number;
}

interface Props {
  substituicoes: Substituicao[];
}

export default function TabelaSubstituicoes({ substituicoes }: Props) {
  if (substituicoes.length === 0) {
    return <p className="text-center text-gray-500">Nenhuma substituição encontrada.</p>;
  }

  return (
    <table className="w-full table-auto border-collapse border border-gray-300">
      <thead>
        <tr className="bg-gray-100">
          <th className="border border-gray-300 px-4 py-2">Substituto</th>
          <th className="border border-gray-300 px-4 py-2">Gramagem (g)</th>
          <th className="border border-gray-300 px-4 py-2">Calorias</th>
        </tr>
      </thead>
      <tbody>
        {substituicoes.map((item) => (
          <tr key={item.id}>
            <td className="border border-gray-300 px-4 py-2">{item.substituto}</td>
            <td className="border border-gray-300 px-4 py-2">{item.gramagem}</td>
            <td className="border border-gray-300 px-4 py-2">{item.calorias}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
