import React from 'react';

interface StatDotsProps {
  value: number;
  colorClass: string;
}

export const StatDots: React.FC<StatDotsProps> = ({ value, colorClass }) => {
  const normalizedValue = Math.min(5, Math.max(0, Math.floor(value)));
  
  return (
    <div className="flex">
      {Array(5).fill(0).map((_, i) => (
        <div 
          key={i} 
          className={`w-1.5 h-1.5 rounded-full mx-0.5 ${i < normalizedValue ? colorClass : 'bg-gray-300 dark:bg-gray-600'}`} 
        />
      ))}
    </div>
  );
};

export default StatDots;
