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
            className="p-4"
        >
            {teams.map((t, index) => {
                return <div key={index} >
                    {t.athstat_name}
                </div>
            })}
        </TopicPageView>
    )
}
