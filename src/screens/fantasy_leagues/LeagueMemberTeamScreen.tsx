import { ArrowLeft } from "lucide-react";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Fragment } from "react/jsx-runtime";
import useSWR from "swr";
import NoTeamCreatedFallback from "../../components/fantasy-leagues/NoTeamCreatedFallback";
import FantasyTeamView from "../../components/my_fantasy_team/FantasyTeamView";
import PitchViewLoadingSkeleton from "../../components/my_fantasy_team/PitchViewLoadingSkeleton";
import TeamHistoryBar from "../../components/my_fantasy_team/TeamHistoryBar";
import CircleButton from "../../components/ui/buttons/BackButton";
import RoundedCard from "../../components/ui/cards/RoundedCard";
import PageView from "../../components/ui/containers/PageView";
import { useTeamHistory } from "../../hooks/fantasy/useTeamHistory";
import { useFantasyLeagueGroup } from "../../hooks/leagues/useFantasyLeagueGroup";
import { useHideTopNavBar } from "../../hooks/navigation/useNavigationBars";
import { useNavigateBack } from "../../hooks/web/useNavigateBack";
import FantasyLeagueGroupDataProvider from "../../providers/fantasy_leagues/FantasyLeagueGroupDataProvider";
import TeamHistoryProvider from "../../providers/fantasy_teams/TeamHistoryProvider";
import { userService } from "../../services/userService";
import { IFantasyLeagueRound } from "../../types/fantasyLeague";
import { swrFetchKeys } from "../../utils/swrKeys";
import FantasyTeamProvider from "../../providers/fantasy_teams/FantasyTeamProvider";


export default function LeagueMemberTeamScreen() {

    useHideTopNavBar();
    const { leagueId, userId } = useParams<{ leagueId?: string, userId?: string }>();

    const key = userId ? swrFetchKeys.getUserById(userId) : null;
    const { data: manager, isLoading } = useSWR(key, () => userService.getUserById(userId ?? ""));

    if (isLoading) {
        return (
            <LoadingFallback />
        )
    }

    return (
        <Fragment>
            <FantasyLeagueGroupDataProvider
                leagueId={leagueId}
                loadingFallback={<LoadingFallback />}
                fetchMembers={false}
            >
                <TeamHistoryProvider
                    loadingFallback={<LoadingFallback />}
                    user={manager}
                >
                    <Content />
                </TeamHistoryProvider>
            </FantasyLeagueGroupDataProvider>
        </Fragment>
    )
}


function Content() {

    const {hardPop} = useNavigateBack();
    const { round, roundTeam, manager } = useTeamHistory();
    const { leagueConfig } = useFantasyLeagueGroup();
    const [isDelaying, setDelaying] = useState<boolean>(false);

    const [visitedRounds, setVistedRounds] = useState<IFantasyLeagueRound[]>([]);

    const handleBack = () => {
        hardPop('/leagues');
    }

    useEffect(() => {

        const hasVistedRound = visitedRounds.find((r) => {
            return r.id === round?.id
        });

        if (hasVistedRound || !round) {
            return;
        }

        setDelaying(true);

        const timer = setTimeout(() => {
            setDelaying(false);
            setVistedRounds(prev => [...prev, round])
        }, 2000);

        return () => {
            clearTimeout(timer);
            setDelaying(false);
        }
    }, [round, visitedRounds]);

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
            
            {roundTeam && !isDelaying && (
                <FantasyTeamProvider
                    leagueRound={round}
                    team={roundTeam}
                    readOnly
                >
                    <FantasyTeamView
                        leagueConfig={leagueConfig}
                        leagueRound={round}
                        onTeamUpdated={async () => { }}
                        onBack={() => { }}
                    />
                </FantasyTeamProvider>
            )}



            {!roundTeam && !isDelaying && (
                <NoTeamCreatedFallback
                    hideViewStandingsOption
                    perspective="third-person"
                />
            )}

            {isDelaying && (
                <PitchViewLoadingSkeleton />
            )}
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