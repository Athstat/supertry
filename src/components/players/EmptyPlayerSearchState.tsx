interface EmptyStateProps {
  searchQuery?: string;
  onClearSearch?: () => void;
}

export const EmptyPlayerSearchState = ({ searchQuery, onClearSearch }: EmptyStateProps) => {
  return (
    <div className="text-center py-12">
      <p className="text-gray-600 dark:text-gray-400">No players found</p>
      {searchQuery && onClearSearch && (
        <button
          onClick={onClearSearch}
          className="mt-2 text-primary-600 dark:text-primary-400 font-medium"
        >
          Clear search
        </button>
      )}
    </div>
  );
};
