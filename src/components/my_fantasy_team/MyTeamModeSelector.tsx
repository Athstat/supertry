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
import { useUserRoundTeam } from '../../hooks/fantasy/useUserRoundTeam';
import MyTeamScreenProvider from '../../contexts/ui/MyTeamScreenContext';


/** Renders the right team view based on the view mode  */

type ViewMode = 'create-team' | 'pitch-view' | 'no-team-locked' | 'error';

/** Component that selects between showing the pitch view or showing the create team view  */
export default function MyTeamModeSelector() {

  const { round, manager } = useTeamHistory();
  const { selectedSeason } = useFantasySeasons();
  const { leagueConfig } = useLeagueConfig(selectedSeason?.id);

  const { roundTeam, isLoading, mutate } = useUserRoundTeam(manager?.kc_id, round?.round_number);

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


  return (
    <Fragment>
      {<TeamHistoryBar lock={viewMode === 'create-team'} />}

      {isLoading && (
        <PitchViewLoadingSkeleton hideHistoryBar />
      )}

      <MyTeamScreenProvider onUpdateTeam={mutate} >
        {!isLoading && <Activity mode={viewMode === 'pitch-view' ? 'visible' : 'hidden'}>
          {roundTeam && (
            <FantasyTeamProvider team={roundTeam}>
              <FantasyTeamView
                leagueConfig={leagueConfig}
                onTeamUpdated={async () => { await mutate() }}
                onBack={() => { }}
                pitchCN='mt-5'
              />
            </FantasyTeamProvider>
          )}
        </Activity>}

        {!isLoading && <Activity mode={viewMode === 'create-team' ? 'visible' : 'hidden'}>
          {round && (
            <CreateFantasyTeamProvider leagueRound={round}>
              <CreateFantasyTeamView />
            </CreateFantasyTeamProvider>
          )}
        </Activity>}

        {!isLoading && <Activity mode={viewMode === 'no-team-locked' ? 'visible' : 'hidden'}>
          <NoTeamCreatedFallback />
        </Activity>}
      </MyTeamScreenProvider>
    </Fragment>
  );
}
