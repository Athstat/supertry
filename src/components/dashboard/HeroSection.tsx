import React from "react";
import { ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const HeroSection: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-gradient-to-r from-primary-700 to-primary-600 rounded-2xl p-6 sm:p-8 mb-8 text-white">
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">
        Weekly Rugby Fantasy Leagues
      </h1>
      <p className="text-base sm:text-lg mb-4 sm:mb-6 opacity-90">
        Create your dream team and compete in weekly leagues
      </p>
      <button
        onClick={() => navigate("/leagues")}
        className="bg-white text-primary-600 px-6 sm:px-8 py-2 sm:py-3 rounded-lg font-semibold hover:bg-opacity-90 transition-all flex items-center gap-2"
      >
        Join Weekly League <ChevronRight size={20} />
      </button>
    </div>
  );
};
