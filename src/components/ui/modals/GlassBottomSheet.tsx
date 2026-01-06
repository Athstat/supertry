import { AnimatePresence, motion } from 'framer-motion';
import { ReactNode, useEffect } from 'react';
import BottomSheetHandle from './BottomSheetHandle';

type GlassBottomSheetProps = {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  className?: string;
};

export default function GlassBottomSheet({
  isOpen,
  onClose,
  children,
  className,
}: GlassBottomSheetProps) {
  // Close on ESC
  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Scrim */}
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[85]"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Panel */}
          <motion.div
            role="dialog"
            aria-modal="true"
            className={`fixed left-0 right-0 bottom-0 z-[90]`}
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 260, damping: 26 }}
          >
            <div
              className={[
                // Panel glass styling
                'mx-auto w-full max-w-[720px]',
                'rounded-t-3xl',
                'backdrop-blur-md',
                'bg-white/10 dark:bg-slate-900/40',
                'border-t border-white/10',
                'shadow-2xl shadow-black/40',
                // Spacing with safe-area bottom padding
                'px-4 sm:px-6 pt-3 pb-[max(env(safe-area-inset-bottom,0px),1rem)]',
                className ?? '',
              ].join(' ')}
              onClick={e => e.stopPropagation()}
            >
              {/* Grabber */}
              <BottomSheetHandle />
              <div className="max-h-[75vh] overflow-y-auto no-scrollbar">{children}</div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
