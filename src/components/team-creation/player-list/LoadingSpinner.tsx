import { Loader } from "lucide-react";
import React from "react";

export const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex items-center justify-center h-32">
      <Loader className="animate-spin h-12 w-12 text-primary-600" />
    </div>
  );
};
