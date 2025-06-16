interface Dieta {
  id: string;
  descricao: string;
  tipo: string;
  alimentos: string;
}

interface Props {
  dieta: Dieta;
  onEdit: () => void;
  onDelete: () => void;
}

export function DietaCard({ dieta, onEdit, onDelete }: Props) {
  return (
    <div className="border p-4 rounded-lg shadow-sm bg-gray-50 mb-3">
      <h3 className="text-lg font-semibold">{dieta.descricao} - {dieta.tipo}</h3>
      <p className="text-sm text-gray-600">{dieta.alimentos}</p>
      <div className="mt-2 space-x-2">
        <button onClick={onEdit} className="text-blue-600 hover:underline">Editar</button>
        <button onClick={onDelete} className="text-red-600 hover:underline">Excluir</button>
      </div>
    </div>
  );
}
