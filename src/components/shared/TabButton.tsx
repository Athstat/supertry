interface TabButtonProps {
    active: boolean;
    onClick: () => void;
    children: React.ReactNode;
}

export function TabButton({ active, onClick, children }: TabButtonProps) {
    return (
        <button
            onClick={onClick}
            className={`px-4 py-3 font-medium whitespace-nowrap border-b-2 transition-colors ${active
                    ? "border-primary-600 text-primary-600 dark:border-primary-400 dark:text-primary-400"
                    : "border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
                }`}
            aria-label={`View ${children} tab`}
            tabIndex={0}
            onKeyDown={(e) => e.key === "Enter" && onClick()}
        >
            {children}
        </button>
    )
};
