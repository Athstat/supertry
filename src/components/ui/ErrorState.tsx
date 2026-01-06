import React from "react";
import { useNavigate } from "react-router-dom";

interface ErrorStateProps {
  error: string;
  isFromWelcome?: boolean;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  error,
  isFromWelcome,
}) => {
  const navigate = useNavigate();

  const handleBack = () => {
    if (isFromWelcome) {
      navigate("/welcome");
    } else {
      navigate("/leagues");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-850 py-4 flex items-center justify-center">
      <div className="bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 p-6 rounded-lg max-w-md">
        <h2 className="text-xl font-bold mb-2">Error</h2>
        <p>{error}</p>
        <button
          onClick={handleBack}
          className="mt-4 bg-primary-600 text-white px-4 py-2 rounded-lg"
          tabIndex={0}
          aria-label={isFromWelcome ? "Back to welcome" : "Back to leagues"}
        >
          {isFromWelcome ? "Back to Welcome Screen" : "Back to Leagues"}
        </button>
      </div>
    </div>
  );
};
