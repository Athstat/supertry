import { useAuth } from '../../../contexts/AuthContext';
import { useFantasyLeagueGroup } from '../../../hooks/leagues/useFantasyLeagueGroup';
import { useUserRoundTeam } from '../../../hooks/fantasy/useUserRoundTeam';
import { DashboardHeroLoadingSkeleton, DashboardHeroFrame, DashboardHeroHeader, DashboardHeroScoreSection, DashboardHeroCTASection } from './DashboardHeroSections';
import { useFeaturedLeague } from '../../../hooks/leagues/useFeaturedLeague';
import FantasyLeagueGroupDataProvider from '../../../providers/fantasy_leagues/FantasyLeagueGroupDataProvider';
import { Trophy } from 'lucide-react';

/** Renders the dashboard hero */
export default function DashboardHero() {

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
        <DashboardHeroFrame
            imageUrl={'/images/dashboard/6nations_banner_bg.png'}
            hideBeastImage
        >
            <DashboardHeroHeader title='PLAY 6NATIONS FANTASY' />
            <DashboardHeroScoreSection
                roundTeam={roundTeam}
            >
                <div className='bg-black/80 rounded-xl w-[95%] py-4 h-fit flex flex-col items-center justify-center gap-2' >
                    <div className='flex flex-col border-b-2 border-[#D94204] w-[40%] pb-2 items-center justify-center' >
                        <Trophy className='text-[#D94204] w-8 h-8' />
                    </div>

                    <div>
                        <p className='text-lg' style={{ fontFamily: 'Oswald, sans-serif' }} >
                            <strong className='text-[#D94204] font-normal ' >Win 2 Tickets</strong> to EPRC Champions Cup Final (2026)
                        </p>
                    </div>
                </div>
            </DashboardHeroScoreSection>
            <DashboardHeroCTASection
                roundTeam={roundTeam}
                deadlineText='Competiton Deadline:'
            />
        </DashboardHeroFrame>
    )
}

