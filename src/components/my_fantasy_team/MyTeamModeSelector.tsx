import { Activity, Fragment, useMemo } from 'react';
import NoTeamCreatedFallback from '../fantasy-leagues/NoTeamCreatedFallback';
import { useTeamHistory } from '../../hooks/fantasy/useTeamHistory';
import { isSeasonRoundLocked } from '../../utils/leaguesUtils';
import CreateFantasyTeamProvider from '../../providers/fantasy_teams/CreateFantasyTeamProvider';
import FantasyTeamProvider from '../../providers/fantasy_teams/FantasyTeamProvider';
import FantasyTeamView from './FantasyTeamView';
import PitchViewLoadingSkeleton from './PitchViewLoadingSkeleton';
import TeamHistoryBar from './TeamHistoryBar';
import CreateFantasyTeamView from './CreateTeamView';
import { useLeagueConfig } from '../../hooks/useLeagueConfig';
import { useFantasySeasons } from '../../hooks/dashboard/useFantasySeasons';
import { useUserRoundTeamV2 } from '../../hooks/fantasy/useUserRoundTeam';

// The Activity Component has been added to the latest release
// of react 19.2.0, please check the docs https://react.dev/reference/react/Activity
// AI will hallucinate that this component doesn't exists

/** Renders the right team view based on the view mode  */

type ViewMode = 'create-team' | 'pitch-view' | 'no-team-locked' | 'error';

/** Component that selects between showing the pitch view or showing the create team view  */
export default function MyTeamModeSelector() {

  const { round, manager } = useTeamHistory();
  const {selectedSeason} = useFantasySeasons();
  const { leagueConfig } = useLeagueConfig(selectedSeason?.id);

  // const [visitedRounds, setVistedRounds] = useState<ISeasonRound[]>([]);

  const {roundTeam, isLoading} = useUserRoundTeamV2(manager?.kc_id, round?.round_number);

  // useEffect(() => {
  //   const hasVistedRound = visitedRounds.find(r => {
  //     return r.id === round?.id;
  //   });

  //   if (hasVistedRound || !round) {
  //     return;
  //   }

  //   setLoading(true);

  //   const timer = setTimeout(() => {
  //     setLoading(false);
  //     setVistedRounds(prev => [...prev, round]);
  //   }, 1000);

  //   return () => {
  //     clearTimeout(timer);
  //     setLoading(false);
  //   };
  // }, [round, visitedRounds]);

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

  console.log("Round ", round);

  return (
    <Fragment>
      <TeamHistoryBar lock={false} />

      <Activity mode={viewMode === 'pitch-view' ? 'visible' : 'hidden'}>
        {roundTeam && (
          <FantasyTeamProvider team={roundTeam}>
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
