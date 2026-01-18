import { useAuth } from '../../../contexts/AuthContext';
import { useFantasyLeagueGroup } from '../../../hooks/leagues/useFantasyLeagueGroup';
import { useUserRoundTeam } from '../../../hooks/fantasy/useUserRoundTeam';
import { DashboardHeroLoadingSkeleton, DashboardHeroFrame, DashboardHeroHeader, DashboardHeroScoreSection, DashboardHeroCTASection } from './DashboardHeroSections';
import { useFeaturedLeague } from '../../../hooks/leagues/useFeaturedLeague';
import FantasyLeagueGroupDataProvider from '../../../providers/fantasy_leagues/FantasyLeagueGroupDataProvider';
import { useFantasySeasons } from '../../../hooks/dashboard/useFantasySeasons';
import SixNationsHero from './SixNationsHero';

/** Renders the dashboard hero */
export default function DashboardHero() {
  
  const { selectedSeason } = useFantasySeasons();

  if (selectedSeason?.name?.includes('Six Nations 2026')) {
    return (
      <SixNationsHero />
    )
  }

  return (
    <DefaultHero />
  )
}

function DefaultHero() {
  const { featuredLeague } = useFeaturedLeague(); 

  return (
    <FantasyLeagueGroupDataProvider
      leagueId={featuredLeague?.id}
      loadingFallback={<DashboardHeroLoadingSkeleton />}
      fetchMembers={false}
    >
      <Content />
    </FantasyLeagueGroupDataProvider>
  )
}

function Content() {
  const { authUser } = useAuth();

  const { league, currentRound: currentGameweek, isLoading: loadingGroup } = useFantasyLeagueGroup();

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
    <DashboardHeroFrame>
      <DashboardHeroHeader />
      <DashboardHeroScoreSection roundTeam={roundTeam} />
      <DashboardHeroCTASection roundTeam={roundTeam} />
    </DashboardHeroFrame>
  )
}

