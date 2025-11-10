import { useState } from 'react';
import { LeaguePredictionRanking } from '../../../types/fantasyLeagueGroups';
import SecondaryText from '../../shared/SecondaryText';
import { twMerge } from 'tailwind-merge';
import { useAuthUser } from '../../../hooks/useAuthUser';
import { User, Target, Info } from 'lucide-react';
import { isEmail } from '../../../utils/stringUtils';
import NoContentCard from '../../shared/NoContentMessage';
import { LoadingState } from '../../ui/LoadingState';
import UserPredictionsHistoryModal from './UserPredictionsHistoryModal';

type LeaguePredictionsLeaderboardProps = {
  rankings: LeaguePredictionRanking[];
  isLoading: boolean;
  leagueId: string;
  roundId?: string;
};

export default function LeaguePredictionsLeaderboard({
  rankings,
  isLoading,
  leagueId,
  roundId,
}: LeaguePredictionsLeaderboardProps) {
  const user = useAuthUser();
  const [selectedUser, setSelectedUser] = useState<{
    userId: string;
    username: string;
  } | null>(null);

  if (isLoading) {
    return <LoadingState />;
  }

  const rankingsList = rankings || [];

  const rankedUsers = rankingsList.filter(r => {
    return r.rank && r.rank > 0;
  });

  const unRankedUsers = rankingsList.filter(r => {
    return r.rank === undefined || r.rank === null || r.rank === 0;
  });

  const shouldHide = (r: LeaguePredictionRanking) => {
    return isEmail(r.username) && r.user_id !== user?.kc_id;
  };

  const isEmpty = rankingsList.length === 0;
  const hasAnyResults = rankingsList.some(r => r.has_results);

  return (
    <div className="flex flex-col gap-4">
      {!hasAnyResults && rankingsList.length > 0 && (
        <div className="flex items-center gap-2 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <Info className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          <p className="text-sm text-blue-700 dark:text-blue-300">
            Awaiting game results - Rankings shown by participation
          </p>
        </div>
      )}

      <div className="flex flex-col gap-2">
        {rankedUsers.map((r, index) => {
          if (shouldHide(r)) {
            return null;
          }

          return (
            <LeaderboardItem
              ranking={r}
              key={index}
              isUser={user?.kc_id === r.user_id}
              onClick={() => setSelectedUser({ userId: r.user_id, username: r.username })}
            />
          );
        })}
      </div>

      {unRankedUsers.length > 0 && <p className="font-bold text-lg">Unranked</p>}

      <div className="flex flex-col gap-2">
        {unRankedUsers.map((r, index) => {
          if (shouldHide(r)) {
            return null;
          }

          return (
            <LeaderboardItem
              ranking={r}
              key={index}
              isUser={user?.kc_id === r.user_id}
              onClick={() => setSelectedUser({ userId: r.user_id, username: r.username })}
            />
          );
        })}
      </div>

      {isEmpty && (
        <NoContentCard message="No predictions made in this league yet. Start making predictions!" />
      )}

      {selectedUser && (
        <UserPredictionsHistoryModal
          isOpen={!!selectedUser}
          onClose={() => setSelectedUser(null)}
          leagueId={leagueId}
          userId={selectedUser.userId}
          username={selectedUser.username}
          roundId={roundId}
        />
      )}
    </div>
  );
}

type LeaderboardItemProps = {
  ranking: LeaguePredictionRanking;
  isUser?: boolean;
  onClick: () => void;
};

function LeaderboardItem({ ranking, isUser, onClick }: LeaderboardItemProps) {
  return (
    <section id={isUser ? 'my-rank-section' : undefined}>
      <div
        onClick={onClick}
        className={twMerge(
          'p-4 rounded-xl flex flex-row items-center gap-4 bg-white border border-slate-300',
          'dark:bg-slate-800/40 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer',
          isUser &&
            'dark:bg-primary-500 hover:animate-glow dark:hover:animate-glow dark:hover:bg-primary-500 hover:bg-primary-500 bg-primary-500 border border-primary-200dark:border-primary-400'
        )}
      >
        <div>
          <p className={twMerge('text-lg font-bold text-blue-500', isUser && 'text-primary-100')}>
            {ranking.rank ?? '-'}
          </p>
        </div>

        <div className="flex flex-col items-start">
          <p className={twMerge('font-bold', isUser && 'text-white')}>{ranking.username}</p>
          <div className="flex flex-row items-center gap-2 flex-wrap">
            <SecondaryText className={twMerge(isUser && 'dark:text-white text-white')}>
              Predictions <strong>{ranking.predictions_made ?? '-'}</strong>
            </SecondaryText>
            <SecondaryText className={twMerge(isUser && 'dark:text-white text-white')}>
              Correct <strong>{ranking.has_results ? ranking.correct_predictions : '-'}</strong>
            </SecondaryText>
            {ranking.has_results && ranking.accuracy > 0 && (
              <SecondaryText
                className={twMerge(
                  'flex items-center gap-1',
                  isUser && 'dark:text-white text-white'
                )}
              >
                <Target className="w-3 h-3" />
                <strong>{ranking.accuracy}%</strong>
              </SecondaryText>
            )}
          </div>
        </div>

        <div className="flex flex-1 items-end justify-end">
          {isUser ? (
            <div className="flex flex-row bg-white rounded-xl text-primary-500 items-center justify-center px-2 py-0.5 gap-1">
              <p className="text-sm">Me</p>
              <User className="w-4 h-4" />
            </div>
          ) : undefined}
        </div>
      </div>
    </section>
  );
}
