import { twMerge } from 'tailwind-merge';

type Props = {
  homePercentage: number;
  drawPercentage: number;
  awayPercentage: number;
  homeTeamName: string;
  awayTeamName: string;
  className?: string;
};

/** Renders a component to show the vote percentages */
export default function ConsensusBar({
  homePercentage,
  drawPercentage,
  awayPercentage,
  homeTeamName,
  awayTeamName,
  className,
}: Props) {
  const totalVotes = homePercentage + drawPercentage + awayPercentage;
  const hasVotes = totalVotes > 0;

  if (!hasVotes) {
    return (
      <div
        className={twMerge(
          'w-full flex items-center justify-center py-2 px-3 rounded-lg bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700',
          className
        )}
      >
        <span className="text-xs text-slate-400 dark:text-slate-500">No picks yet</span>
      </div>
    );
  }

  return (
    <div className={twMerge('w-full flex flex-col gap-2', className)}>
      {/* Consensus bar with team names inside */}
      <div className="w-full flex flex-row rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700">
        {/* Home team segment */}
        {homePercentage > 0 && (
          <div
            style={{ width: `${homePercentage}%` }}
            className="bg-gradient-to-r from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 flex flex-col items-center justify-center text-white py-2 px-1 transition-all duration-300"
          >
            <span className="text-[9px] font-semibold truncate w-full text-center">
              {homeTeamName}
            </span>
            <span className="text-[10px] font-bold">{homePercentage}%</span>
          </div>
        )}

        {/* Draw segment */}
        {drawPercentage > 0 && (
          <div
            style={{ width: `${drawPercentage}%` }}
            className="bg-slate-400 dark:bg-slate-600 flex flex-col items-center justify-center text-white py-2 px-1 transition-all duration-300"
          >
            <span className="text-[9px] font-semibold">Draw</span>
            <span className="text-[10px] font-bold">{drawPercentage}%</span>
          </div>
        )}

        {/* Away team segment */}
        {awayPercentage > 0 && (
          <div
            style={{ width: `${awayPercentage}%` }}
            className="bg-gradient-to-r from-indigo-500 to-indigo-600 dark:from-indigo-600 dark:to-indigo-700 flex flex-col items-center justify-center text-white py-2 px-1 transition-all duration-300"
          >
            <span className="text-[9px] font-semibold truncate w-full text-center">
              {awayTeamName}
            </span>
            <span className="text-[10px] font-bold">{awayPercentage}%</span>
          </div>
        )}
      </div>
    </div>
  );
}
