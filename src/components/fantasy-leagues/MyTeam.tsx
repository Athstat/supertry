import { useEffect, useState } from 'react';
import PrimaryButton from '../shared/buttons/PrimaryButton';
import CreateMyTeam from './CreateMyTeam';
import ViewMyTeam from './ViewMyTeam';
import { useFantasyLeagueGroup } from '../../hooks/leagues/useFantasyLeagueGroup';
import { IFantasyLeagueRound, IFantasyLeagueTeam } from '../../types/fantasyLeague';
import { Users, Loader } from 'lucide-react';
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
  const [showCreationSuccessModal, setShowCreationSuccessModal] = useState<boolean>(false);

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
          onTeamCreated={(team: IFantasyLeagueTeam) => {
            // Ensure we keep the same round context
            if (selectedRound) {
              setSelectedRound(selectedRound);
            }
            // Capture the newly created team and show the created view in the background
            setSelectedTeam(team as IFantasyLeagueTeam);
            setTabScene('team-created');
            setShowCreationSuccessModal(true);
          }}
        />

        {showCreationSuccessModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-[60]">
            <div className="bg-white dark:bg-dark-850 rounded-xl w-full max-w-md p-6">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 dark:bg-green-900 text-green-500 dark:text-green-400 mb-4">
                  <Users className="w-8 h-8" />
                </div>
                <h2 className="text-2xl font-bold mb-2 dark:text-gray-100">Team Submitted!</h2>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Your team has been successfully submitted
                  {selectedRound ? ` to ${selectedRound.title}` : ''}.
                </p>
                <PrimaryButton
                  className="w-full"
                  onClick={() => setShowCreationSuccessModal(false)}
                >
                  {"Let's Go!"}
                </PrimaryButton>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }

  if (tabScene === 'team-created') {
    if (selectedRound && selectedTeam) {
      return (
        <ViewMyTeam
          leagueRound={selectedRound}
          team={selectedTeam}
          onBack={() => setTabScene('fantasy-rounds')}
        />
      );
    }
    return <div className="p-4 text-sm text-gray-500 dark:text-gray-400">Loading team…</div>;
  }

  return <div className="p-4" />;
}
