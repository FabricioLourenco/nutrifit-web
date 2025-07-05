"use client";

import { useState, useEffect } from 'react';
import { Check, X } from 'lucide-react';

interface EditableFieldProps {
  initialValue: string;
  onSave: (newValue: string) => void;
  inputType?: 'text' | 'number'; 
}

export const EditableField: React.FC<EditableFieldProps> = ({ initialValue, onSave }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  const handleSave = () => {
    onSave(value);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setValue(initialValue);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSave()}
          className="font-bold text-gray-800 bg-gray-100 rounded-md p-1 w-24 text-center border border-lime-400 focus:outline-none focus:ring-2 focus:ring-lime-500"
          autoFocus
        />
        <button onClick={handleSave} className="text-green-500 hover:text-green-700 p-1"><Check size={20} /></button>
        <button onClick={handleCancel} className="text-red-500 hover:text-red-700 p-1"><X size={20} /></button>
      </div>
    );
  }

  return (
    <span 
      className="font-bold text-gray-800 cursor-pointer hover:bg-gray-100 p-1 rounded-md transition-all duration-200"
      onClick={() => setIsEditing(true)}
      title="Clique para editar"
    >
      {value || "..."}
    </span>
  );
};