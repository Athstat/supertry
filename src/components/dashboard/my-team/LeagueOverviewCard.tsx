import useSWR from 'swr';
import { FantasyLeagueGroup } from '../../../types/fantasyLeagueGroups';
import { swrFetchKeys } from '../../../utils/swrKeys';
import FantasyLeagueGroupDataProvider from '../../fantasy-league/providers/FantasyLeagueGroupDataProvider';
import { useFantasyLeagueGroup } from '../../../hooks/leagues/useFantasyLeagueGroup';
import { useAuth } from '../../../contexts/AuthContext';
import { fantasyLeagueGroupsService } from '../../../services/fantasy/fantasyLeagueGroupsService';
import { leagueService } from '../../../services/leagueService';
import { LoadingState } from '../../ui/LoadingState';
import BlueGradientCard from '../../shared/BlueGradientCard';
import { Info, Lock, Plus, Trophy } from 'lucide-react';
import { useMemo } from 'react';
import { isLeagueRoundLocked } from '../../../utils/leaguesUtils';
import RoundedCard from '../../shared/RoundedCard';
import SecondaryText from '../../shared/SecondaryText';
import PrimaryButton from '../../shared/buttons/PrimaryButton';
import { useNavigate } from 'react-router-dom';
import LeagueRoundCountdown from '../../fantasy-league/LeagueCountdown';
import WarningCard from '../../shared/WarningCard';

type Props = {
  league: FantasyLeagueGroup;
};

/** Renders a league overview card */
export default function SmallLeagueOverviewCard({ league }: Props) {
  return (
    <FantasyLeagueGroupDataProvider leagueId={league.id}>
      <Content league={league} />
    </FantasyLeagueGroupDataProvider>
  );
}

function Content({ league }: Props) {
  const { authUser } = useAuth();
  const { currentRound } = useFantasyLeagueGroup();

  const key = swrFetchKeys.getUserFantasyLeagueRoundTeam(
    league.id,
    currentRound?.id ?? 0,
    authUser?.kc_id ?? 'fallback'
  );
  const { data: userTeam, isLoading: loadingUserTeam } = useSWR(key, () =>
    leagueService.getUserRoundTeam(currentRound?.id ?? 0, authUser?.kc_id ?? '')
  );

  console.log('authUser: ', authUser);

  const standingsKey = swrFetchKeys.getFantasyLeagueGroupStandings(league.id);
  const { data: standings, isLoading: loadingStandings } = useSWR(standingsKey, () =>
    fantasyLeagueGroupsService.getGroupStandings(league.id)
  );

  const navigate = useNavigate();

  const isLoading = loadingStandings || loadingUserTeam;

  if (isLoading) {
    <LoadingState />;
  }

  const userStanding = useMemo(() => {
    if (standings) {
      return standings.find(s => {
        return s.user_id === authUser?.kc_id;
      });
    }

    return undefined;
  }, [standings, authUser]);

  const locked = currentRound && isLeagueRoundLocked(currentRound);

  const goToLeague = () => {
    navigate(`/league/${league.id}`);
  };

  const dateNow = new Date();
  const deadline = new Date(currentRound?.join_deadline ?? new Date());
  const hasDeadlinePassed = dateNow.valueOf() >= deadline.valueOf();

  const showCountDown = currentRound?.join_deadline && !hasDeadlinePassed;

  return (
    <div className="flex  flex-col gap-4">
      <div className="flex flex-row items-center justify-between">
        <div className="flex flex-row items-center gap-2">
          <Trophy className="w-5 h-5" />
          <h1 className="font-bold">{league.title}</h1>
          {/* <NewTag /> */}
        </div>

        <div>
          {/* <button onClick={goToLeague}>
            <ArrowRight />
          </button> */}
        </div>
      </div>

      <BlueGradientCard className="flex cursor-pointer flex-col p-6 gap-2 " onClick={goToLeague}>
        {(currentRound &&
          <div className="flex flex-row items-center justify-between">
            <div className="flex flex-row items-center gap-2">
              <p className="font-bold ">{league.season.name} - {currentRound?.title}</p>
            </div>
          </div>
        )}

        <div className="flex text-xs font-semibold flex-row items-center gap-2">
          {currentRound && userStanding && (
            <p className="bg-primary-50 px-2 py-0.5 rounded-xl text-blue-500">
              <p className="">{currentRound.title}</p>
            </p>
          )}

          {userStanding && (
            <div className="bg-primary-50 px-2 py-0.5 rounded-xl text-blue-500">
              <p>Overall Rank #{userStanding?.rank}</p>
            </div>
          )}

          {locked && (
            <div className="bg-primary-50 px-2 py-0.5 rounded-xl text-blue-500">
              <p>Points {userTeam?.overall_score.toFixed(0) ?? 0}</p>
            </div>
          )}

          {!userStanding && currentRound && !hasDeadlinePassed && (
            <div>
              <p className="text-lg font-medium">⏰ {currentRound.title} Deadline</p>
            </div>
          )}
        </div>

        <div>
          {showCountDown && <LeagueRoundCountdown leagueRound={currentRound} />}

          {hasDeadlinePassed && (
            <div>
              <p className="text-sm">
                Tick tock, time’s up! The gates are closed, and your fantasy fate? Oh, it’s coming
                for better or way, way worse. 😎
              </p>
            </div>
          )}
        </div>
      </BlueGradientCard>

      {!locked && !userTeam && !isLoading && <NotTeamCreated />}

      {locked && !userTeam && <NotTeamCreatedLeagueLocked />}
    </div>
  );
}

function NotTeamCreated() {
  const navigate = useNavigate();
  const { currentRound } = useFantasyLeagueGroup();

  if (!currentRound) return;

  const goToCreateTeam = () => {
    navigate(`/league/${currentRound.fantasy_league_group_id}?journey=team-creation`);
  };

  return (
    <WarningCard className="px-4 py-2 text-center gap-4  flex flex-row items-center justify-between">
      <div className="flex flex-row items-center gap-2">
        <Info className="w-4 h-4" />
        <p className="text-xs text-left">You haven't picked a team for {currentRound.title} yet</p>
      </div>

      <PrimaryButton onClick={goToCreateTeam} className="w-fit text-xs px-2">
        {/* <p className='text-[10px]' >Pick Team</p> */}
        <Plus className="w-4 h-4" />
      </PrimaryButton>
    </WarningCard>
  );
}

function NotTeamCreatedLeagueLocked() {
  const navigate = useNavigate();
  const { currentRound } = useFantasyLeagueGroup();

  if (!currentRound) return;

  const goToCreateTeam = () => {
    navigate(`/league/${currentRound.fantasy_league_group_id}?journey=team-creation`);
  };

  return (
    <RoundedCard className="p-6 text-center h-[200px] gap-4 border-dotted border-4 flex flex-col items-center justify-center">
      <SecondaryText className="text-base">
        You can't pick a team because, round '{currentRound.title}', has been locked{' '}
      </SecondaryText>

      <PrimaryButton disabled={true} onClick={goToCreateTeam} className="w-fit px-6 py-2">
        <p>Pick Team</p>
        <Lock className="w-4 h-4" />
      </PrimaryButton>
    </RoundedCard>
  );
}
