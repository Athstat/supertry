import React from "react";
import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface TeamCreationHeaderProps {
  title: string;
  subTitle?: string;
}

export const TeamCreationHeader: React.FC<TeamCreationHeaderProps> = ({
  title,
  subTitle = "Select 5 players to build your dream rugby team",
}) => {
  const navigate = useNavigate();

  const handleBackClick = () => {
    navigate("/leagues");
  };

  return (
    <>
      {/* Back Button */}
      <button
        onClick={handleBackClick}
        className="flex items-center mb-4 text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
        aria-label="Back to leagues"
        tabIndex={0}
      >
        <ChevronLeft size={20} />
        <span className="font-medium">Back to Leagues</span>
      </button>

      {/* League Title Section */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2 dark:text-gray-100">{title}</h1>
        <p className="text-gray-600 dark:text-gray-400">{subTitle}</p>
      </div>
    </>
  );
};
