import React from 'react';

interface TeamToastProps {
  message: string;
  type: "success" | "error" | "info";
  isVisible: boolean;
  onClose: () => void;
}

export const TeamToast: React.FC<TeamToastProps> = ({ 
  message, 
  type, 
  isVisible, 
  onClose 
}) => {
  if (!isVisible) return null;
  
  const bgColors = {
    success: 'bg-green-600 text-white',
    error: 'bg-red-600 text-white',
    info: 'bg-blue-600 text-white'
  };
  
  return (
    <div 
      className={`fixed bottom-4 right-4 px-6 py-3 rounded-lg shadow-lg ${bgColors[type]}`}
    >
      <p>{message}</p>
      <button 
        onClick={onClose}
        className="absolute top-1 right-1 text-white opacity-70 hover:opacity-100"
      >
        &times;
      </button>
    </div>
  );
};

export default TeamToast;
