import React from "react";

interface HealthIndicator {
  title: string;
  value: string;
  color?: string;
}

interface HealthIndicatorsProps {
  indicators: HealthIndicator[];
}

export function HealthIndicators({ indicators }: HealthIndicatorsProps) {
  return (
    <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
      {indicators.map(({ title, value, color }, index) => (
        <div
          key={index}
          className={`p-4 rounded-xl shadow-md text-center font-semibold text-lg ${
            color || "bg-lime-500 text-white"
          }`}
        >
          <p>{title}</p>
          <p className="text-3xl">{value}</p>
        </div>
      ))}
    </div>
  );
}
