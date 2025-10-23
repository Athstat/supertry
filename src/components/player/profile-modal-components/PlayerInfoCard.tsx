import { twMerge } from 'tailwind-merge';
import SecondaryText from '../../shared/SecondaryText';
import React from 'react';

type Props = {
  value?: string;
  label?: string;
  className?: string;
  icon?: React.ComponentType<{ className?: string }>;
  variant?: 'default' | 'glass';
};

/** Renders a player info small card */
export default function PlayerInfoCard({
  value,
  label,
  className,
  icon: Icon,
  variant = 'default',
}: Props) {
  const baseClasses =
    variant === 'glass'
      ? 'bg-slate-200/50 dark:bg-slate-800/50 backdrop-blur-md ring-1 ring-white/10 shadow-lg'
      : 'bg-slate-200 dark:bg-slate-700/80';

  return (
    <div
      className={twMerge(
        'flex-1 rounded-xl p-3 transition-all duration-200',
        baseClasses,
        className
      )}
    >
      <div className="flex items-center gap-2 mb-1">
        {Icon && <Icon className="w-4 h-4 text-slate-500 dark:text-slate-400" />}
        <p className="font-semibold dark:text-white">{value}</p>
      </div>
      <SecondaryText className="text-xs truncate dark:text-slate-300">{label}</SecondaryText>
    </div>
  );
}
