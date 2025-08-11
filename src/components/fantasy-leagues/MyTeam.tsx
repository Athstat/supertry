import { useEffect, useState } from 'react';
import PrimaryButton from '../shared/buttons/PrimaryButton';
import CreateMyTeam from './CreateMyTeam';
import { useFantasyLeagueGroup } from '../../hooks/leagues/useFantasyLeagueGroup';
import { IFantasyLeagueRound, IFantasyLeagueTeam } from '../../types/fantasyLeague';
import { Users } from 'lucide-react';
import { leagueService } from '../../services/leagueService';

export default function MyTeam() {
  const [tabScene, setTabScene] = useState<'fantasy-rounds' | 'creating-team' | 'team-created'>(
    'fantasy-rounds'
  );
  const { refreshRounds, sortedRounds } = useFantasyLeagueGroup();
  const [selectedRound, setSelectedRound] = useState<IFantasyLeagueRound | null>(null);
  const [isFetchingTeams, setIsFetchingTeams] = useState<boolean>(false);
  const [roundIdToTeams, setRoundIdToTeams] = useState<Record<string, IFantasyLeagueTeam[]>>({});

  // Phase 1: Fetch participating teams for each round (by round/league id)
  useEffect(() => {
    // Only fetch teams while listing rounds
    if (tabScene !== 'fantasy-rounds') return;
    if (!sortedRounds || sortedRounds.length === 0) return;

    async function fetchTeamsForRounds() {
      try {
        setIsFetchingTeams(true);
        const fetches = sortedRounds.map(r => leagueService.fetchParticipatingTeams(r.id));
        const results = await Promise.all(fetches);

        const mapping: Record<string, IFantasyLeagueTeam[]> = {};
        sortedRounds.forEach((round, index) => {
          mapping[round.id] = results[index] ?? [];
        });

        setRoundIdToTeams(mapping);
      } catch (error) {
        console.error('Failed to fetch teams for rounds', error);
      } finally {
        setIsFetchingTeams(false);
      }
    }

    fetchTeamsForRounds();
  }, [tabScene, sortedRounds]);

  console.log('teams: ', roundIdToTeams);

  if (tabScene === 'fantasy-rounds') {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex flex-row items-center justify-between">
          <div className="flex flex-row items-center gap-2">
            <Users />
            <p className="font-bold text-xl">My Teams</p>
          </div>
        </div>

        <div className="px-1">
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            Choose a round to view/create your team
          </p>
          {isFetchingTeams && (
            <p className="text-xs text-gray-500 dark:text-gray-400">Loading teams…</p>
          )}
        </div>

        <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-gray-800/70 overflow-hidden">
          <div className="divide-y divide-slate-200 dark:divide-slate-700">
            {sortedRounds.map(r => (
              <button
                key={r.id}
                className="w-full flex items-center justify-between px-4 py-3 hover:bg-slate-50 dark:hover:bg-gray-800/50"
                onClick={() => {
                  setSelectedRound(r);
                  setTabScene('creating-team');
                }}
              >
                <span className="text-left">
                  <span className="block text-sm text-gray-800 dark:text-gray-200">{r.title}</span>
                  <span className="block text-xs text-gray-500 dark:text-gray-400">
                    Total teams: {roundIdToTeams[r.id]?.length ?? 0}
                  </span>
                </span>
                <span className="text-gray-400">→</span>
              </button>
            ))}
            {(sortedRounds.length ?? 0) === 0 && (
              <div className="px-4 py-6 text-center text-sm text-gray-500 dark:text-gray-400">
                No rounds available
                <div className="mt-4 flex justify-center">
                  <PrimaryButton className="w-auto px-6" onClick={() => refreshRounds()}>
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

  if (tabScene === 'creating-team') {
    return <CreateMyTeam leagueRound={selectedRound ?? undefined} />;
  }

  // Placeholder for future 'team-created' state
  return <div className="p-4" />;
}
