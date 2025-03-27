import React from "react";
import { X } from "lucide-react";
import { motion } from "framer-motion";

interface JoinPrivateLeagueModalProps {
  isOpen: boolean;
  onClose: () => void;
  onJoin: () => void;
  code: string;
  onCodeChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error: string | null;
  isSubmitting: boolean;
}

export function JoinPrivateLeagueModal({
  isOpen,
  onClose,
  onJoin,
  code,
  onCodeChange,
  error,
  isSubmitting,
}: JoinPrivateLeagueModalProps) {
  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white dark:bg-dark-850 rounded-xl w-full max-w-md p-6"
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold dark:text-gray-100">
            Join Private League
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-full transition-colors"
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Enter the private league code provided by the league administrator.
        </p>

        <div className="mb-4">
          <input
            type="text"
            placeholder="Enter league code"
            value={code}
            onChange={onCodeChange}
            className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-dark-600 dark:bg-dark-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400"
            aria-label="Private league code"
          />
          {error && (
            <p className="mt-2 text-red-600 dark:text-red-400 text-sm">
              {error}
            </p>
          )}
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 border border-gray-200 dark:border-dark-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-dark-700 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onJoin}
            disabled={isSubmitting}
            className="flex-1 bg-primary-600 text-white px-4 py-3 rounded-lg font-medium hover:bg-primary-700 transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                Joining...
              </>
            ) : (
              "Join League"
            )}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
