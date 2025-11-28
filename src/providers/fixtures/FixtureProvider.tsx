import { Fragment, ReactNode, useEffect } from "react";
import useSWR from "swr";
import { gamesService } from "../../services/gamesService";
import { fixtureAtom } from "../../state/fixtures/fixture.atoms";
import { ScopeProvider } from "jotai-scope";
import { useSetAtom } from "jotai";
import { LoadingState } from "../../components/ui/LoadingState";

type Props = {
    fixtureId?: string,
    children?: ReactNode,
    loadingFallback?: ReactNode
}

/** Provides a fixture to its children */
export function FixtureScreenProvider({ fixtureId, children, loadingFallback }: Props) {
    const atoms = [fixtureAtom];

    return (
        <ScopeProvider
            atoms={atoms}
        >
            <InnerProvider
                fixtureId={fixtureId}
                loadingFallback={loadingFallback}
            >
                {children}
            </InnerProvider>
        </ScopeProvider>
    )
}

function InnerProvider({ fixtureId, children, loadingFallback }: Props) {

    const setFixture = useSetAtom(fixtureAtom);

    const fixtureKey = fixtureId ? `fixture/${fixtureId}` : null;

    const { data: fetchedFixture, isLoading } = useSWR(fixtureKey, () =>
        gamesService.getGameById(fixtureId ?? '')
    );

    useEffect(() => {
        if (fetchedFixture) {
            setFixture(fetchedFixture);
        }
    }, [fetchedFixture, setFixture]);

    if (isLoading) {
        return (
            <Fragment>
                {loadingFallback ? loadingFallback : null}
                {!loadingFallback && (
                    <LoadingState />
                )}
            </Fragment>
        )
    }

    return (
        <>
            {children}
        </>
    )
}