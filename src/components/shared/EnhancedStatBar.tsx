import { motion, AnimatePresence } from "framer-motion";
import { Award, ChevronDown, ChevronUp, Flame, Star, TrendingUp } from "lucide-react";

interface EnhancedStatBarProps {
    id: string;
    label: string;
    value: number;
    maxValue: number;
    icon: React.ReactNode;
    description: string;
    isExpanded: boolean;
    onToggle: () => void;
    expanded?: boolean;
  }
  
export function EnhancedStatBar({
    id,
    label,
    value,
    maxValue,
    icon,
    description,
    isExpanded,
    onToggle,
  }: EnhancedStatBarProps) {
    const percentage = (value / maxValue) * 100;
    const badge = value >= 3.5 ? getBadge(value) : null;
  
    function getBadge(val: number) {
      if (val >= 4.5)
        return {
          icon: <Award size={16} />,
          text: "League Leader",
          color: "text-yellow-500 bg-yellow-100 dark:bg-yellow-900/20",
        };
      if (val >= 4)
        return {
          icon: <Flame size={16} />,
          text: "On Fire",
          color: "text-orange-500 bg-orange-100 dark:bg-orange-900/20",
        };
      if (val >= 3.5)
        return {
          icon: <Star size={16} />,
          text: "Rising Star",
          color: "text-blue-500 bg-blue-100 dark:bg-blue-900/20",
        };
      return null;
    }
  
    return (
      <div className="space-y-2 bg-white dark:bg-dark-800/60 rounded-lg p-3 transition-all duration-300 hover:shadow-sm">
        <button
          onClick={onToggle}
          className="w-full flex items-center justify-between cursor-pointer"
          aria-expanded={isExpanded}
          aria-controls={`stat-details-${id}`}
          tabIndex={0}
          onKeyDown={(e) => e.key === "Enter" && onToggle()}
        >
          <div className="flex items-center gap-2">
            {icon}
            <span className="text-sm font-medium dark:text-gray-300">
              {label}
            </span>
  
            {badge && (
              <span
                className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full ${badge.color}`}
              >
                {badge.icon}
                <span>{badge.text}</span>
              </span>
            )}
          </div>
  
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium dark:text-gray-300">
              {value}/5
            </span>
            {isExpanded ? (
              <ChevronUp size={16} className="text-gray-400" />
            ) : (
              <ChevronDown size={16} className="text-gray-400" />
            )}
          </div>
        </button>
  
        {/* Star Rating */}
        <div className="flex space-x-1">
          {[...Array(maxValue)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ scale: 0.8, opacity: 0.5 }}
              animate={{
                scale: i < value ? 1 : 0.8,
                opacity: i < value ? 1 : 0.5,
              }}
              transition={{ duration: 0.3, delay: i * 0.1 }}
              className={`w-5 h-5 ${
                i < value ? "text-green-500" : "text-gray-300 dark:text-gray-600"
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 24 24"
                className="w-full h-full"
              >
                <path d="M12 .587l3.668 7.568 8.332 1.207-6.004 5.848 1.417 8.267L12 18.896l-7.413 3.895 1.417-8.267-6.004-5.848 8.332-1.207L12 .587z" />
              </svg>
            </motion.div>
          ))}
        </div>
  
        {/* Progress Bar */}
        <div className="h-2 bg-gray-100 dark:bg-dark-700 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="h-full bg-gradient-to-r from-green-400 to-green-600 dark:from-green-500 dark:to-green-700"
          />
        </div>
  
        {/* Expanded Details */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              id={`stat-details-${id}`}
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="pt-2 text-sm text-gray-600 dark:text-gray-400 border-t border-gray-100 dark:border-gray-700 mt-2">
                <p>{description}</p>
  
                {value >= 4 && (
                  <div className="mt-2 p-2 bg-green-50 dark:bg-green-900/20 rounded text-green-700 dark:text-green-400 text-xs">
                    <TrendingUp size={14} className="inline mr-1" />
                    This is one of {label.toLowerCase()}'s strongest attributes.
                  </div>
                )}
  
                {value <= 2 && (
                  <div className="mt-2 p-2 bg-amber-50 dark:bg-amber-900/20 rounded text-amber-700 dark:text-amber-400 text-xs">
                    <TrendingUp size={14} className="inline mr-1" />
                    This is an area where {label.toLowerCase()} could be improved.
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };
  