import React from "react";

export const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex items-center justify-center h-32">
      <div
        className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"
        aria-label="Loading"
      ></div>
    </div>
  );
};
