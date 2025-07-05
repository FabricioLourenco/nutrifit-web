"use client";

import { useState, useEffect } from "react";

// --- Interfaces ---
interface Alimento { id: number; nome: string; }
interface ItemRefeicao { id?: number; tempId: string; alimentoId: number | ""; quantidade: number | ""; unidadeMedida: number; }
interface Refeicao { id?: number; tempId: string; nome: string; horario: string; itens: ItemRefeicao[]; }
interface PlanoAlimentar { id?: number; observacoesGerais: string; refeicoes: Refeicao[]; }

// --- Componente ItemForm ---
function ItemForm({ item, alimentos, onChange, onRemove }: { item: ItemRefeicao, alimentos: Alimento[], onChange: (item: ItemRefeicao) => void, onRemove: () => void }) {
    return (
        <div className="flex items-end gap-2 p-2 border rounded-md bg-gray-50">
          <div className="flex-1">
            <label className="text-xs font-medium">Alimento</label>
            <select value={item.alimentoId} onChange={(e) => onChange({ ...item, alimentoId: Number(e.target.value) })} className="w-full border border-gray-300 rounded px-2 py-1 text-sm" required>
              <option value="" disabled>Selecione</option>
              {alimentos.map(alimento => (<option key={alimento.id} value={alimento.id}>{alimento.nome}</option>))}
            </select>
          </div>
          <div className="w-24">
            <label className="text-xs font-medium">Qtd.</label>
            <input type="number" value={item.quantidade} onChange={(e) => onChange({ ...item, quantidade: Number(e.target.value) })} className="w-full border border-gray-300 rounded px-2 py-1 text-sm" required />
          </div>
          <div className="w-28">
            <label className="text-xs font-medium">Unidade</label>
            <select value={item.unidadeMedida} onChange={(e) => onChange({ ...item, unidadeMedida: Number(e.target.value) })} className="w-full border border-gray-300 rounded px-2 py-1 text-sm">
              <option value={1}>Gramas (g)</option>
              <option value={2}>Unidade(s)</option>
              <option value={3}>Mililitros (ml)</option>
            </select>
          </div>
          <button type="button" onClick={onRemove} className="bg-red-500 text-white rounded px-2 py-1 text-sm h-8">-</button>
        </div>
      );
}

// --- Componente RefeicaoForm ---
function RefeicaoForm({ refeicao, alimentos, onChange, onRemove }: { refeicao: Refeicao, alimentos: Alimento[], onChange: (refeicao: Refeicao) => void, onRemove: () => void }) {
    const handleItemChange = (itemAtualizado: ItemRefeicao) => {
        const novosItens = refeicao.itens.map(item => item.tempId === itemAtualizado.tempId ? itemAtualizado : item);
        onChange({ ...refeicao, itens: novosItens });
      };
      const adicionarItem = () => {
        const novoItem: ItemRefeicao = { tempId: Date.now().toString(), alimentoId: "", quantidade: "", unidadeMedida: 1 };
        onChange({ ...refeicao, itens: [...refeicao.itens, novoItem] });
      };
      const removerItem = (tempId: string) => {
        const novosItens = refeicao.itens.filter(item => item.tempId !== tempId);
        onChange({ ...refeicao, itens: novosItens });
      };
      return (
        <div className="p-4 border-2 border-dashed rounded-lg space-y-3">
          <div className="flex items-end gap-4">
            <div className="flex-1">
              <label className="font-medium">Nome da Refeição</label>
              <select value={refeicao.nome} onChange={(e) => onChange({ ...refeicao, nome: e.target.value })} className="w-full border border-gray-300 rounded px-3 py-2 mt-1" required>
                <option value="" disabled>Selecione um tipo</option>
                <option value="Café da Manhã">Café da Manhã</option>
                <option value="Lanche da Manhã">Lanche da Manhã</option>
                <option value="Almoço">Almoço</option>
                <option value="Lanche da Tarde">Lanche da Tarde</option>
                <option value="Jantar">Jantar</option>
                <option value="Ceia">Ceia</option>
              </select>
            </div>
            <div className="w-32">
              <label className="font-medium">Horário</label>
              <input type="time" value={refeicao.horario} onChange={(e) => onChange({ ...refeicao, horario: e.target.value })} className="w-full border border-gray-300 rounded px-3 py-2 mt-1" required />
            </div>
            <button type="button" onClick={onRemove} className="bg-red-600 text-white rounded px-3 py-2 h-12">Remover Refeição</button>
          </div>
          <div className="space-y-2 pl-4 border-l-2">
            <h4 className="font-medium text-sm">Itens da Refeição</h4>
            {refeicao.itens.map(item => (<ItemForm key={item.tempId} item={item} alimentos={alimentos} onChange={handleItemChange} onRemove={() => removerItem(item.tempId)} />))}
            <button type="button" onClick={adicionarItem} className="text-sm bg-lime-500 hover:bg-lime-600 text-white px-3 py-1 rounded-md">+ Adicionar Item</button>
          </div>
        </div>
      );
}

// --- Componente Principal do Formulário ---
interface PlanoAlimentarFormProps {
  pacienteId: string;
  onSave: (plano: any) => void;
  initialData?: any;
}

export default function PlanoAlimentarForm({ pacienteId, onSave, initialData }: PlanoAlimentarFormProps) {
  const [alimentos, setAlimentos] = useState<Alimento[]>([]);
  const [plano, setPlano] = useState<PlanoAlimentar>({ observacoesGerais: "", refeicoes: [] });

  useEffect(() => {
    const fetchAlimentos = async () => {
        try {
            const response = await fetch("https://localhost:7058/api/v1/Alimento/buscar-alimentos");
            if(response.ok) {
              const result = await response.json();
              if(result.sucesso) setAlimentos(result.data);
            }
          } catch (error) { console.error("Erro ao buscar alimentos", error); }
    };
    fetchAlimentos();
  }, []);

  useEffect(() => {
    if (initialData && initialData.id) {
      setPlano({
        id: initialData.id,
        observacoesGerais: initialData.observacoesGerais,
        refeicoes: initialData.refeicoes.map((r: any) => ({
          ...r,
          tempId: r.id?.toString() || `new_${Date.now()}_${Math.random()}`,
          horario: r.horario ? r.horario.substring(0, 5) : "00:00",
          itens: r.itens.map((i: any) => ({ ...i, tempId: i.id?.toString() || `new_${Date.now()}_${Math.random()}` }))
        }))
      });
    } else {
      setPlano({ observacoesGerais: "", refeicoes: [] });
    }
  }, [initialData]);

  const handleRefeicaoChange = (refeicaoAtualizada: Refeicao) => {
    const novasRefeicoes = plano.refeicoes.map(r => r.tempId === refeicaoAtualizada.tempId ? refeicaoAtualizada : r);
    setPlano({ ...plano, refeicoes: novasRefeicoes });
  };
  const adicionarRefeicao = () => {
    const novaRefeicao: Refeicao = { tempId: `new_${Date.now()}`, nome: "Café da Manhã", horario: "08:00", itens: [] };
    setPlano({ ...plano, refeicoes: [...plano.refeicoes, novaRefeicao] });
  };
  const removerRefeicao = (tempId: string) => {
    const novasRefeicoes = plano.refeicoes.filter(r => r.tempId !== tempId);
    setPlano({ ...plano, refeicoes: novasRefeicoes });
  };

  const handleSaveClick = () => {
    // ...validações...
    const payload = {
      id: plano.id || 0,
      observacoesGerais: plano.observacoesGerais,
      dataInicio: new Date().toISOString(),
      pacienteId: Number(pacienteId),
      refeicoes: plano.refeicoes.map(refeicao => ({
        id: refeicao.id || 0,
        nome: refeicao.nome,
        horario: `${refeicao.horario}:00`,
        itens: refeicao.itens.map(item => ({
          id: item.id || 0,
          quantidade: Number(item.quantidade),
          unidadeMedida: item.unidadeMedida,
          alimentoId: Number(item.alimentoId)
        }))
      }))
    };
    onSave(payload);
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">{initialData ? `Editando Plano Alimentar` : "Criando Novo Plano"}</h3>
      <div>
        <label className="font-medium">Observações Gerais da Dieta</label>
        <textarea value={plano.observacoesGerais} onChange={(e) => setPlano({ ...plano, observacoesGerais: e.target.value })} className="w-full border border-gray-300 rounded px-3 py-2 mt-1" rows={3} placeholder="Ex: Beber 2L de água por dia, evitar frituras..." />
      </div>
      <div className="space-y-4">
        {plano.refeicoes.map(refeicao => (<RefeicaoForm key={refeicao.tempId} refeicao={refeicao} alimentos={alimentos} onChange={handleRefeicaoChange} onRemove={() => removerRefeicao(refeicao.tempId)} />))}
      </div>
      <div className="flex justify-between items-center">
        <button type="button" onClick={adicionarRefeicao} className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg shadow">+ Adicionar Refeição</button>
        <button type="button" onClick={handleSaveClick} className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg">Salvar Plano</button>
      </div>
    </div>
  );
}