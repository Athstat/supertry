import useSWR from "swr";
import { ArrowLeft } from "lucide-react";
import { useParams } from "react-router-dom";
import { swrFetchKeys } from "../../utils/swrKeys";
import { userService } from "../../services/userService";
import PageView from "../../components/ui/containers/PageView";
import RoundedCard from "../../components/ui/cards/RoundedCard";
import CircleButton from "../../components/ui/buttons/BackButton";
import { useNavigateBack } from "../../hooks/web/useNavigateBack";
import { useTeamHistory } from "../../hooks/fantasy/useTeamHistory";
import { useUserRoundTeam } from "../../hooks/fantasy/useUserRoundTeam";
import { useHideTopNavBar } from "../../hooks/navigation/useNavigationBars";
import TeamHistoryBar from "../../components/my_fantasy_team/TeamHistoryBar";
import FantasyTeamView from "../../components/my_fantasy_team/FantasyTeamView";
import { useFantasyLeagueGroup } from "../../hooks/leagues/useFantasyLeagueGroup";
import TeamHistoryProvider from "../../providers/fantasy_teams/TeamHistoryProvider";
import FantasyTeamProvider from "../../providers/fantasy_teams/FantasyTeamProvider";
import NoTeamCreatedFallback from "../../components/fantasy-leagues/NoTeamCreatedFallback";
import PitchViewLoadingSkeleton from "../../components/my_fantasy_team/PitchViewLoadingSkeleton";
import MyTeamScreenProvider from "../../contexts/MyTeamScreenContext";


export default function LeagueMemberTeamScreen() {

    useHideTopNavBar();
    const { userId } = useParams<{ leagueId?: string, userId?: string }>();

    const key = userId ? swrFetchKeys.getUserById(userId) : null;
    const { data: manager, isLoading } = useSWR(key, () => userService.getUserById(userId ?? ""));

    if (isLoading) {
        return (
            <LoadingFallback />
        )
    }

    return (
        <TeamHistoryProvider
            loadingFallback={<LoadingFallback />}
            user={manager}
        >
            <Content />
        </TeamHistoryProvider>
    )
}


function Content() {

    const { hardPop } = useNavigateBack();
    const { round, manager } = useTeamHistory();
    const { leagueConfig } = useFantasyLeagueGroup();

    const { roundTeam, isLoading } = useUserRoundTeam(manager?.kc_id, round?.round_number);

    const handleBack = () => {
        hardPop('/leagues');
    }

    return (
        <PageView className="flex flex-col gap-4 py-4 " >

            <div className="flex flex-col px-4" >
                <div className="h-[50px] relative w-full items-center justify-center flex flex-col rounded-xl border-none">
                    <div className="absolute left-0 px-2" >
                        <CircleButton
                            onClick={handleBack}
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </CircleButton>
                    </div>
                    <p>{manager?.username || manager?.first_name || manager?.last_name}</p>
                </div>
            </div>

            <TeamHistoryBar
            />

            <MyTeamScreenProvider onUpdateTeam={() => {}} >

                {roundTeam && (
                    <FantasyTeamProvider
                        team={roundTeam}
                        readOnly
                    >
                        <FantasyTeamView
                            leagueConfig={leagueConfig}
                            onTeamUpdated={async () => { }}
                            onBack={() => { }}
                        />
                    </FantasyTeamProvider>
                )}

                {!roundTeam && !isLoading && (
                    <NoTeamCreatedFallback
                        hideViewStandingsOption
                        perspective="third-person"
                    />
                )}

                {isLoading && (
                    <PitchViewLoadingSkeleton />
                )}
            </MyTeamScreenProvider>
        </PageView>
    )
}


function LoadingFallback() {
    return (
        <PageView className="flex flex-col animate-pulse gap-2" >
            <div className="flex flex-col p-4 " >
                <RoundedCard
                    className="h-[50px] w-full rounded-xl border-none"
                />
            </div>

            <PitchViewLoadingSkeleton />
        </PageView>
    )
}