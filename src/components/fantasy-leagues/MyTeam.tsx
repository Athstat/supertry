import { useEffect, useState } from 'react';
import PrimaryButton from '../shared/buttons/PrimaryButton';
import CreateMyTeam from './CreateMyTeam';
import ViewMyTeam from './ViewMyTeam';
import { useFantasyLeagueGroup } from '../../hooks/leagues/useFantasyLeagueGroup';
import { IFantasyLeagueRound, IFantasyLeagueTeam } from '../../types/fantasyLeague';
import { Users } from 'lucide-react';
import { leagueService } from '../../services/leagueService';
import FantasyRoundCard from './fantasy_rounds/FantasyRoundCard';

export default function MyTeam() {
  const [tabScene, setTabScene] = useState<'fantasy-rounds' | 'creating-team' | 'team-created'>(
    'fantasy-rounds'
  );
  const { refreshRounds, sortedRounds } = useFantasyLeagueGroup();
  const [selectedRound, setSelectedRound] = useState<IFantasyLeagueRound | null>(null);
  const [selectedTeam, setSelectedTeam] = useState<IFantasyLeagueTeam | null>(null);
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

        <div className="">
          {sortedRounds.map(r => (
            <div key={r.id} className="py-3">
              <FantasyRoundCard
                round={r}
                teams={roundIdToTeams[r.id]}
                onCreateTeam={() => {
                  setSelectedRound(r);
                  setTabScene('creating-team');
                }}
                onViewTeam={team => {
                  setSelectedRound(r);
                  setSelectedTeam(team);
                  setTabScene('team-created');
                }}
              />
            </div>
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
    );
  }

  if (tabScene === 'creating-team') {
    return <CreateMyTeam leagueRound={selectedRound ?? undefined} />;
  }

  if (tabScene === 'team-created') {
    if (selectedRound && selectedTeam) {
      return <ViewMyTeam leagueRound={selectedRound} team={selectedTeam} />;
    }
    return <div className="p-4 text-sm text-gray-500 dark:text-gray-400">Loading team…</div>;
  }

  return <div className="p-4" />;
}
