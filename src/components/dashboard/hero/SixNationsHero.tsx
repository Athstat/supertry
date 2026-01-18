import { useAuth } from '../../../contexts/AuthContext';
import { useFantasyLeagueGroup } from '../../../hooks/leagues/useFantasyLeagueGroup';
import { useUserRoundTeam } from '../../../hooks/fantasy/useUserRoundTeam';
import { DashboardHeroLoadingSkeleton, DashboardHeroFrame, DashboardHeroHeader, DashboardHeroScoreSection, DashboardHeroCTASection } from './DashboardHeroSections';
import { useFeaturedLeague } from '../../../hooks/leagues/useFeaturedLeague';
import FantasyLeagueGroupDataProvider from '../../../providers/fantasy_leagues/FantasyLeagueGroupDataProvider';
import TrophyStartIcon from '../../ui/icons/TrophyStartIcon';

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
            imageUrl={'https://dp7xhssw324ru.cloudfront.net/6nations_banner_bg.png.png'}
            cornerImageUrl='/images/dashboard/rugby_ball.png'
            cornerImageClassName='w-28 h-28'
        >
            <DashboardHeroHeader title='PLAY SIX NATIONS FANTASY' />
            <DashboardHeroScoreSection
                roundTeam={roundTeam}
            >
                <div className='bg-black/80 rounded-xl w-[95%] py-4 h-fit flex flex-col items-center justify-center gap-2' >
                    <div className='flex flex-col border-b-2 border-[#D94204] w-[40%] pb-2 items-center justify-center' >
                        <TrophyStartIcon width='30' height='30' />
                    </div>

                    <div className='w-full items-center justify-center flex flex-row' >
                        <p className='text-lg text-white max-w-[80%] font-light text-center' style={{ fontFamily: 'Oswald, sans-serif' }} >
                            <strong className='text-[#D94204] font-normal ' >Win Tickets</strong> to the EPRC Champions Cup Final (2026) in Bilbao, Spain
                        </p>
                    </div>
                </div>
            </DashboardHeroScoreSection>
            <DashboardHeroCTASection
                roundTeam={roundTeam}
                deadlineText='Game Starts In:'
                hideVerboseInstructions
            />
        </DashboardHeroFrame>
    )
}

