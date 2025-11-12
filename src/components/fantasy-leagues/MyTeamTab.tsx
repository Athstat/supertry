import { Activity, Fragment, useMemo, useState } from 'react';
import CreateMyTeam from './CreateMyTeam';
import FantasyTeamView from './my-team/ViewMyTeam';
import { IFantasyLeagueTeam } from '../../types/fantasyLeague';
import PlayerProfileModal from '../player/PlayerProfileModal';
import FantasyRoundsList from './FantasyRoundsList';
import { Gender } from '../../types/athletes';
import { LoadingState } from '../ui/LoadingState';
import MyTeamViewStateProvider from './my-team/MyTeamStateProvider';
import TeamHistoryProvider from '../../providers/fantasy-teams/TeamHistoryProvider';
import { useAuth } from '../../contexts/AuthContext';
import { useTeamHistory } from '../../hooks/fantasy/useTeamHistory';
import { isLeagueRoundLocked } from '../../utils/leaguesUtils';
import { useFantasyLeagueGroup } from '../../hooks/leagues/useFantasyLeagueGroup';
import FantasyLeagueTeamProvider from './my-team/FantasyLeagueTeamProvider';

/** Renders the my team tab  */
export default function MyTeamsTab({ onEditChange }: { onEditChange?: (isEditing: boolean) => void }) {
  const [tabScene, setTabScene] = useState<'fantasy-rounds' | 'creating-team' | 'team-created'>(
    () => {
      try {
        const params = new URLSearchParams(window.location.search);
        const journeyInitial = params.get('journey');
        const hasDirectTeamTarget = !!(params.get('teamId') || params.get('roundId'));
        if (journeyInitial === 'my-team' && hasDirectTeamTarget) {
          return 'team-created';
        }
      } catch (e) { console.log("Error with init tab scene ", e) }
      return 'fantasy-rounds';
    }
  );

  const { authUser } = useAuth();


  return (
    <TeamHistoryProvider
      user={authUser}
    >
      <MyTeamModeSelector />
    </TeamHistoryProvider>
  )


  // Render the main content based on the current tab scene
  const renderContent = () => {
    // When deep-linking into a specific team, show a loader until the team is ready
    if (tabScene === 'team-created' && (!selectedRound || !selectedTeam)) {
      return <LoadingState />;
    }

    if (tabScene === 'fantasy-rounds') {
      return (
        <FantasyRoundsList
          rounds={currentRound ? [currentRound] : []}
          handleCreateTeam={handleCreateTeam}
          handlePlayerClick={handlePlayerClick}
          handleViewTeam={handleViewTeam}
          refreshRounds={refreshRounds}
        />
      );
    }

    if (tabScene === 'creating-team') {
      return (
        <CreateMyTeam
          leagueRound={selectedRound ?? undefined}
          onBack={() => setTabScene('fantasy-rounds')}
          leagueConfig={leagueConfig}
          onViewTeam={() => setTabScene('team-created')}
          onTeamCreated={(team: IFantasyLeagueTeam) => {
            // Optimistically update the teams for the current round

            setJourney('');

            if (selectedRound) {
              setRoundIdToTeams(prev => ({
                ...prev,
                [selectedRound.id]: [...(prev[selectedRound.id] || []), team],
              }));
              setSelectedRound(selectedRound);
            }

            // Set the selected team and trigger a background refresh
            setSelectedTeam(team);
            setRefreshKey(prev => prev + 1);
          }}
        />
      );
    }

    if (tabScene === 'team-created' && selectedRound && selectedTeam) {
      return (
        <MyTeamViewStateProvider team={selectedTeam} >
          <FantasyTeamView
            leagueRound={selectedRound}
            leagueConfig={leagueConfig}
            team={selectedTeam}
            onBack={() => setTabScene('fantasy-rounds')}
            onEditChange={onEditChange}
            onTeamUpdated={async () => {
              if (selectedRound?.id) {
                return fetchTeamsForCurrentRound(selectedRound.id);
              }
              return Promise.resolve();
            }}
          />
        </MyTeamViewStateProvider>
      );
    }

    return <div className="p-4 text-sm text-gray-500 dark:text-gray-400">Loading...</div>;
  };

  return (
    <>
      {renderContent()}

      {/* Player Profile Modal */}
      {selectedPlayer && (
        <PlayerProfileModal
          isOpen={!!selectedPlayer}
          onClose={() => setSelectedPlayer(null)}
          player={{
            ...selectedPlayer,
            tracking_id: selectedPlayer.athlete_id,
            athstat_firstname: selectedPlayer.player_name,
            gender: selectedPlayer.gender as Gender,
            hidden: false,
            position: selectedPlayer.position,
            team_id: selectedPlayer.athlete_team_id ?? '',
            team: {
              athstat_name: selectedPlayer.team_name || '',
              athstat_id: selectedPlayer.athlete_team_id ?? '',
              image_url: selectedPlayer.team_logo,
              source_id: '',
              organization: '1',
              sport: '1',
            },
            image_url: selectedPlayer.image_url,
            power_rank_rating: selectedPlayer.power_rank_rating,
          }}
        />
      )}
    </>
  );
}

type ViewMode = "create-team" | "pitch-view" | "no-team-locked" | "error";

/** Component that selects between showing the pitch view or showing the create team view  */
function MyTeamModeSelector() {

  const { round, roundTeam } = useTeamHistory();
  const { leagueConfig } = useFantasyLeagueGroup();

  const isLocked = round && isLeagueRoundLocked(round);

  const viewMode: ViewMode = useMemo<ViewMode>(() => {

    if (round && roundTeam) {
      return "pitch-view"
    }

    if (isLocked && roundTeam === undefined) {
      return "no-team-locked"
    }

    if (!isLocked && roundTeam === undefined) {
      return "create-team";
    }

    return "error";

  }, [isLocked, round, roundTeam]);

  // get the current team and round

  // if user created team, show the pitch view

  // if the round is locked, and didn't create team show the player pitch with empty cards and message that can't create team
  // but should be able to move back in time to see their teams

  // if the user has no team and round is not locked, show the the create team page with the ability to create a team
  // its not just a placeholder card

  return (
    <Fragment>
      <Activity mode={viewMode === "pitch-view"} >
        {roundTeam && (
          <FantasyLeagueTeamProvider
            leagueRound={round}
            team={roundTeam}
          >
            <FantasyTeamView
              leagueConfig={leagueConfig}
              leagueRound={round}
            />
          </FantasyLeagueTeamProvider>
        )}
      </Activity>
    </Fragment>
  )
}