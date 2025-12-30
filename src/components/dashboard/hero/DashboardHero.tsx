import { useAuth } from '../../../contexts/AuthContext';
import FantasyLeagueGroupDataProvider from '../../fantasy-league/providers/FantasyLeagueGroupDataProvider';
import { useFantasyLeagueGroup } from '../../../hooks/leagues/useFantasyLeagueGroup';
import { useUserRoundTeam } from '../../../hooks/fantasy/useUserRoundTeam';
import { DashboardHeroLoadingSkeleton, DashboardHeroFrame, DashboardHeroHeader, DashboardHeroScoreSection, DashboardHeroCTASection } from './DashboardHeroSections';
import { useFeaturedLeague } from '../../../hooks/leagues/useFeaturedLeague';

/** Renders the dashboard hero */
export default function DashboardHero() {

  const {featuredLeague} = useFeaturedLeague();

  return (
    <FantasyLeagueGroupDataProvider
      leagueId={featuredLeague?.id}
      loadingFallback={<DashboardHeroLoadingSkeleton />}
      fetchMembers={false}
    >
      <Content/>
    </FantasyLeagueGroupDataProvider>
  )
}

function Content() {
  const { authUser } = useAuth();

  const {  league, currentRound: currentGameweek, isLoading: loadingGroup } = useFantasyLeagueGroup();

  const { roundTeam, isLoading: loadingRoundTeam } = useUserRoundTeam(currentGameweek?.id, authUser?.kc_id);
  const isLoading = loadingGroup || loadingRoundTeam;

  if (isLoading) {
    return (
      <DashboardHeroLoadingSkeleton />
    );
  }

  if (!league) {
    return null;
  }

  return (
    <DashboardHeroFrame>
      <DashboardHeroHeader />
      <DashboardHeroScoreSection roundTeam={roundTeam} />
      <DashboardHeroCTASection roundTeam={roundTeam} />
    </DashboardHeroFrame>
  )
}

