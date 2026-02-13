import { ScopeProvider } from "jotai-scope";
import { roundFixturesAtom } from "../../state/fantasy/fantasyLeagueTeam.atoms"
import { ReactNode, useEffect } from "react";
import { useSeasonRoundFixtures } from "../../hooks/fixtures/useProFixtures";
import { useSetAtom } from "jotai";
import { LoadingIndicator } from "../../components/ui/LoadingIndicator";
import { useTeamHistory } from "../../hooks/fantasy/useTeamHistory";

type Props = {
    children?: ReactNode,
    loadingFallback?: ReactNode
}

/** Puts provider that provides round fixtures through an atom */
export default function RoundFixturesProvider({children, loadingFallback} : Props) {
    
    const atoms = [roundFixturesAtom];

    return (
        <ScopeProvider
            atoms={atoms}
        >
            <Inner 
                loadingFallback={loadingFallback}
            >{children}</Inner>
        </ScopeProvider>
    )
}

function Inner({children, loadingFallback} : Props) {
    
    const setFixtures = useSetAtom(roundFixturesAtom);
    const {round} = useTeamHistory();
    const {fixtures, isLoading} = useSeasonRoundFixtures(round?.season, round?.round_number);
    
    useEffect(() => {
        if (fixtures) {
            setFixtures(fixtures);
        }
    }, [fixtures, setFixtures])

    if (isLoading) {
        if (loadingFallback) {
            return (<>{loadingFallback}</>)
        }

        return <LoadingIndicator />
    }

    return (
        <>
            {children}
        </>
    )
}