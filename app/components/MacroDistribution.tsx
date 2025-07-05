// app/components/MacroDistribution.tsx
"use client";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface MacroData {
  name: string;
  value: number;
}

interface MacroDistributionProps {
  data: MacroData[];
}

const COLORS = ['#fb923c', '#3b82f6', '#ef4444']; // Laranja, Azul, Vermelho

export function MacroDistribution({ data }: MacroDistributionProps) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-lg h-[400px]">
      <h3 className="text-xl font-bold text-gray-800 mb-4">Distribuição de Macros (g)</h3>
       <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={80}
            outerRadius={120}
            fill="#8884d8"
            paddingAngle={5}
            dataKey="value"
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
