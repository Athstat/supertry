import { LeaguePredictionRanking } from '../../../../types/fantasyLeagueGroups';
import { X, ChevronLeft, ChevronRight, User as UserIcon } from 'lucide-react';
import { twMerge } from 'tailwind-merge';
import { usePredictionsCompareActions } from '../../../../hooks/usePredictionsCompare';
import SecondaryText from '../../../shared/SecondaryText';

type Props = {
  user: LeaguePredictionRanking;
};

export default function UserPredictionsCompareItemHeader({ user }: Props) {
  const { moveUserLeft, moveUserRight, removeUser } = usePredictionsCompareActions();

  return (
    <div className="flex flex-col gap-2">
      <div
        className={twMerge(
          'flex flex-row bg-slate-100 dark:bg-slate-700/50 items-center justify-between p-1 rounded-lg',
          'border border-slate-200 dark:border-slate-600'
        )}
      >
        <div className="flex flex-row items-center gap-1">
          <button
            onClick={() => moveUserLeft(user)}
            className="flex w-fit text-sm p-1 rounded-md hover:bg-slate-100 hover:dark:bg-slate-600 text-slate-700 dark:text-white cursor-pointer items-center"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <button
            onClick={() => moveUserRight(user)}
            className="flex w-fit text-sm p-1 rounded-md hover:bg-slate-100 hover:dark:bg-slate-600 text-slate-700 dark:text-white cursor-pointer items-center"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <button
          onClick={() => removeUser(user)}
          className="flex w-fit text-sm p-1 rounded-md hover:bg-slate-100 hover:dark:bg-slate-600 text-slate-700 dark:text-white cursor-pointer items-center"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* User Info Card */}
      <div className="flex flex-col bg-slate-100 border border-slate-300 dark:bg-slate-800 dark:border-slate-600 w-full gap-2 p-4 rounded-xl">
        <div className="flex flex-row items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-primary-500 flex items-center justify-center">
            <UserIcon className="w-5 h-5 text-white" />
          </div>
          <div className="flex flex-col flex-1">
            <p className="font-bold truncate text-slate-900 dark:text-slate-100">{user.username}</p>
            {user.rank && <SecondaryText className="text-xs">Rank #{user.rank}</SecondaryText>}
          </div>
        </div>
      </div>
    </div>
  );
}
