import React from 'react';

/**
 * Helper function to render stat dots for player attributes
 * 
 * @param value The value to render (0-5)
 * @param colorClass CSS class for the filled dots
 * @returns React component with dots representing the value
 */
export const renderStatDots = (value: number, colorClass: string) => {
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

export default renderStatDots;
