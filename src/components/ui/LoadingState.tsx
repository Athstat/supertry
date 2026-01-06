import React from "react";
import { Loader } from "lucide-react";

export const LoadingState: React.FC = () => {
  return (
    <div
      className="min-h-screen bg-gray-50 dark:bg-dark-850 flex items-start justify-center pt-[30vh]"
      aria-label="Loading"
      role="status"
    >
      <Loader className="w-10 h-10 text-primary-600 animate-spin" />
    </div>
  );
};
