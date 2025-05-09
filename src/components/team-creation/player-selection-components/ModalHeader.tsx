import React from "react";
import { Position } from "../../../types/position";

interface ModalHeaderProps {
  selectedPosition: Position;
  onClose: () => void;
}

export const ModalHeader: React.FC<ModalHeaderProps> = ({
  selectedPosition,
  onClose,
}) => {
  return (
    <div className="flex justify-between items-center px-6 py-4 border-b dark:border-gray-700">
      <h2 className="text-xl font-bold dark:text-white">
        Select {selectedPosition?.name}
      </h2>
      <button
        onClick={onClose}
        className="rounded-full p-2 hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-gray-300 transition-colors"
        aria-label="Close"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </button>
    </div>
  );
};

export default ModalHeader;
