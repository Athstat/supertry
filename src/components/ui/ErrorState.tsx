import { AlertCircle } from "lucide-react";

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
  error?: string
}

export const ErrorState = ({ message, onRetry, error }: ErrorStateProps) => {
  return (
    <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-6 rounded-lg flex items-center gap-3 my-6">
      <AlertCircle className="h-6 w-6 flex-shrink-0" />
      <div>
        <h3 className="font-medium">{ error ?? "Failed to load players"}</h3>
        <p className="text-sm">{message}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="mt-2 text-sm font-medium underline"
          >
            Try again
          </button>
        )}
      </div>
    </div>
  );
};
