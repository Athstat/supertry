import { useCallback, useEffect, useState } from 'react';
import PrimaryButton from '../shared/buttons/PrimaryButton';
import CreateMyTeam from './CreateMyTeam';
import { useFantasyLeagueGroup } from '../../hooks/leagues/useFantasyLeagueGroup';
import { IFantasyLeagueRound } from '../../types/fantasyLeague';

export default function MyTeam() {
  const [teamState, setTeamState] = useState<'fantasy-rounds' | 'creating-team' | 'team-created'>(
    'fantasy-rounds'
  );
  const { league, refreshRounds, sortedRounds } = useFantasyLeagueGroup();
  const [selectedRound, setSelectedRound] = useState<IFantasyLeagueRound | null>(null);

  const fetchLeagueRounds = useCallback(async () => {
    const fetched = await refreshRounds(league?.id);
    console.log('Fetched league rounds', fetched);
  }, [league?.id, refreshRounds]);

  useEffect(() => {
    if ((sortedRounds.length ?? 0) === 0 && league?.id) {
      fetchLeagueRounds();
    }
  }, [league?.id]);

  if (teamState === 'fantasy-rounds') {
    return (
      <div className="w-full flex items-center justify-center py-10">
        <div className="w-full max-w-md bg-white dark:bg-gray-800/70 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 shadow-sm">
          <div className="px-2 py-2">
            <p className="text-gray-900 dark:text-gray-100 font-medium">Select a Round</p>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Choose a round to create your team for.
            </p>
          </div>
          <div className="divide-y divide-slate-200 dark:divide-slate-700">
            {sortedRounds.map(r => (
              <button
                key={r.id}
                className="w-full flex items-center justify-between px-4 py-3 hover:bg-slate-50 dark:hover:bg-gray-800/50"
                onClick={() => {
                  setSelectedRound(r);
                  setTeamState('creating-team');
                }}
              >
                <span className="text-sm text-gray-800 dark:text-gray-200">{r.title}</span>
                <span className="text-gray-400">→</span>
              </button>
            ))}
            {(sortedRounds.length ?? 0) === 0 && (
              <div className="px-4 py-6 text-center text-sm text-gray-500 dark:text-gray-400">
                No rounds available
                <div className="mt-4 flex justify-center">
                  <PrimaryButton className="w-auto px-6" onClick={fetchLeagueRounds}>
                    Refresh
                  </PrimaryButton>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (teamState === 'creating-team') {
    return <CreateMyTeam leagueRound={selectedRound ?? undefined} />;
  }

  // Placeholder for future 'team-created' state
  return <div className="p-4" />;
}
