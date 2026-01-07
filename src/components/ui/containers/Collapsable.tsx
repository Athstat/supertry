import { ChevronDown } from 'lucide-react';
import { ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';
import { AppColours } from '../../../types/constants';
import { motion, AnimatePresence } from 'framer-motion';

type Props = {
  icon?: ReactNode;
  label?: string;
  children?: ReactNode;
  open?: boolean;
  toggle?: () => void;
  overlay?: boolean;
  overlayClassName?: string;
};

export default function Collapsable({
  icon,
  label,
  children,
  open,
  toggle,
  overlay,
  overlayClassName,
}: Props) {
  const handleToggle = () => {
    if (toggle) toggle();
  };

  const collapseVariants = {
    open: {
      height: "auto",
      opacity: 1,
      transition: {
        height: { duration: 0.25, ease: "easeOut" },
        opacity: { duration: 0.2, ease: "easeOut" },
      },
    },
    collapsed: {
      height: 0,
      opacity: 0,
      transition: {
        height: { duration: 0.2, ease: "easeIn" },
        opacity: { duration: 0.15, ease: "easeIn" },
      },
    },
  };

  return (
    <div
      className={twMerge(
        "bg-slate-200 border border-slate-300 dark:border-slate-600 dark:bg-slate-700/60 p-1 rounded-lg relative",
        AppColours.CARD_BACKGROUND
      )}
    >
      {/* Header */}
      <div
        onClick={handleToggle}
        className="w-full cursor-pointer px-2 py-2 flex flex-row items-center justify-between rounded-lg"
      >
        <div className="flex flex-row items-center gap-1">
          {icon}
          <p className="text font-bold">{label}</p>
        </div>

        {/* Chevron */}
        <motion.div
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
        >
          <ChevronDown className="w-6 h-6" />
        </motion.div>
      </div>

      {/* Content */}
      <AnimatePresence initial={false}>
        {open && (
          overlay ? (
            <motion.div
              key="overlay"
              variants={collapseVariants}
              initial="collapsed"
              animate="open"
              exit="collapsed"
              style={{ overflow: "hidden" }}
              className={
                "absolute left-0 right-0 z-30 mt-1 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-lg p-2 " +
                (overlayClassName ?? "")
              }
            >
              {children}
            </motion.div>
          ) : (
            <motion.div
              key="inline"
              variants={collapseVariants}
              initial="collapsed"
              animate="open"
              exit="collapsed"
              style={{ overflow: "hidden" }}
            >
              {children}
            </motion.div>
          )
        )}
      </AnimatePresence>
    </div>
  );
}
