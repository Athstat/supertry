import React from "react";
import { Plus } from "lucide-react";
import { Position } from "../../types/position";

interface EmptyPositionCardProps {
  position: Position;
  onClick: () => void;
}

export function EmptyPositionCard({
  position,
  onClick,
}: EmptyPositionCardProps) {
  return (
    <button
      onClick={onClick}
      className="w-full bg-gray-50 dark:bg-dark-800/40 rounded-lg p-3 hover:bg-gray-100 dark:hover:bg-dark-700 transition-all border-2 border-dashed border-gray-300 dark:border-dark-600 flex flex-col items-center justify-center min-h-[120px]"
    >
      <Plus size={24} className="text-gray-400 dark:text-gray-500 mb-2" />
      <div className="text-sm font-semibold text-gray-700 dark:text-gray-300">
        {position.name}
      </div>
    </button>
  );
}
