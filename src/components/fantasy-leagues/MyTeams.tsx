import { useEffect, useState } from 'react';
import PrimaryButton from '../shared/buttons/PrimaryButton';
import CreateMyTeam from './CreateMyTeam';
import ViewMyTeam from './ViewMyTeam';
import { useFantasyLeagueGroup } from '../../hooks/leagues/useFantasyLeagueGroup';
import { IFantasyLeagueRound, IFantasyLeagueTeam } from '../../types/fantasyLeague';
import { Users, Loader, Check } from 'lucide-react';
import { leagueService } from '../../services/leagueService';
import FantasyRoundCard from './fantasy_rounds/FantasyRoundCard';
import { IGamesLeagueConfig } from '../../types/leagueConfig';

export default function MyTeams() {
  const [tabScene, setTabScene] = useState<'fantasy-rounds' | 'creating-team' | 'team-created'>(
    'fantasy-rounds'
  );
  const { refreshRounds, sortedRounds } = useFantasyLeagueGroup();
  const [selectedRound, setSelectedRound] = useState<IFantasyLeagueRound | null>(null);
  const [selectedTeam, setSelectedTeam] = useState<IFantasyLeagueTeam | null>(null);
  const [isFetchingTeams, setIsFetchingTeams] = useState<boolean>(false);
  const [roundIdToTeams, setRoundIdToTeams] = useState<Record<string, IFantasyLeagueTeam[]>>({});
  const [showCreationSuccessModal, setShowCreationSuccessModal] = useState<boolean>(false);
  const [leagueConfig, setLeagueConfig] = useState<IGamesLeagueConfig>();
  const [refreshKey, setRefreshKey] = useState(0); // Add refresh key to force re-fetch

  // Fetch teams for the current round
  const fetchTeamsForCurrentRound = async (roundId: string) => {
    if (!roundId) return;

    try {
      setIsFetchingTeams(true);
      const teams = await leagueService.fetchParticipatingTeams(roundId);

      setRoundIdToTeams(prev => ({
        ...prev,
        [roundId]: teams ?? [],
      }));

      // Update the selected team if it exists in the new data
      if (selectedTeam) {
        const updatedTeam = teams?.find(t => t.id === selectedTeam.id);
        if (updatedTeam) {
          console.log('updatedTeam: ', updatedTeam);
          setSelectedTeam(updatedTeam);
        }
      }
    } catch (error) {
      console.error('Failed to fetch teams for round', error);
    } finally {
      setIsFetchingTeams(false);
    }
  };

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
  }, [tabScene, sortedRounds, refreshKey]); // Add refreshKey to dependencies

  useEffect(() => {
    const fetchLeagueConfig = async () => {
      if (!selectedRound?.season_id) return;
      try {
        const config = await leagueService.getLeagueConfig(selectedRound.season_id.toString());
        if (!config) {
          throw new Error('Failed to load league configuration');
        }
        setLeagueConfig(config);
      } catch (error) {
        console.error('Failed to fetch league config:', error);
      }
    };

    fetchLeagueConfig();
  }, [selectedRound?.season_id]);

  if (tabScene === 'fantasy-rounds') {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex flex-col items-start justify-start">
          <div className="flex flex-row items-center gap-2">
            <Users />
            <p className="font-bold text-xl">My Teams</p>
          </div>
          <p className="mt-1 text-gray-600 dark:text-gray-400 text-sm">
            Choose a round to create or view your team
          </p>
        </div>

        <div className="">
          {isFetchingTeams && Object.keys(roundIdToTeams).length === 0 ? (
            <div className="flex flex-col items-center py-12 space-y-3">
              <Loader className="w-8 h-8 text-primary-500 animate-spin" />
              <span className="text-gray-600 dark:text-gray-400">Loading league rounds...</span>
            </div>
          ) : (
            <>
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
            </>
          )}
        </div>
      </div>
    );
  }

  if (tabScene === 'creating-team') {
    return (
      <>
        <CreateMyTeam
          leagueRound={selectedRound ?? undefined}
          onBack={() => setTabScene('fantasy-rounds')}
          leagueConfig={leagueConfig}
          onViewTeam={() => setTabScene('team-created')}
          onTeamCreated={(team: IFantasyLeagueTeam) => {
            // Ensure we keep the same round context
            if (selectedRound) {
              setSelectedRound(selectedRound);
            }
            // Capture the newly created team
            setSelectedTeam(team as IFantasyLeagueTeam);
          }}
        />
      </>
    );
  }

  if (tabScene === 'team-created') {
    if (selectedRound && selectedTeam) {
      return (
        <ViewMyTeam
          leagueRound={selectedRound}
          leagueConfig={leagueConfig}
          team={selectedTeam}
          onBack={() => setTabScene('fantasy-rounds')}
          onTeamUpdated={async () => {
            if (selectedRound?.id) {
              return fetchTeamsForCurrentRound(selectedRound.id);
            }
            return Promise.resolve();
          }}
        />
      );
    }
    return <div className="p-4 text-sm text-gray-500 dark:text-gray-400">Loading team…</div>;
  }

  return <div className="p-4" />;
}
