import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, ArrowRight, User } from 'lucide-react';

type Props = {
  value: string;
  onChange: (v: string) => void;
  onOpenControls?: () => void;
  onOpenCompare?: () => void;
  isComparePicking?: boolean;
  placeholder?: string;
  className?: string;
  showFilterButton?: boolean;
  showCompareButton?: boolean;
};

export default function FloatingSearchBar({
  value,
  onChange,
  onOpenControls,
  onOpenCompare,
  isComparePicking,
  placeholder = 'Search players...',
  className,
  showFilterButton = true,
  showCompareButton = true,
}: Props) {
  
  const [isScrollingDown, ] = useState(false);
  const searchBarRef = useRef<HTMLDivElement>(null);

  // Simplified color classes for opaque backgrounds
  const iconColorClass = 'text-slate-700 dark:text-white';
  const textColorClass = 'text-slate-800 dark:text-white';
  const placeholderColorClass = 'placeholder:text-slate-500 dark:placeholder:text-slate-400';

  return (
    <motion.div
      ref={searchBarRef}
      className={[
        'fixed inset-x-0 mx-auto',
        // Keep above BottomNav (z-50). We use z-[70]
        'z-[70]',
        // Offset from bottom to clear BottomNav (h-16) and give breathing room
        'bottom-20 sm:bottom-8 md:bottom-20',
        // Responsive width (viewport-based so it never overflows the screen)
        'w-[92vw] max-w-md md:max-w-lg',
        className ?? '',
        'flex flex-row items-center gap-2',
        showFilterButton || showCompareButton ? 'justify-between' : 'justify-center',
      ].join(' ')}
      initial={{ y: 16, opacity: 0 }}
      animate={{ y: 0, opacity: isScrollingDown ? 0.85 : 1 }}
      transition={{ type: 'spring', damping: 22, stiffness: 240 }}
      style={{
        marginBottom: -8,
      }}
    >
      {showFilterButton && (
        <button
          aria-label="Open filters and sorting"
          onClick={onOpenControls}
          className={[
            'w-10 h-10 md:w-10 md:h-10',
            'rounded-full',
            'flex items-center justify-center',
            'bg-white/95 dark:bg-dark-850/95',
            'border border-slate-200 dark:border-slate-700',
            'hover:bg-slate-50 dark:hover:bg-slate-700 active:scale-[0.98]',
            'transition',
            'shadow-lg shadow-black/20',
          ].join(' ')}
        >
          <Filter className={`w-5 h-5 ${iconColorClass}`} />
        </button>
      )}
      <div
        className={[
          'w-[90%]',
          'items-center justify-center',
          'h-12 md:h-[52px]',
          'px-4 md:px-5',
          'flex items-center gap-3',
          'rounded-full',
          'bg-white/95 dark:bg-dark-850/70',
          'border border-slate-200 dark:border-slate-700',
          'shadow-lg shadow-black/20',
        ].join(' ')}
      >
        <Search className={`w-5 h-5 ${iconColorClass}`} />
        <input
          type="text"
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          className={`flex-1 bg-transparent outline-none text-base ${textColorClass} ${placeholderColorClass}`}
        />
      </div>
      {showCompareButton && (
        <button
          aria-label="Enter compare mode"
          onClick={onOpenCompare ?? onOpenControls}
          className={[
            // Size differs when showing two icons vs. single arrow
            isComparePicking ? 'w-10 h-10 md:w-10 md:h-10' : 'w-14 h-10 md:w-10 md:h-10',
            'rounded-full',
            'flex items-center justify-center',
            // Style changes with compare mode
            isComparePicking
              ? 'bg-blue-600 hover:bg-blue-700 text-white'
              : 'bg-white/95 dark:bg-dark-850/95 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700',
            'active:scale-[0.98]',
            'transition',
            'shadow-lg shadow-black/20',
          ].join(' ')}
        >
          {isComparePicking ? (
            <ArrowRight className="w-5 h-5 text-white" />
          ) : (
            <>
              <User className={`w-5 h-5 ${iconColorClass}`} />
              <span className="text-slate-400 dark:text-slate-500">|</span>
              <User className={`w-5 h-5 ${iconColorClass}`} />
            </>
          )}
        </button>
      )}
    </motion.div>
  );
}
