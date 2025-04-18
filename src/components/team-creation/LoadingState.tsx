import React from "react";

export const LoadingState: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-850 py-4 flex items-center justify-center">
      <div
        className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"
        aria-label="Loading"
        role="status"
      />
    </div>
  );
};
