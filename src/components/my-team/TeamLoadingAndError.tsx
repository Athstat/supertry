import React from "react";
import { Loader, ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface TeamLoadingProps {
  isFullScreen?: boolean;
}

export const TeamLoading: React.FC<TeamLoadingProps> = ({
  isFullScreen = true,
}) => {
  return (
    <div
      className={`flex items-center justify-center ${
        isFullScreen ? "h-screen" : "h-64"
      }`}
    >
      <Loader className="w-8 h-8 text-primary-500 animate-spin" />
    </div>
  );
};

interface TeamErrorProps {
  error: string;
  onBack?: () => void;
}

export const TeamError: React.FC<TeamErrorProps> = ({ error, onBack }) => {
  const navigate = useNavigate();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate("/my-teams");
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 p-4 rounded-lg">
        {error || "Team not found"}
      </div>
      <button
        onClick={handleBack}
        className="mt-4 flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-primary-700 dark:hover:dark:text-primary-500"
      >
        <ChevronLeft size={20} />
        <span>Back to My Teams</span>
      </button>
    </div>
  );
};
