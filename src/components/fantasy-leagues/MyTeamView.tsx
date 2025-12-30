import { Activity, Fragment, useEffect, useMemo, useState } from 'react';
import CreateTeamView from './CreateTeamView';
import FantasyTeamView from './my-team/FantasyTeamView';
import NoTeamCreatedFallback from './NoTeamCreatedFallback';
import { useTeamHistory } from '../../hooks/fantasy/useTeamHistory';
import { isLeagueRoundLocked } from '../../utils/leaguesUtils';
import { useFantasyLeagueGroup } from '../../hooks/leagues/useFantasyLeagueGroup';
import FantasyLeagueTeamProvider from './my-team/FantasyLeagueTeamProvider';
import TeamHistoryBar from './my-team/TeamHistoryBar';
import PitchViewLoadingSkeleton from './my-team/PitchViewLoadingSkeleton';
import CreateFantasyTeamProvider from '../../providers/fantasy-teams/CreateFantasyTeamProvider';
import { IFantasyLeagueRound } from '../../types/fantasyLeague';

/** Renders the my team tab  */
export default function MyTeamView() {

  return (
    <MyTeamModeSelector />
  );
}

type ViewMode = 'create-team' | 'pitch-view' | 'no-team-locked' | 'error';

/** Component that selects between showing the pitch view or showing the create team view  */
function MyTeamModeSelector() {
  const { round, roundTeam } = useTeamHistory();
  const { leagueConfig } = useFantasyLeagueGroup();
  const [isLoading, setLoading] = useState<boolean>(false);
  const [visitedRounds, setVistedRounds] = useState<IFantasyLeagueRound[]>([]);

  useEffect(() => {
    const hasVistedRound = visitedRounds.find(r => {
      return r.id === round?.id;
    });

    if (hasVistedRound || !round) {
      return;
    }

    setLoading(true);

    const timer = setTimeout(() => {
      setLoading(false);
      setVistedRounds(prev => [...prev, round]);
    }, 1000);

    return () => {
      clearTimeout(timer);
      setLoading(false);
    };
  }, [round, visitedRounds]);

  const isLocked = useMemo(() => {
    return round && isLeagueRoundLocked(round);
  }, [round]);

  const viewMode: ViewMode = useMemo<ViewMode>(() => {
    if (round && roundTeam) {
      return 'pitch-view';
    }

    if (isLocked && roundTeam === undefined) {
      return 'no-team-locked';
    }

    if (!isLocked && roundTeam === undefined) {
      return 'create-team';
    }

    return 'error';
  }, [isLocked, round, roundTeam]);

  // Wait for leagueConfig to load to prevent error flash
  if (isLoading) {
    return <PitchViewLoadingSkeleton />;
  }

  return (
    <Fragment>
      <TeamHistoryBar lock={false} />

      <Activity mode={viewMode === 'pitch-view' ? 'visible' : 'hidden'}>
        {roundTeam && (
          <FantasyLeagueTeamProvider leagueRound={round} team={roundTeam}>
            <FantasyTeamView
              leagueConfig={leagueConfig}
              leagueRound={round}
              onTeamUpdated={async () => { }}
              onBack={() => { }}
            />
          </FantasyLeagueTeamProvider>
        )}
      </Activity>

      <Activity mode={viewMode === 'create-team' ? 'visible' : 'hidden'}>
        {round && (
          <CreateFantasyTeamProvider leagueRound={round}>
            <CreateTeamView />
          </CreateFantasyTeamProvider>
        )}
      </Activity>

      <Activity mode={viewMode === 'no-team-locked' ? 'visible' : 'hidden'}>
        <NoTeamCreatedFallback />
      </Activity>
    </Fragment>
  );
}
