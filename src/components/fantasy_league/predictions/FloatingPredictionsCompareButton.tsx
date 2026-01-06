import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, User, X } from 'lucide-react';
import { useAtomValue } from 'jotai';
import { comparePredictionsAtomGroup } from '../../../state/comparePredictions.atoms';
import { usePredictionsCompareActions } from '../../../hooks/usePredictionsCompare';

export default function FloatingPredictionsCompareButton() {
  const isPickingUsers = useAtomValue(comparePredictionsAtomGroup.isCompareModePredictionsPicking);
  const { startPicking, showCompareModal, stopPicking } = usePredictionsCompareActions();

  const handleClick = () => {
    if (isPickingUsers) {
      showCompareModal();
    } else {
      startPicking();
    }
  };

  return (
    <>
      {/* Cancel Button - Only visible when picking users */}
      <AnimatePresence>
        {isPickingUsers && (
          <motion.button
            aria-label="Cancel compare mode"
            onClick={stopPicking}
            className={[
              'w-12 h-12',
              'rounded-full',
              'flex items-center justify-center',
              'fixed',
              'bottom-36 right-5 sm:bottom-24 sm:right-8 md:bottom-36 md:right-8',
              'z-[70]',
              'bg-slate-500 hover:bg-slate-600 dark:bg-slate-600 dark:hover:bg-slate-700',
              'text-white',
              'active:scale-[0.98]',
              'transition',
              'ring-1 ring-black/30',
              'shadow-lg shadow-black/30',
            ].join(' ')}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: 'spring', damping: 20, stiffness: 260 }}
          >
            <X className="w-5 h-5" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Compare Button */}
      <motion.button
        aria-label={isPickingUsers ? 'Show compare modal' : 'Enter compare mode'}
        onClick={handleClick}
        className={[
          // Size differs when showing two icons vs. single arrow
          isPickingUsers ? 'w-14 h-14' : 'w-16 h-14',
          'rounded-full',
          'flex items-center justify-center',
          'fixed',
          'bottom-20 right-4 sm:bottom-8 sm:right-8 md:bottom-20 md:right-8',
          // Keep above BottomNav (z-50). We use z-[70]
          'z-[70]',
          // Style changes with compare mode

          'bg-blue-600 hover:bg-blue-700 text-white',

          // isPickingUsers
          //   ? 'bg-blue-600 hover:bg-blue-700 text-white'
          //   : 'backdrop-blur-md bg-white/10 dark:bg-white/5 border border-white/20 hover:bg-white/20',
          'active:scale-[0.98]',
          'transition',
          'ring-1 ring-black/30',
          'shadow-lg shadow-black/30',
        ].join(' ')}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', damping: 22, stiffness: 240 }}
      >
        {isPickingUsers ? (
          <ArrowRight className="w-6 h-6 text-white" />
        ) : (
          <>
            <User className="w-5 h-5 text-white/90 dark:text-white/90" />
            <span className="text-white/60 dark:text-white/60">|</span>
            <User className="w-5 h-5 text-white/90 dark:text-white/90" />
          </>
        )}
      </motion.button>
    </>
  );
}
