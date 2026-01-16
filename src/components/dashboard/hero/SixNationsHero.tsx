import { useAuth } from '../../../contexts/AuthContext';
import { useFantasyLeagueGroup } from '../../../hooks/leagues/useFantasyLeagueGroup';
import { useUserRoundTeam } from '../../../hooks/fantasy/useUserRoundTeam';
import { DashboardHeroLoadingSkeleton, DashboardHeroFrame, DashboardHeroHeader, DashboardHeroScoreSection, DashboardHeroCTASection } from './DashboardHeroSections';
import { useFeaturedLeague } from '../../../hooks/leagues/useFeaturedLeague';
import FantasyLeagueGroupDataProvider from '../../../providers/fantasy_leagues/FantasyLeagueGroupDataProvider';

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
    return <DashboardHeroLoadingSkeleton />;
  }

  return (
    <DashboardHeroFrame 
        imageUrl={'/images/dashboard/6nations_banner_bg.png'} 
        hideBeastImage
    >
      <DashboardHeroHeader title='PLAY 6NATIONS FANTASY' />
      <DashboardHeroScoreSection roundTeam={roundTeam} />
      <DashboardHeroCTASection 
        roundTeam={roundTeam}
        deadlineText='Competiton Deadline'
    />
    </DashboardHeroFrame>
  )
}

