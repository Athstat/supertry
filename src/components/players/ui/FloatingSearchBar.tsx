import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter } from 'lucide-react';

type Props = {
  value: string;
  onChange: (v: string) => void;
  onOpenControls: () => void;
  placeholder?: string;
  className?: string;
};

export default function FloatingSearchBar({
  value,
  onChange,
  onOpenControls,
  placeholder = 'Search players...',
  className,
}: Props) {
  const [isScrollingDown, setIsScrollingDown] = useState(false);
  const lastY = useRef<number>(typeof window !== 'undefined' ? window.scrollY : 0);
  const ticking = useRef(false);

  useEffect(() => {
    const onScroll = () => {
      const currentY = window.scrollY;
      if (!ticking.current) {
        window.requestAnimationFrame(() => {
          const delta = currentY - lastY.current;
          if (Math.abs(delta) > 3) {
            setIsScrollingDown(delta > 0);
            lastY.current = currentY;
          }
          ticking.current = false;
        });
        ticking.current = true;
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <motion.div
      className={[
        'fixed inset-x-0 mx-auto',
        // Keep above BottomNav (z-50). We use z-[70]
        'z-[70]',
        // Offset from bottom to clear BottomNav (h-16) and give breathing room
        'bottom-24 sm:bottom-8 md:bottom-10',
        // Responsive width (viewport-based so it never overflows the screen)
        'w-[92vw] max-w-md md:max-w-lg',
        className ?? '',
      ].join(' ')}
      initial={{ y: 16, opacity: 0 }}
      animate={{ y: 0, opacity: isScrollingDown ? 0.85 : 1 }}
      transition={{ type: 'spring', damping: 22, stiffness: 240 }}
    >
      <div
        className={[
          'w-full h-12 md:h-[52px]',
          'px-4 md:px-5',
          'flex items-center gap-3',
          'rounded-full',
          // Glassmorphism
          'backdrop-blur-md',
          'bg-white/10 dark:bg-slate-900/40',
          'border border-white/15 dark:border-white/10',
          'ring-1 ring-white/10',
          'shadow-lg shadow-black/30',
        ].join(' ')}
      >
        <Search className="w-5 h-5 text-gray-500 dark:text-gray-300" />
        <input
          type="text"
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          className="flex-1 bg-transparent outline-none text-sm md:text-base text-slate-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-400"
        />
        <button
          aria-label="Open filters and sorting"
          onClick={onOpenControls}
          className={[
            'w-9 h-9 md:w-10 md:h-10',
            'rounded-full',
            'flex items-center justify-center',
            'bg-white/10 dark:bg-white/5',
            'border border-white/20',
            'hover:bg-white/20 active:scale-[0.98]',
            'transition',
          ].join(' ')}
        >
          <Filter className="w-5 h-5 text-slate-800 dark:text-white/90" />
        </button>
      </div>
    </motion.div>
  );
}
