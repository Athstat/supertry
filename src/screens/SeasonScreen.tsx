import { useParams } from "react-router-dom"
import useSWR from "swr";
import { getSeasonsById } from "../services/seasonsService";
import { LoadingState } from "../components/ui/LoadingState";
import { ErrorState } from "../components/ui/ErrorState";
import SeasonDataProvider from "../components/seasons/SeasonDataProvider";
import { useAtomValue } from "jotai";
import { seasonAthletesAtoms, seasonAtom, seasonFixtutesAtoms, seasonTeamsAtoms } from "../state/season.atoms";
import { ScopeProvider } from "jotai-scope";
import { TopicPageView } from "./PageView";
import TeamCard from "../components/teams/TeamCard";
import { Shield, Users } from "lucide-react";
import { PlayerGameCard } from "../components/player/PlayerGameCard";

export default function SeasonScreen() {

    const { seasonId } = useParams();
    const fetchKey = `seasons/${seasonId}`;
    const { data: season, isLoading } = useSWR(fetchKey, () => getSeasonsById(seasonId ?? ""));

    if (isLoading) return <LoadingState />

    if (!season) return <ErrorState error="Season was not found" />

    const atoms = [
        seasonAtom, seasonTeamsAtoms,
        seasonFixtutesAtoms, seasonAthletesAtoms
    ]

    return (
        <ScopeProvider atoms={atoms} >
            <SeasonDataProvider season={season} >
                <SeasonScreenContent />
            </SeasonDataProvider>
        </ScopeProvider>

    )
}


function SeasonScreenContent() {

    const season = useAtomValue(seasonAtom);
    const teams = useAtomValue(seasonTeamsAtoms);
    const athletes = useAtomValue(seasonAthletesAtoms);

    const card = [
        {
            title: 'Teams',
            value: teams.length
        }
    ]

    if (!season) return <ErrorState error="Season was not found" />

    return (
        <TopicPageView
            title={season.name}
            description="Crunching heart stopping stuff"
            statsCards={card}
            className="p-4 flex flex-col gap-4"
        >

            <div className="flex flex-row items-center gap-2" >
                <Shield />
                <h1 className="text-lg font-bold" >Teams</h1>
            </div>

            <div className="flex flex-row items-center gap-2 overflow-x-auto h-28" >
                {teams.map((t, index) => {
                    return <TeamCard className="flex-1 min-w-36 h-full" team={t} key={index} />
                })}
            </div>

            <div className="flex flex-row items-center gap-2" >
                <Users />
                <h1 className="text-lg font-bold" >Top Athletes</h1>
            </div>

            <div className="flex flex-row items-center gap-2 overflow-x-auto" >
                {athletes.map((a, index) => {
                    return <PlayerGameCard className="h-[170px] w-[130px]" player={a} key={index} />
                })}
            </div>

        </TopicPageView>
    )
}
