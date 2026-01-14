import { ArrowLeft } from "lucide-react";
import CircleButton from "../../components/ui/buttons/BackButton";
import PageView from "../../components/ui/containers/PageView";
import { useNavigate, useParams } from "react-router-dom";
import { useHideTopNavBar } from "../../hooks/navigation/useNavigationBars";
import { FantasyLeagueStandings } from "../../components/fantasy_league/standings/FantasyLeagueStandings";
import RoundedCard from "../../components/ui/cards/RoundedCard";
import FantasyLeagueGroupDataProvider from "../../providers/fantasy_leagues/FantasyLeagueGroupDataProvider";
import LeagueStandingsHeader from "../../components/fantasy_league/standings/LeagueStandingsHeader";


/** Renders League standings screen */
export default function LeagueStandingsScreen() {

    const { leagueId } = useParams();
    return (
        <FantasyLeagueGroupDataProvider
            leagueId={leagueId}
            loadingFallback={<LoadingSkeleton />}
            skipCache
        >
            <Content />
        </FantasyLeagueGroupDataProvider>
    )
}


function Content() {

    const navigate = useNavigate();

    const handleBack = () => {
        navigate(`/leagues`);
    }

    useHideTopNavBar();

    return (
        <PageView className="pt-6 flex flex-col gap-4" >
            <LeagueStandingsHeader handleBack={handleBack} />
            <FantasyLeagueStandings />
        </PageView>
    )
}


function LoadingSkeleton() {

    const navigate = useNavigate();

    const handleBack = () => {
        navigate(`/leagues`);
    }

    useHideTopNavBar();

    return (
        <PageView className="pt-4 flex flex-col gap-4" >
            <div className="flex px-4 flex-row items-center justify-between" >
                <div>
                    <CircleButton
                        onClick={handleBack}
                    >
                        <ArrowLeft />
                    </CircleButton>
                </div>

                <div>
                    <RoundedCard className="w-[160px] h-[40px] animate-pulse border-none" ></RoundedCard>
                </div>


                <RoundedCard className="w-[50px] h-[40px] animate-pulse border-none" ></RoundedCard>
            </div>

            <div className="flex flex-col gap-4 px-4 " >
                <RoundedCard className="w-full h-[60px] animate-pulse border-none" />
                <RoundedCard className="w-full h-[500px] animate-pulse border-none" />
            </div>

        </PageView>
    )
}