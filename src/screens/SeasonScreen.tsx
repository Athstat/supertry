import { useParams } from "react-router-dom"
import useSWR from "swr";
import { getSeasonsById } from "../services/seasonsService";
import { LoadingState } from "../components/ui/LoadingState";
import { ErrorState } from "../components/ui/ErrorState";
import PageView from "./PageView";
import SeasonDataProvider from "../components/seasons/SeasonDataProvider";
import { useAtomValue } from "jotai";
import { seasonAtom } from "../state/season.atoms";
import { ScopeProvider } from "jotai-scope";

export default function SeasonScreen() {

    const { seasonId } = useParams();
    const fetchKey = `seasons/${seasonId}`;
    const { data: season, isLoading } = useSWR(fetchKey, () => getSeasonsById(seasonId ?? ""));

    if (isLoading) return <LoadingState />

    if (!season) return <ErrorState error="Season was not found" />

    const atoms = [seasonAtom]

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

    if (!season) return <ErrorState error="Season was not found" />

    return (
        <div>

        </div>
    )
}
