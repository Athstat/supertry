import { ArrowLeft } from "lucide-react";
import CircleButton from "../../components/ui/buttons/BackButton";
import PageView from "../../components/ui/containers/PageView";
import { useNavigate, useParams } from "react-router-dom";
import { useHideBottomNavBar, useHideTopNavBar } from "../../hooks/navigation/useNavigationBars";
import { FantasyLeagueStandingsTab } from "../../components/fantasy_league/standings/FantasyLeagueStandingsTab";
import RoundedCard from "../../components/ui/cards/RoundedCard";
import FantasyLeagueGroupDataProvider from "../../providers/fantasy_leagues/FantasyLeagueGroupDataProvider";
import FantasyLeagueHeader from "../../components/fantasy_league/header/FantasyLeagueHeader";
import { TabSwitchContainer, TabSwitchOption } from "../../components/ui/buttons/TabSwitchOption";
import { Activity } from "react";
import FantasyLeagueDetailsTab from "../../components/fantasy_league/commissioner/FantasyLeagueDetailsTab";
import { useFantasyLeagueScreen } from "../../hooks/fantasy/useFantasyLeagueScreen";
import { FantasyLeagueViewMode } from "../../types/fantasyLeague";
import FantasyLeagueScreenProvider from "../../contexts/fantasy/FantasyLeagueScreenContext";
import { EditLeagueBannerModal } from "../../components/fantasy_league/commissioner/EditLeagueBannerModal";
import { EditLeagueInfoModal } from "../../components/fantasy_league/commissioner/EditLeagueInfoModal";
import EditLeagueLogoModal from "../../components/fantasy_league/commissioner/EditLeagueLogoModal";
import { useFantasyLeagueGroup } from "../../hooks/leagues/useFantasyLeagueGroup";
import ImageUploadModal from "../../components/ui/forms/images/ImageUploadModal";

/** Renders a fantasy League screen */
export default function FantasyLeagueScreen() {

    const { leagueId } = useParams();
    return (
        <FantasyLeagueGroupDataProvider
            leagueId={leagueId}
            loadingFallback={<LoadingSkeleton />}
        >
            <FantasyLeagueScreenProvider>
                <Content />
            </FantasyLeagueScreenProvider>
        </FantasyLeagueGroupDataProvider>
    )
}


function Content() {

    const navigate = useNavigate();
    const { viewMode, setViewMode } = useFantasyLeagueScreen();

    const handleChangeViewMode = (newMode?: string) => {
        if (newMode) {
            setViewMode(newMode as FantasyLeagueViewMode);
        }
    }

    const handleBack = () => {
        navigate(`/leagues`);
    }

    useHideTopNavBar();
    useHideBottomNavBar();

    return (
        <PageView className=" flex flex-col gap-0 overflow-x-hidden" >
            <FantasyLeagueHeader handleBack={handleBack} />

            <div className="px-4 flex flex-row mt-10 items-center justify-center" >
                <TabSwitchContainer className="w-full" >
                    <TabSwitchOption
                        label="Standings"
                        value="standings"
                        onSelect={handleChangeViewMode}
                        current={viewMode}
                    />

                    <TabSwitchOption
                        label="Details"
                        value="details"
                        onSelect={handleChangeViewMode}
                        current={viewMode}
                    />
                </TabSwitchContainer>
            </div>

            <Activity mode={viewMode === 'standings' ? 'visible' : 'hidden'} >
                <FantasyLeagueStandingsTab />
            </Activity>

            <Activity mode={viewMode === 'details' ? 'visible' : 'hidden'} >
                <FantasyLeagueDetailsTab />
            </Activity>

            <Modals />

            <ImageUploadModal 
                title="Edit Logo"
            />

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
            <div className="flex px-4 relative flex-col w-full min-h-[50px]" >

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
            </div>

            <div className="flex flex-col gap-4 px-4 " >
                <RoundedCard className="w-full mt-6 h-[45px] rounded-full animate-pulse border-none" />

                <div className="flex flex-row justify-between items-center" >
                    <RoundedCard className="w-[200px] h-[40px] animate-pulse border-none" />
                    <RoundedCard className="w-[100px] h-[40px] animate-pulse border-none" />
                </div>
                <RoundedCard className="w-full h-[700px] animate-pulse border-none" />
            </div>

        </PageView>
    )
}

function Modals() {

    const {league} = useFantasyLeagueGroup();
    const { showEditBanner, showEditInfo, showEditLogo, toggleEditBanner, toggleEditLogo, toggleShowEditInfo } = useFantasyLeagueScreen();

    return (
        <>
            <EditLeagueInfoModal
                isOpen={showEditInfo}
                onClose={toggleShowEditInfo}
                key={league?.id}
            />

            <EditLeagueBannerModal
                isOpen={showEditBanner}
                onClose={toggleEditBanner}
            />

            <EditLeagueLogoModal
                isOpen={showEditLogo}
                onClose={toggleEditLogo}
            />
        </>
    )
}