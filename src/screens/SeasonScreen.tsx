import { useParams } from "react-router-dom"
import useSWR from "swr";
import { LoadingState } from "../components/ui/LoadingState";
import { ErrorState } from "../components/ui/ErrorState";
import SeasonDataProvider from "../components/seasons/SeasonDataProvider";
import { useAtomValue } from "jotai";
import { seasonAthletesAtoms, seasonAtom, seasonFixtutesAtoms, seasonTeamsAtoms } from "../state/season.atoms";
import { ScopeProvider } from "jotai-scope";
import { TopicPageView } from "./PageView";
import { Calendar, Users } from "lucide-react";
import { PlayerGameCard } from "../components/player/PlayerGameCard";
import { seasonService } from "../services/seasonsService";
import GroupedFixturesList from "../components/fixtures/GroupedFixturesList";
import SeasonScreenTeamList from "../components/seasons/SeasonScreenTeamList";
import SeasonScreenAthleteList from "../components/seasons/SeasonScreenAthleteList";

export default function SeasonScreen() {

    const { seasonId } = useParams();
    const fetchKey = `seasons/${seasonId}`;
    const { data: season, isLoading } = useSWR(fetchKey, () => seasonService.getSeasonsById(seasonId ?? ""));

    if (isLoading) return <LoadingState />

    if (!season) return <ErrorState error="Season was not found hahahahaah" />

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
    const fixtures = useAtomValue(seasonFixtutesAtoms);

    const card = [
        {
            title: 'Teams',
            value: teams.length
        },

        {
            title: 'Fixutes',
            value: fixtures.length
        }
    ]

    if (!season) return;

    return (
        <TopicPageView
            title={season.name}
            description="Crunching heart stopping stuff"
            statsCards={card}
            className="p-4 flex flex-col gap-4"
        >

            <SeasonScreenTeamList 
                teams={teams}
            />

            <SeasonScreenAthleteList 
                athletes={athletes}
            />

            <div className="flex flex-row items-center gap-2" >
                <Calendar />
                <h1 className="text-lg font-bold" >Fixtures</h1>
            </div>

            <div className="grid grid-cols-1 gap-2" >
                <GroupedFixturesList
                    descendingOrder
                    fixtures={fixtures}
                />
            </div>

        </TopicPageView>
    )
}
