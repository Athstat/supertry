import { ArrowLeft } from "lucide-react";
import CircleButton from "../../components/shared/buttons/BackButton";
import PageView from "../PageView";
import { useNavigate, useParams } from "react-router-dom";
import FantasyLeagueGroupDataProvider from "../../components/fantasy-league/providers/FantasyLeagueGroupDataProvider";
import { useFantasyLeagueGroup } from "../../hooks/leagues/useFantasyLeagueGroup";
import { JoinOrInviteButton } from "../../components/fantasy-league/buttons/JoinLeagueButton";
import { useHideTopNavBar } from "../../hooks/navigation/useNavigationBars";
import { LeagueStandings } from "../../components/fantasy-league/LeagueStandings";
import RoundedCard from "../../components/shared/RoundedCard";


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

    const { league } = useFantasyLeagueGroup();

    const handleBack = () => {
        navigate(`/leagues`);
    }

    useHideTopNavBar();


    return (
        <PageView className="pt-6 flex flex-col gap-4" >
            <div className="flex px-4 flex-row items-center justify-between" >
                <div>
                    <CircleButton
                        onClick={handleBack}
                    >
                        <ArrowLeft />
                    </CircleButton>
                </div>

                <div>
                    <p>{league?.title}</p>
                </div>

                <JoinOrInviteButton />
            </div>

            <LeagueStandings />
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