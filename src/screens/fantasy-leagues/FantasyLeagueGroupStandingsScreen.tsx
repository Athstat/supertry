import { ArrowLeft, Share2 } from "lucide-react";
import CircleButton from "../../components/shared/buttons/BackButton";
import PageView from "../PageView";
import { useParams } from "react-router-dom";
import FantasyLeagueGroupDataProvider from "../../components/fantasy-league/providers/FantasyLeagueGroupDataProvider";
import { useFantasyLeagueGroup } from "../../hooks/leagues/useFantasyLeagueGroup";
import JoinLeagueButton from "../../components/fantasy-league/buttons/JoinLeagueButton";
import PrimaryButton from "../../components/shared/buttons/PrimaryButton";
import { useShareLeague } from "../../hooks/leagues/useShareLeague";
import { useHideTopNavBar } from "../../hooks/navigation/useNavigationBars";
import { LeagueStandings } from "../../components/fantasy-league/LeagueStandings";
import { useNavigateBack } from "../../hooks/web/useNavigateBack";


export default function FantasyLeagueGroupStandingsScreen() {

    const { leagueId } = useParams();

    return (
        <FantasyLeagueGroupDataProvider
            leagueId={leagueId}
        >
            <Content />
        </FantasyLeagueGroupDataProvider>
    )
}


function Content() {

    const { league, userMemberRecord } = useFantasyLeagueGroup();
    const isMember = userMemberRecord !== undefined;
    const { handleShare } = useShareLeague(league);

    const {hardPop} = useNavigateBack();
    
    const handleBack = () => {
        hardPop(`/leagues`);
    }

    useHideTopNavBar();

    return (
        <PageView className="pt-4" >
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

                {league && <div>
                    {!isMember && <JoinLeagueButton league={league} />}

                    {isMember && (
                        <PrimaryButton onClick={handleShare}>
                            {/* <Plus className="w-4 h-4" /> */}
                            <Share2 className="w-4 h-4" />
                            Invite
                        </PrimaryButton>
                    )}
                </div>}
            </div>

            <LeagueStandings />
        </PageView>
    )
}
