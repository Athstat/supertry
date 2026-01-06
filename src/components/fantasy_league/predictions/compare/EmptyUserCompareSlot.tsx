import { Plus } from 'lucide-react';
import { twMerge } from 'tailwind-merge';
import SecondaryText from '../../../shared/SecondaryText';

type Props = {
  leagueId: string;
  roundId?: string;
};

export default function EmptyUserCompareSlot({ leagueId, roundId }: Props) {
  return (
    <div
      className={twMerge(
        'flex flex-col gap-2 m-4 flex-1 min-w-[300px] max-w-[300px]',
        'bg-slate-200 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-xl min-h-screen max-h-screen',
        'flex flex-col items-center justify-center'
      )}
    >
      <div className="flex cursor-not-allowed w-full flex-1 flex-col items-center gap-2 justify-center">
        <div className="text-slate-400 dark:text-slate-500">
          <Plus className="w-14 h-14" />
        </div>

        <p className="text-slate-600 dark:text-slate-400 font-medium">Add User</p>
        <p className="text-xs text-center px-4 text-slate-500 dark:text-slate-500">
          Click on users in the leaderboard to add them to comparison
        </p>
      </div>
    </div>
  );
}
