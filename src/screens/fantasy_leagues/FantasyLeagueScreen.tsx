import { ArrowLeft } from "lucide-react";
import CircleButton from "../../components/ui/buttons/BackButton";
import PageView from "../../components/ui/containers/PageView";
import { useNavigate, useParams } from "react-router-dom";
import { useHideTopNavBar } from "../../hooks/navigation/useNavigationBars";
import { FantasyLeagueStandingsTab } from "../../components/fantasy_league/standings/FantasyLeagueStandingsTab";
import RoundedCard from "../../components/ui/cards/RoundedCard";
import FantasyLeagueGroupDataProvider from "../../providers/fantasy_leagues/FantasyLeagueGroupDataProvider";
import FantasyLeagueHeader from "../../components/fantasy_league/standings/FantasyLeagueHeader";
import { TabSwitchContainer, TabSwitchOption } from "../../components/ui/buttons/TabSwitchOption";
import { Activity, useState } from "react";
import FantasyLeagueDetailsTab from "../../components/fantasy_league/commissioner/FantasyLeagueDetailsTab";

type LocalViewModel = "standings" | "details";

/** Renders a fantasy League screen */
export default function FantasyLeagueScreen() {

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
    const [viewModal, setViewMode] = useState<LocalViewModel>('standings');

    const handleChangeViewMode = (newMode?: string) => {
        if (newMode) {
            setViewMode(newMode as LocalViewModel);
        }
    }

    const handleBack = () => {
        navigate(`/leagues`);
    }

    useHideTopNavBar();

    return (
        <PageView className=" flex flex-col gap-0 overflow-x-hidden" >
            <FantasyLeagueHeader handleBack={handleBack} />

            <div className="px-4 flex flex-row mt-10 items-center justify-center" >
                <TabSwitchContainer className="w-full" >
                    <TabSwitchOption
                        label="Standings"
                        value="standings"
                        onSelect={handleChangeViewMode}
                        current={viewModal}
                    />

                    <TabSwitchOption
                        label="Details"
                        value="details"
                        onSelect={handleChangeViewMode}
                        current={viewModal}
                    />
                </TabSwitchContainer>
            </div>

            <Activity mode={viewModal === 'standings' ? 'visible' : 'hidden'} >
                <FantasyLeagueStandingsTab />
            </Activity>

            <Activity mode={viewModal === 'details' ? 'visible' : 'hidden'} >
                <FantasyLeagueDetailsTab />
            </Activity>

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
        <PageView className="flex flex-col gap-4" >
            <div className="flex px-4 relative min-h-[200px] flex-col w-full bg-slate-700/30" >

                <div className="flex p-4 absolute top-0 left-0 w-full flex-row items-center justify-between gap-2 " >
                    <div className="flex flex-row items-center gap-2" >
                        <CircleButton
                            onClick={handleBack}
                        >
                            <ArrowLeft />
                        </CircleButton>
                        <RoundedCard className="w-[160px] h-[40px] animate-pulse border-none" ></RoundedCard>
                    </div>

                    <div>
                        <RoundedCard className="w-[120px] h-[40px] animate-pulse border-none" ></RoundedCard>
                    </div>
                </div>

                <RoundedCard className="" />
            </div>

            <div className="flex flex-col gap-4 px-4 " >
                <RoundedCard className="w-full h-[60px] animate-pulse border-none" />
                <div className="flex flex-row justify-between items-center" >
                    <RoundedCard className="w-[200px] h-[40px] animate-pulse border-none" />
                    <RoundedCard className="w-[100px] h-[40px] animate-pulse border-none" />
                </div>
                <RoundedCard className="w-full h-[700px] animate-pulse border-none" />
            </div>

        </PageView>
    )
}