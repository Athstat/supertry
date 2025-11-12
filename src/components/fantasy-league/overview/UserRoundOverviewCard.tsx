import { ArrowRight, Lock } from 'lucide-react';
import { FantasyLeagueTeamWithAthletes, IFantasyLeagueRound } from '../../../types/fantasyLeague';
import BlueGradientCard from '../../shared/BlueGradientCard';
import { TranslucentButton } from '../../shared/buttons/PrimaryButton';
import { Shield } from 'lucide-react';
import { Table } from 'lucide-react';
import LeagueRoundCountdown from '../LeagueCountdown';
import { isLeagueRoundLocked } from '../../../utils/leaguesUtils';
import { useTabView } from '../../shared/tabs/TabView';
import { useNavigate } from 'react-router-dom';

type Props = {
  leagueRound: IFantasyLeagueRound;
  userTeam: FantasyLeagueTeamWithAthletes;
  onViewStandings?: () => void;
  onViewTeam?: () => void;
};

export default function UserRoundOverviewCard({
  leagueRound,
  userTeam,
  onViewTeam,
  onViewStandings,
}: Props) {
  const { navigate } = useTabView();
  const routerNavigate = useNavigate();
  const isLocked = isLeagueRoundLocked(leagueRound);

  const handleViewTeam = () => {
    if (onViewTeam) {
      console.log('Using onViewTeam');
      onViewTeam();
    } else {
      // Deep-link to the My Team tab with a specific team preselected
      const teamId = (userTeam?.team_id ?? userTeam?.team?.id) as string | number | undefined;
      if (teamId) {
        routerNavigate(
          `/league/${leagueRound.fantasy_league_group_id}?journey=my-team&roundId=${leagueRound.id}&teamId=${teamId}`
        );
      }
      // Also switch the TabView immediately when already inside the league screen
      navigate('my-team');
    }
  };

  const handleViewStandings = () => {
    if (onViewStandings) {
      onViewStandings();
      navigate('standings');
    }
  };

  return (
    <div>
      <BlueGradientCard className="p-4 flex flex-col gap-4 w-full">
        <div className="flex flex-row w-full items-center justify-between">
          <div>
            <h3 className="font-bold ">{userTeam.team?.name || 'My Team'}</h3>
            <div className="flex flex-row items-center gap-1">
              {isLocked && <Lock className="w-4 h-4" />}
              <p className="text-sm">{leagueRound.title}</p>
            </div>
          </div>
        </div>

        {isLocked && Boolean(userTeam.rank) && (
          <div className="flex flex-row items-center justify-center gap-6">
            <div className="flex flex-col items-center justify-center ">
              <p className="font-bold text-4xl">{Math.floor(userTeam.overall_score) || '0'}</p>
              <p className="text-xs">Points</p>
            </div>

            <div className="flex flex-col items-center justify-center ">
              <p className="font-bold text-4xl">{userTeam.rank || '-'}</p>
              <p className="text-xs">Rank</p>
            </div>
          </div>
        )}

        {!isLocked && <LeagueRoundCountdown leagueRound={leagueRound} />}

        <div className="flex flex-row items-center justify-center gap-2">
          <TranslucentButton onClick={handleViewTeam}>
            <Shield className="w-4 h-4" />
            View Team
          </TranslucentButton>

          <TranslucentButton onClick={handleViewStandings}>
            <Table className="w-4 h-4" />
            Standings
          </TranslucentButton>
        </div>
      </BlueGradientCard>
    </div>
  );
}

type NoTeamProps = {
  leagueRound: IFantasyLeagueRound;
  onPickTeam?: () => void;
  onHandleViewStandings?: () => void;
};

export function NoTeamRoundOverviewCard({
  leagueRound,
  onPickTeam,
  onHandleViewStandings,
}: NoTeamProps) {
  const hasLocked = isLeagueRoundLocked(leagueRound);
  //const hasEnded = hasLeagueRoundEnded(leagueRound);
  const { navigate } = useTabView();
  const routerNavigate = useNavigate();

  const handlePickTeam = () => {
    if (onPickTeam) {
      onPickTeam();
    } else {
      routerNavigate(`/league/${leagueRound.fantasy_league_group_id}?journey=team-creation`);
      // Also switch the tab immediately to My Teams so the user sees the creation flow right away
      navigate('my-team');
    }
  };

  const handleViewStandings = () => {
    if (onHandleViewStandings) {
      onHandleViewStandings();
    } else {
      navigate('standings');
    }
  };

  console.log('league round title: ', leagueRound.title);

  return (
    <div>
      <BlueGradientCard className="p-4 flex flex-col gap-4 w-full">
        <div className="flex flex-row w-full items-center justify-between">
          <div className="flex flex-row items-center gap-2">
            <Lock />
            <h3 className="font-bold text-xl">{leagueRound.title}</h3>
          </div>
        </div>

        {!hasLocked && (
          <div className="flex flex-col gap-3">
            <p>You haven't picked a team yet</p>

            <LeagueRoundCountdown leagueRound={leagueRound} />
          </div>
        )}

        {hasLocked && leagueRound.title === 'Finals Week' && (
          <div>
            <p>
              Oops! The deadline passed, and you didn’t set a team this round. No worries — get
              ready for the next season!
            </p>
          </div>
        )}

        {hasLocked && leagueRound.title !== 'Finals Week' && (
          <div>
            <p>
              Whoops! The gates just closed and you didn't set a team this round. Don't worry —
              you'll be back on the next round.
            </p>
          </div>
        )}

        {!hasLocked && (
          <div className="flex flex-row items-center justify-center gap-2">
            <TranslucentButton onClick={handlePickTeam}>
              {/* <Shield className='w-4 h-4' /> */}
              Pick Team
              <ArrowRight className="w-4 h-4" />
            </TranslucentButton>
          </div>
        )}

        {hasLocked && (
          <div className="flex flex-row items-center justify-center gap-2">
            <TranslucentButton onClick={handleViewStandings}>
              {/* <Shield className='w-4 h-4' /> */}
              View Standings
              <ArrowRight className="w-4 h-4" />
            </TranslucentButton>
          </div>
        )}
      </BlueGradientCard>
    </div>
  );
}
