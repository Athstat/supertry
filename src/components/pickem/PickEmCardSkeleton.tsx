import { forwardRef } from 'react';
import { twMerge } from 'tailwind-merge';

type Props = {
  className?: string;
};

const PickEmCardSkeleton = forwardRef<HTMLDivElement, Props>(({ className }, ref) => {
  return (
    <div
      ref={ref}
      className={twMerge(
        'p-4 flex flex-col bg-white shadow-md border border-slate-300 dark:border-slate-700 gap-3 dark:bg-slate-800/50',
        className
      )}
    >
      {/* Header - Competition and Date Skeleton */}
      <div className="w-full items-center justify-center flex flex-col gap-0.5">
        <div className="h-3 w-32 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
        <div className="h-3 w-40 bg-slate-200 dark:bg-slate-700 rounded animate-pulse mt-1" />
      </div>

      {/* Interactive Prediction Row Skeleton */}
      <div className="grid grid-cols-3 items-center gap-2 mt-2">
        {/* Home Team Skeleton */}
        <div className="flex flex-col items-center gap-3 p-3 max-w-[120px] justify-self-start">
          <div className="w-14 h-14 bg-slate-200 dark:bg-slate-700 rounded-full animate-pulse" />
          <div className="h-3 w-20 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
        </div>

        {/* Draw Button Skeleton */}
        <div className="flex flex-col items-center gap-2 px-4 py-3 max-w-[100px] justify-self-center">
          <div className="h-6 w-16 bg-slate-200 dark:bg-slate-700 rounded-full animate-pulse" />
        </div>

        {/* Away Team Skeleton */}
        <div className="flex flex-col items-center gap-3 p-3 max-w-[120px] justify-self-end">
          <div className="w-14 h-14 bg-slate-200 dark:bg-slate-700 rounded-full animate-pulse" />
          <div className="h-3 w-20 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
        </div>
      </div>

      {/* Total Votes Skeleton */}
      <div className="w-full flex items-center justify-center mt-2">
        <div className="h-3 w-24 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
      </div>

      {/* Consensus Bar Skeleton */}
      <div className="w-full h-8 bg-slate-200 dark:bg-slate-700 rounded-lg animate-pulse" />
    </div>
  );
});

PickEmCardSkeleton.displayName = 'PickEmCardSkeleton';

export default PickEmCardSkeleton;
