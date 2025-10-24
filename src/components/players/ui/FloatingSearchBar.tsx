import { useEffect, useRef, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, ArrowRight, User } from 'lucide-react';

type Props = {
  value: string;
  onChange: (v: string) => void;
  onOpenControls: () => void;
  onOpenCompare?: () => void;
  isComparePicking?: boolean;
  placeholder?: string;
  className?: string;
};

export default function FloatingSearchBar({
  value,
  onChange,
  onOpenControls,
  onOpenCompare,
  isComparePicking,
  placeholder = 'Search players...',
  className,
}: Props) {
  const [isScrollingDown, setIsScrollingDown] = useState(false);
  const [isDarkBehind, setIsDarkBehind] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const lastY = useRef<number>(typeof window !== 'undefined' ? window.scrollY : 0);
  const ticking = useRef(false);
  const searchBarRef = useRef<HTMLDivElement>(null);

  // Detect dark mode
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const checkDarkMode = () => {
      // Check both system preference and the 'dark' class on html element
      const htmlClassList = document.documentElement.classList;
      setIsDarkMode(htmlClassList.contains('dark') || mediaQuery.matches);
    };

    checkDarkMode();

    // Listen for changes
    mediaQuery.addEventListener('change', checkDarkMode);

    // Also watch for class changes on the html element
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

    return () => {
      mediaQuery.removeEventListener('change', checkDarkMode);
      observer.disconnect();
    };
  }, []);

  // Detect when the search bar is over player cards using scroll-based position checking
  useEffect(() => {
    const checkOverlap = () => {
      if (!searchBarRef.current) return;

      const searchBarRect = searchBarRef.current.getBoundingClientRect();
      const playerCards = document.querySelectorAll('[data-player-card]');

      // Calculate the center Y position of the search bar
      const searchBarCenterY = searchBarRect.top + searchBarRect.height / 2;

      // Convert NodeList to array and sort cards by vertical position
      const cardsArray = Array.from(playerCards).map(card => ({
        element: card,
        rect: card.getBoundingClientRect(),
      }));

      cardsArray.sort((a, b) => a.rect.top - b.rect.top);

      // Check if center is in an extended gap (gap + 40px buffer on each side)
      let isInGap = false;
      const gapBuffer = 40; // 40px buffer on each side of the gap

      for (let i = 0; i < cardsArray.length - 1; i++) {
        const currentCard = cardsArray[i];
        const nextCard = cardsArray[i + 1];

        // Define the extended gap zone (gap + buffers)
        const extendedGapStart = currentCard.rect.bottom - gapBuffer;
        const extendedGapEnd = nextCard.rect.top + gapBuffer;

        // Check horizontal overlap with cards
        const hasHorizontalOverlap = !(
          searchBarRect.right < currentCard.rect.left || searchBarRect.left > currentCard.rect.right
        );

        // If center is within the extended gap zone and there's horizontal overlap
        if (
          hasHorizontalOverlap &&
          searchBarCenterY >= extendedGapStart &&
          searchBarCenterY <= extendedGapEnd
        ) {
          isInGap = true;
          break;
        }
      }

      // Invert logic: if in gap, text should be dark (isDarkBehind = false)
      // If NOT in gap (over a card), text should be white (isDarkBehind = true)
      setIsDarkBehind(!isInGap);
    };

    // Check on scroll
    const handleScroll = () => {
      if (!ticking.current) {
        window.requestAnimationFrame(() => {
          checkOverlap();
          ticking.current = false;
        });
        ticking.current = true;
      }
    };

    // Initial check
    checkOverlap();

    // Check on scroll and resize
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', checkOverlap, { passive: true });

    // Also check when cards are added/removed
    const observer = new MutationObserver(checkOverlap);
    const playerGrid = document.querySelector('[data-player-grid]');
    if (playerGrid) {
      observer.observe(playerGrid, { childList: true, subtree: true });
    }

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', checkOverlap);
      observer.disconnect();
    };
  }, []);

  // useEffect(() => {
  //   const onScroll = () => {
  //     const currentY = window.scrollY;
  //     if (!ticking.current) {
  //       window.requestAnimationFrame(() => {
  //         const delta = currentY - lastY.current;
  //         if (Math.abs(delta) > 3) {
  //           setIsScrollingDown(delta > 0);
  //           lastY.current = currentY;
  //         }
  //         ticking.current = false;
  //       });
  //       ticking.current = true;
  //     }
  //   };
  //   window.addEventListener('scroll', onScroll, { passive: true });
  //   return () => window.removeEventListener('scroll', onScroll);
  // }, []);

  // Dynamic color classes based on background - only apply in light mode
  const shouldUseWhite = isDarkBehind && !isDarkMode;
  const iconColorClass = shouldUseWhite ? 'text-white' : 'text-slate-800 dark:text-white/90';
  const textColorClass = shouldUseWhite ? 'text-white' : 'text-slate-800 dark:text-white/90';
  const placeholderColorClass = shouldUseWhite
    ? 'placeholder:text-white/90'
    : 'placeholder:text-slate-800 dark:placeholder:text-white/90';

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
        'flex flex-row items-center justify-between',
      ].join(' ')}
      initial={{ y: 16, opacity: 0 }}
      animate={{ y: 0, opacity: isScrollingDown ? 0.85 : 1 }}
      transition={{ type: 'spring', damping: 22, stiffness: 240 }}
    >
      <button
        aria-label="Open filters and sorting"
        onClick={onOpenControls}
        className={[
          'w-10 h-10 md:w-10 md:h-10',
          'rounded-full',
          'backdrop-blur-md',
          'flex items-center justify-center',
          'bg-white/10 dark:bg-white/5',
          'border border-white/20',
          'hover:bg-white/20 active:scale-[0.98]',
          'transition',
          'ring-1 ring-black/30',
          'shadow-lg shadow-black/30',
        ].join(' ')}
      >
        <Filter
          className={`w-5 h-5 transition-colors duration-500 ease-in-out ${iconColorClass}`}
        />
      </button>
      <div
        className={[
          'w-[70%] h-12 md:h-[52px]',
          'px-4 md:px-5',
          'flex items-center gap-3',
          'rounded-full',
          // Glassmorphism
          'backdrop-blur-md',
          'bg-white/10 dark:bg-slate-900/40',
          'border border-white/15 dark:border-white/10',
          'ring-1 ring-black/30 dark:ring-white/30',
          'shadow-lg shadow-black/30 dark:shadow-white/10',
        ].join(' ')}
      >
        <Search
          className={`w-5 h-5 transition-colors duration-500 ease-in-out ${iconColorClass}`}
        />
        <input
          type="text"
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          className={`flex-1 bg-transparent outline-none text-sm md:text-base transition-colors duration-500 ease-in-out ${textColorClass} ${placeholderColorClass}`}
        />
      </div>
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
            : 'backdrop-blur-md bg-white/10 dark:bg-white/5 border border-white/20 hover:bg-white/20',
          'active:scale-[0.98]',
          'transition',
          'ring-1 ring-black/30',
          'shadow-lg shadow-black/30',
        ].join(' ')}
      >
        {isComparePicking ? (
          <ArrowRight className="w-5 h-5 text-white" />
        ) : (
          <>
            <User
              className={`w-5 h-5 transition-colors duration-500 ease-in-out ${iconColorClass}`}
            />
            <span
              className={`transition-colors duration-500 ease-in-out ${shouldUseWhite ? 'text-white/60' : 'text-slate-400 dark:text-white/60'}`}
            >
              |
            </span>
            <User
              className={`w-5 h-5 transition-colors duration-500 ease-in-out ${iconColorClass}`}
            />
          </>
        )}
      </button>
    </motion.div>
  );
}
