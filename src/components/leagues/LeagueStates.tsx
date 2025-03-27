import React from "react";
import { motion } from "framer-motion";

interface LoadingStateProps {
  isLoading: boolean;
}

export function LoadingState({ isLoading }: LoadingStateProps) {
  if (!isLoading) return null;

  return (
    <div className="text-center py-10">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600 mx-auto mb-4"></div>
      <p className="text-gray-600 dark:text-gray-400">Loading leagues...</p>
    </div>
  );
}

interface ErrorStateProps {
  error: string | null;
  isLoading: boolean;
}

export function ErrorState({ error, isLoading }: ErrorStateProps) {
  if (isLoading || !error) return null;

  return (
    <div className="bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 p-4 rounded-lg">
      {error}
    </div>
  );
}

interface EmptyStateProps {
  isLoading: boolean;
  availableLeagues: any[];
  currentLeagues: any[];
  error: string | null;
  cardVariants: any;
}

export function EmptyState({
  isLoading,
  availableLeagues,
  currentLeagues,
  error,
  cardVariants,
}: EmptyStateProps) {
  if (
    isLoading ||
    error ||
    availableLeagues.length > 0 ||
    currentLeagues.length > 0
  )
    return null;

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={cardVariants}
      transition={{ duration: 0.5 }}
      className="text-center py-10"
    >
      <p className="text-gray-600 dark:text-gray-400">
        No leagues available at the moment.
      </p>
    </motion.div>
  );
}

interface NoSearchResultsProps {
  isLoading: boolean;
  searchTerm: string;
  filteredLeagues: any[];
  availableLeagues: any[];
  cardVariants: any;
  onClearSearch: () => void;
}

export function NoSearchResults({
  isLoading,
  searchTerm,
  filteredLeagues,
  availableLeagues,
  cardVariants,
  onClearSearch,
}: NoSearchResultsProps) {
  if (
    isLoading ||
    !searchTerm ||
    filteredLeagues.length > 0 ||
    availableLeagues.length === 0
  )
    return null;

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={cardVariants}
      transition={{ duration: 0.5 }}
      className="text-center py-10"
    >
      <p className="text-gray-600 dark:text-gray-400">
        No leagues found matching "{searchTerm}".
      </p>
      <button
        onClick={onClearSearch}
        className="mt-2 text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 font-medium"
      >
        Clear search
      </button>
    </motion.div>
  );
}
