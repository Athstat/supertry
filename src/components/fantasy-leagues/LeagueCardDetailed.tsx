import { Lock } from 'lucide-react';
import { useFetch } from '../../hooks/useFetch';
import { useAuthUser } from '../../hooks/useAuthUser';
import { IFantasyLeagueRound, IFantasyLeagueTeam } from '../../types/fantasyLeague';
import { LoadingState } from '../ui/LoadingState';
import { useNavigate } from 'react-router-dom';
import { leagueService } from '../../services/leagueService';
import { LeagueCardNoTeamPlaceholder } from './league_dashboard_ui/LeagueCardNoTeamPlaceholder';
import LeagueCardMyTeamSection from './league_dashboard_ui/LeagueCardMyTeamSection';
import LeagueTeamsCount from './league_card_small/LeagueTeamsCount';
import { isLeagueLocked } from '../../utils/leaguesUtils';
import LeagueLiveIndicator from './LeagueLiveIndicator';

type Props = {
  league: IFantasyLeagueRound;
};

export default function LeagueCardDetailed({ league }: Props) {
  const user = useAuthUser();
  const navigate = useNavigate();
  const { data, isLoading } = useFetch(
    'user-teams',
    league.id,
    leagueService.fetchParticipatingTeams
  );

  if (isLoading) return <LoadingState />;

  const leagueTeams = data ?? [];
  let teamForLeague: IFantasyLeagueTeam | undefined;
  let teamRank = 0;

  const isLocked = isLeagueLocked(league.join_deadline);

  leagueTeams.forEach((t, index) => {
    const uid = (user as any)?.kc_id ?? (user as any)?.id;
    if (t.user_id === uid) {
      teamForLeague = t;
      teamRank = index + 1;
    }
  });

  const handleLeagueClick = () => {
    navigate(`/league/${league.official_league_id}`, {
      state: { league },
    });
  };

  return (
    <div
      onClick={e => {
        if (e.target === e.currentTarget) {
          console.log('Clicked on empty space');
        }
      }}
      className="bg-white dark:text-white dark:hover:text-slate-50 dark:bg-slate-800/30 dark:hover:bg-slate-800/50 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm transition-all hover:shadow-md"
    >
      {/* Header Section */}

      <div
        onClick={handleLeagueClick}
        className="p-4 lg:p-6 border-gray-100 dark:border-gray-700/50 cursor-pointer"
      >
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 ">
          <div className="space-y-2">
            <h1 className="text-lg md:text-2xl flex flex-row items-center gap-1 font-bold text-gray-900 dark:text-white">
              {isLocked && <Lock className="w-5 h-5" />}
              {league.title}
            </h1>

            <div className="flex flex-row items-center justify-start gap-2">
              <LeagueTeamsCount league={league} />
              <LeagueLiveIndicator league={league} />
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 lg:px-6 pb-4 lg:pb-6">
        <div className="grid grid-cols-1 lg:grid-cols-1 gap-3 lg:gap-5">
          {/* My Team Section */}
          {teamForLeague && (
            <LeagueCardMyTeamSection league={league} rank={teamRank} team={teamForLeague} />
          )}

          {!teamForLeague && <LeagueCardNoTeamPlaceholder league={league} />}
        </div>
      </div>
    </div>
  );
}
