import { useAuth } from '../../../contexts/AuthContext';
import { IFantasySeason } from '../../../types/fantasy/fantasySeason';
import { useMemo } from 'react';
import useSWR from 'swr';
import { fantasySeasonsService } from '../../../services/fantasy/fantasySeasonsService';
import FantasyLeagueGroupDataProvider from '../../fantasy-league/providers/FantasyLeagueGroupDataProvider';
import { useFantasyLeagueGroup } from '../../../hooks/leagues/useFantasyLeagueGroup';
import { useUserRoundTeam } from '../../../hooks/fantasy/useUserRoundTeam';
import { useDelay } from '../../../hooks/useDelay';
import { DashboardHeroLoadingSkeleton, DashboardHeroFrame, DashboardHeroHeader, DashboardHeroScoreSection, DashboardHeroCTASection } from './DashboardHeroSections';

type Props = {
  season?: IFantasySeason;
};

export default function DashboardHero({ season }: Props) {

  const key = season ? `fantasy-season/${season.id}/` : null;
  const { data: featuredLeagues } = useSWR(key, () => fantasySeasonsService.getFeaturedLeagueGroups(season?.id || ''));

  const featuredLeague = useMemo(() => {
    if (featuredLeagues && featuredLeagues.length > 0) {
      return featuredLeagues[0];
    }

    return undefined;
  }, [featuredLeagues]);

  return (
    <FantasyLeagueGroupDataProvider
      leagueId={featuredLeague?.id}
      loadingFallback={<DashboardHeroLoadingSkeleton />}
    >
      <Content season={season} />
    </FantasyLeagueGroupDataProvider>
  )
}

function Content({ season }: Props) {
  const { authUser } = useAuth();

  const { isDelaying } = useDelay(500);
  const { currentRound: currentGameweek, isLoading: loadingGroup } = useFantasyLeagueGroup();

  const { roundTeam, isLoading: loadingRoundTeam } = useUserRoundTeam(currentGameweek?.id, authUser?.kc_id);
  const isLoading = loadingGroup || loadingRoundTeam;

  if (isLoading || isDelaying) {
    return (
      <DashboardHeroLoadingSkeleton />
    );
  }

  if (!season) {
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

