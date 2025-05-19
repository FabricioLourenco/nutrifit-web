import React from "react";

interface TabsFilterProps {
  tabs: string[];
}

export function TabsFilter({ tabs }: TabsFilterProps) {
  return (
    <div className="flex flex-wrap gap-2 mb-8 mt-4 text-sm">
      {tabs.map((tab) => (
        <button
          key={tab}
          className="px-3 py-1 rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300"
        >
          {tab}
        </button>
      ))}
    </div>
  );
}
