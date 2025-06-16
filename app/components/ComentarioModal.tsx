import { useState } from "react";
import { Camera } from "lucide-react";

interface ComentarioModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (comentario: string, imagem?: File) => void;
}

export function ComentarioModal({ isOpen, onClose, onSubmit }: ComentarioModalProps) {
  const [comentario, setComentario] = useState("");
  const [imagem, setImagem] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const handleImagemChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImagem(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleEnviar = () => {
    if (comentario.trim()) {
      onSubmit(comentario, imagem || undefined);
      setComentario("");
      setImagem(null);
      setPreview(null);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex justify-center items-center">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md relative">
        <h2 className="text-lg font-semibold mb-4 text-gray-800">Adicionar Comentário</h2>

        <textarea
          className="w-full h-28 p-2 border border-gray-300 rounded mb-4"
          value={comentario}
          onChange={(e) => setComentario(e.target.value)}
          placeholder="Escreva seu comentário aqui..."
        />

        {/* Upload estilizado */}
        <div className="mb-4">
          <label className="flex items-center gap-2 cursor-pointer text-lime-700 hover:text-lime-900 font-medium">
            <Camera className="w-5 h-5" />
            Upload
            <input
              type="file"
              accept="image/*"
              onChange={handleImagemChange}
              className="hidden"
            />
          </label>
        </div>

        {/* Preview da imagem */}
        {preview && (
          <img
            src={preview}
            alt="Preview"
            className="w-full h-40 object-cover rounded border mb-4"
          />
        )}

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300"
          >
            Cancelar
          </button>
          <button
            onClick={handleEnviar}
            className="bg-lime-600 text-white px-4 py-2 rounded hover:bg-lime-700"
          >
            Enviar
          </button>
        </div>
      </div>
    </div>
  );
}
