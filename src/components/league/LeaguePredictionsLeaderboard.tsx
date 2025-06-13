import React from 'react';
import { useFetch } from '../../hooks/useFetch';
import { leaguePredictionsService } from '../../services/leaguePredictionsService';
import { UserPredictionsRanking } from '../../types/sbr';
import { Trophy } from 'lucide-react';

type LeaguePredictionsLeaderboardProps = {
  leagueId: string;
};

export default function LeaguePredictionsLeaderboard({
  leagueId,
}: LeaguePredictionsLeaderboardProps) {
  const { data: leaderboard, isLoading } = useFetch(
    `league-predictions-leaderboard-${leagueId}`,
    leagueId,
    () => leaguePredictionsService.getLeaguePredictionsLeaderboard(leagueId)
  );

  if (isLoading) {
    return (
      <div className="w-full animate-pulse space-y-2">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-16 rounded-xl bg-slate-100 dark:bg-slate-800"></div>
        ))}
      </div>
    );
  }

  // Show a coming soon message for now
  return (
    <div className="w-full h-fit flex flex-col gap-2 relative">
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-transparent backdrop-blur-sm rounded-xl px-4 py-8 text-center">
        <span className="text-xl font-bold text-slate-700 dark:text-slate-200 mb-2">
          League Predictions Leaderboard Coming Soon!
        </span>
      </div>

      <div className="blur-xs pointer-events-none select-none">
        <div className="grid grid-cols-1 gap-3">
          {[1, 2, 3, 4, 5].map(index => (
            <div
              key={index}
              className="flex flex-row items-center gap-3 bg-white dark:bg-slate-800/40 p-4 rounded-xl"
            >
              <div className="font-bold text-blue-500 dark:text-blue-400">
                <p>{index}</p>
              </div>

              <div>
                <p>Team Member {index}</p>
                <div className="flex flex-row items-center gap-2 text-slate-700 text-xs dark:text-slate-400">
                  <p>Accuracy {Math.floor(Math.random() * 100)}%</p>
                  <p>Correct {Math.floor(Math.random() * 50)}</p>
                  <p>Wrong {Math.floor(Math.random() * 20)}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
