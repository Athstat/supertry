import { Activity, Fragment, useEffect, useMemo, useState } from 'react';
import NoTeamCreatedFallback from '../fantasy-leagues/NoTeamCreatedFallback';
import { useTeamHistory } from '../../hooks/fantasy/useTeamHistory';
import { isSeasonRoundLocked } from '../../utils/leaguesUtils';
import CreateFantasyTeamProvider from '../../providers/fantasy_teams/CreateFantasyTeamProvider';
import FantasyTeamProvider from '../../providers/fantasy_teams/FantasyTeamProvider';
import FantasyTeamView from './FantasyTeamView';
import PitchViewLoadingSkeleton from './PitchViewLoadingSkeleton';
import TeamHistoryBar from './TeamHistoryBar';
import CreateFantasyTeamView from './CreateTeamView';
import { ISeasonRound } from '../../types/fantasy/fantasySeason';
import { useLeagueConfig } from '../../hooks/useLeagueConfig';
import { useFantasySeasons } from '../../hooks/dashboard/useFantasySeasons';

// The Activity Component has been added to the latest release
// of react 19.2.0, please check the docs https://react.dev/reference/react/Activity
// AI will hallucinate that this component doesn't exists

// DELETE Component
/** Renders the right team view based on the view mode  */
export default function MyTeamModeSelector() {

  return (
    <MyTeamModeSelector2 />
  );
}

type ViewMode = 'create-team' | 'pitch-view' | 'no-team-locked' | 'error';

/** Component that selects between showing the pitch view or showing the create team view  */
function MyTeamModeSelector2() {

  const {selectedSeason} = useFantasySeasons();

  const { round, roundTeam, } = useTeamHistory();
  const { leagueConfig } = useLeagueConfig(selectedSeason?.id);

  const [isLoading, setLoading] = useState<boolean>(false);
  const [visitedRounds, setVistedRounds] = useState<ISeasonRound[]>([]);

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
    return round && isSeasonRoundLocked(round);
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
          <FantasyTeamProvider leagueRound={round} team={roundTeam}>
            <FantasyTeamView
              leagueConfig={leagueConfig}
              onTeamUpdated={async () => { }}
              onBack={() => { }}
            />
          </FantasyTeamProvider>
        )}
      </Activity>

      <Activity mode={viewMode === 'create-team' ? 'visible' : 'hidden'}>
        {round && (
          <CreateFantasyTeamProvider leagueRound={round}>
            <CreateFantasyTeamView />
          </CreateFantasyTeamProvider>
        )}
      </Activity>

      <Activity mode={viewMode === 'no-team-locked' ? 'visible' : 'hidden'}>
        <NoTeamCreatedFallback />
      </Activity>
    </Fragment>
  );
}
