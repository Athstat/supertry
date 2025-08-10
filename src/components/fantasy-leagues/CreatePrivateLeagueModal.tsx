import React from "react";
import { X } from "lucide-react";
import { motion } from "framer-motion";

interface CreatePrivateLeagueModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreatePrivateLeagueModal({
  isOpen,
  onClose,
}: CreatePrivateLeagueModalProps) {
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
            Create Private League
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-full transition-colors"
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        <p className="text-gray-600 dark:text-gray-400 mb-6">
          This feature is coming soon! You'll be able to create your own private
          leagues to compete with friends.
        </p>

        <button
          onClick={onClose}
          className="w-full bg-primary-600 text-white px-4 py-3 rounded-lg font-medium hover:bg-primary-700 transition-colors"
        >
          Got it
        </button>
      </motion.div>
    </motion.div>
  );
}
