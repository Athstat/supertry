import { Activity, Fragment, useMemo } from 'react';
import CreateMyTeam from './CreateMyTeam';
import FantasyTeamView from './my-team/FantasyTeamView';
import FantasyRoundsList from './FantasyRoundsList';
import TeamHistoryProvider from '../../providers/fantasy-teams/TeamHistoryProvider';
import { useAuth } from '../../contexts/AuthContext';
import { useTeamHistory } from '../../hooks/fantasy/useTeamHistory';
import { isLeagueRoundLocked } from '../../utils/leaguesUtils';
import { useFantasyLeagueGroup } from '../../hooks/leagues/useFantasyLeagueGroup';
import FantasyLeagueTeamProvider from './my-team/FantasyLeagueTeamProvider';
import TeamHistoryBar from '../my-team/TeamHistoryBar';


/** Renders the my team tab  */
export default function MyTeamsTab() {
  const { authUser } = useAuth();

  return (
    <TeamHistoryProvider
      user={authUser}
    >
      <MyTeamModeSelector />
    </TeamHistoryProvider>
  )
}

type ViewMode = "create-team" | "pitch-view" | "no-team-locked" | "error";

/** Component that selects between showing the pitch view or showing the create team view  */
function MyTeamModeSelector() {

  const { round, roundTeam } = useTeamHistory();
  const { leagueConfig } = useFantasyLeagueGroup();

  const isLocked = useMemo(() => {
    return round && isLeagueRoundLocked(round)
  }, [round]);

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
      <TeamHistoryBar />
      
      <Activity mode={viewMode === "pitch-view" ? "visible" : "hidden"} >
        {roundTeam && (
          <FantasyLeagueTeamProvider
            leagueRound={round}
            team={roundTeam}
          >
            <FantasyTeamView
              leagueConfig={leagueConfig}
              leagueRound={round}
              onTeamUpdated={async () => { }}
              onBack={() => { }}
            />
          </FantasyLeagueTeamProvider>
        )}
      </Activity>

      <Activity mode={viewMode === "create-team" ? "visible" : "hidden"} >
        <CreateMyTeam
          leagueRound={round}
          onBack={() => { }}
          leagueConfig={leagueConfig}
          onTeamCreated={() => { }}
        />
      </Activity>

      <Activity mode={viewMode === "no-team-locked" ? "visible" : "hidden"} >
        <FantasyRoundsList
          rounds={round ? [round] : []}
          handleCreateTeam={() => { }}
          handlePlayerClick={() => { }}
          handleViewTeam={() => { }}
          refreshRounds={() => { }}
        />
      </Activity>
    </Fragment>
  )
}