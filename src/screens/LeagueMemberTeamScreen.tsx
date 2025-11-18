import { useParams } from "react-router-dom";
import PageView from "./PageView";
import TeamHistoryProvider from "../providers/fantasy-teams/TeamHistoryProvider";
import FantasyLeagueGroupDataProvider from "../components/fantasy-league/providers/FantasyLeagueGroupDataProvider";
import useSWR from "swr";
import { swrFetchKeys } from "../utils/swrKeys";
import { userService } from "../services/userService";
import { useTeamHistory } from "../hooks/fantasy/useTeamHistory";
import TeamHistoryBar from "../components/fantasy-leagues/my-team/TeamHistoryBar";
import FantasyLeagueTeamProvider from "../components/fantasy-leagues/my-team/FantasyLeagueTeamProvider";
import FantasyTeamView from "../components/fantasy-leagues/my-team/FantasyTeamView";
import { useFantasyLeagueGroup } from "../hooks/leagues/useFantasyLeagueGroup";
import PitchViewLoadingSkeleton from "../components/fantasy-leagues/my-team/PitchViewLoadingSkeleton";
import RoundedCard from "../components/shared/RoundedCard";
import { Fragment } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { IFantasyLeagueRound } from "../types/fantasyLeague";
import BlueGradientCard from "../components/shared/BlueGradientCard";
import NoTeamCreatedFallback from "../components/fantasy-leagues/NoTeamCreatedFallback";


export default function LeagueMemberTeamScreen() {

    const { leagueId, userId } = useParams<{ leagueId?: string, userId?: string }>();

    const key = userId ? swrFetchKeys.getUserById(userId) : null;
    const { data: manager, isLoading } = useSWR(key, () => userService.getUserById(userId ?? ""));

    if (isLoading) {
        return (
            <LoadingFallback />
        )
    }

    return (
        <PageView>
            <FantasyLeagueGroupDataProvider
                leagueId={leagueId}
            >
                <TeamHistoryProvider
                    user={manager}
                >
                    <Content />
                </TeamHistoryProvider>
            </FantasyLeagueGroupDataProvider>
        </PageView>
    )
}


function Content() {

    const { round, roundTeam, manager } = useTeamHistory();
    const { leagueConfig } = useFantasyLeagueGroup();
    const [isDelaying, setDelaying] = useState<boolean>(false);

    const [visitedRounds, setVistedRounds] = useState<IFantasyLeagueRound[]>([]);

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

    useEffect(() => {

    }, [round]);

    return (
        <div className="flex flex-col pt-2 gap-4" >

            <div className="flex flex-col px-4" >
                <BlueGradientCard className="h-[50px] w-full items-center justify-center flex flex-col rounded-xl border-none">
                    <p>{manager?.username || manager?.first_name || manager?.last_name}</p>
                </BlueGradientCard>
            </div>

            <TeamHistoryBar
            />

            {roundTeam && !isDelaying && (
                <Fragment>
                    <FantasyLeagueTeamProvider
                        leagueRound={round}
                        team={roundTeam}
                    >
                        <FantasyTeamView
                            leagueConfig={leagueConfig}
                            leagueRound={round}
                            onTeamUpdated={async () => { }}
                            onBack={() => { }}
                        />
                    </FantasyLeagueTeamProvider>

                </Fragment>
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
        </div>
    )
}


function LoadingFallback() {
    return (
        <div className="flex flex-col animate-pulse gap-2" >
            <div className="flex flex-col p-4 " >
                <RoundedCard
                    className="h-[50px] w-full rounded-xl border-none"
                />
            </div>

            <PitchViewLoadingSkeleton />
        </div>
    )
}