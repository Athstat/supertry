import { LeaguePredictionRanking } from '../../../../types/fantasyLeagueGroups';
import UserPredictionsCompareItemHeader from './UserPredictionsCompareItemHeader';
import { twMerge } from 'tailwind-merge';
import SecondaryText from '../../../shared/SecondaryText';
import { Target, Info } from 'lucide-react';
import { useMemo } from 'react';
import { useAtomValue } from 'jotai';
import { compareUsersAtom } from '../../../../state/comparePredictions.atoms';

type Props = {
  user: LeaguePredictionRanking;
  leagueId: string;
  roundId?: string;
};

export default function UserPredictionsCompareItem({ user, leagueId, roundId }: Props) {
  const allUsers = useAtomValue(compareUsersAtom);

  // Calculate if this user is the leader in each stat category
  const stats = useMemo(() => {
    // Find best values across all users
    const bestPredictionsMade = Math.max(...allUsers.map(u => u.predictions_made));
    const bestCorrectPredictions = Math.max(...allUsers.map(u => u.correct_predictions));
    const bestAccuracy = Math.max(...allUsers.map(u => u.accuracy));
    const bestRank = Math.min(...allUsers.filter(u => u.rank).map(u => u.rank!));

    return {
      predictions_made: user.predictions_made,
      correct_predictions: user.correct_predictions,
      accuracy: user.accuracy,
      rank: user.rank,
      isPredictionsMadeLeader:
        user.predictions_made === bestPredictionsMade && bestPredictionsMade > 0,
      isCorrectPredictionsLeader:
        user.correct_predictions === bestCorrectPredictions && bestCorrectPredictions > 0,
      isAccuracyLeader: user.accuracy === bestAccuracy && bestAccuracy > 0,
      isRankLeader: user.rank === bestRank && bestRank > 0,
    };
  }, [user, allUsers]);

  return (
    <div className="flex flex-col gap-2 w-[calc(50%-0.25rem)] md:flex-1 md:min-w-[200px] md:max-w-[300px] flex-shrink-0">
      <UserPredictionsCompareItemHeader user={user} />

      {/* User Statistics Card */}
      <div className="flex flex-col bg-slate-50 border border-slate-300 dark:bg-slate-800 dark:border-slate-600 w-full gap-3 p-3 rounded-xl">
        <div className="flex flex-row items-center justify-between">
          <p className="text-xs font-semibold text-slate-900 dark:text-slate-100">
            Performance Stats
          </p>
        </div>

        <div className="flex flex-col gap-3">
          {/* Rank */}
          <StatRow
            label="Rank"
            value={user.rank ? `#${user.rank}` : '-'}
            isLeader={stats.isRankLeader}
          />

          {/* Predictions Made */}
          <StatRow
            label="Predictions Made"
            value={stats.predictions_made}
            isLeader={stats.isPredictionsMadeLeader}
          />

          {/* Correct Predictions */}
          {user.has_results && (
            <StatRow
              label="Correct Predictions"
              value={stats.correct_predictions}
              isLeader={stats.isCorrectPredictionsLeader}
            />
          )}

          {/* Accuracy */}
          {user.has_results && stats.accuracy > 0 && (
            <StatRow
              label="Accuracy"
              value={`${stats.accuracy}%`}
              isLeader={stats.isAccuracyLeader}
              icon={<Target className="w-3 h-3" />}
            />
          )}
        </div>

        {!user.has_results && (
          <div className="flex items-center gap-2 p-2 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <Info className="w-3 h-3 text-blue-600 dark:text-blue-400" />
            <SecondaryText className="text-xs text-blue-700 dark:text-blue-300">
              Awaiting results
            </SecondaryText>
          </div>
        )}
      </div>
    </div>
  );
}

type StatRowProps = {
  label: string;
  value: string | number;
  isLeader: boolean;
  icon?: React.ReactNode;
};

function StatRow({ label, value, isLeader, icon }: StatRowProps) {
  return (
    <div
      className={twMerge(
        'flex flex-row items-center justify-between p-2 rounded-lg',
        isLeader &&
          'bg-yellow-100 dark:bg-yellow-900/20 border border-yellow-300 dark:border-yellow-700'
      )}
    >
      <div className="flex items-center gap-1">
        {icon}
        <SecondaryText className="text-xs">{label}</SecondaryText>
      </div>
      <p
        className={twMerge('font-bold text-sm', isLeader && 'text-yellow-700 dark:text-yellow-400')}
      >
        {value}
      </p>
    </div>
  );
}
