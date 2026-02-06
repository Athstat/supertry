import { useUserRoundTeam } from '../../../hooks/fantasy/useUserRoundTeam';
import { DashboardHeroLoadingSkeleton, DashboardHeroFrame, DashboardHeroHeader, DashboardHeroScoreSection, DashboardHeroCTASection } from './DashboardHeroSections';
import { useFantasySeasons } from '../../../hooks/dashboard/useFantasySeasons';
import SixNationsHero from './SixNationsHero';
import { useAuth } from '../../../contexts/auth/AuthContext';

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

  const { authUser } = useAuth();
  const { currentRound } = useFantasySeasons();

  const { roundTeam, isLoading: loadingRoundTeam } = useUserRoundTeam(authUser?.kc_id, currentRound?.round_number);
  const isLoading = loadingRoundTeam;

  if (isLoading) {
    return (
      <DashboardHeroLoadingSkeleton />
    );
  }

  return (
    <DashboardHeroFrame>
      <DashboardHeroHeader />
      <DashboardHeroScoreSection roundTeam={roundTeam} />
      <DashboardHeroCTASection hideVerboseInstructions roundTeam={roundTeam} />
    </DashboardHeroFrame>
  )
}
