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
      className={`fixed bottom-20 gap-2 flex flex-row items-center justify-center right-4 px-6 py-3 rounded-lg shadow-lg ${bgColors[type]}`}
    >
      <p>{message}</p>
      <button 
        onClick={onClose}
        className="text-white opacity-70 hover:opacity-100"
      >
        <p className='text-2xl' >&times;</p>
      </button>
    </div>
  );
};

export default TeamToast;
