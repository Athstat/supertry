import useSWR from "swr"
import { swrFetchKeys } from "../../../utils/swrKeys"
import { sbrService } from "../../../services/sbrService";
import { useSetAtom } from "jotai";
import { sbrFixtureAtom, sbrFixtureBoxscoreAtom, sbrFixtureEventsAtom } from "../../../state/sbrFixtureScreen.atoms";
import { ReactNode, useEffect } from "react";
import { LoadingState } from "../../ui/LoadingState";
import { ErrorState } from "../../ui/ErrorState";

type Props = {
    fixtureId: string,
    children?: ReactNode
}


/** Fetches and provides data for a single sbr fixture */
export default function SbrFixtureDataProvider({ fixtureId, children }: Props) {

    const setSbrFixture = useSetAtom(sbrFixtureAtom);
    const setSbrFixtureEvents = useSetAtom(sbrFixtureEventsAtom);
    const setSbrFixtureBoxscore = useSetAtom(sbrFixtureBoxscoreAtom)

    const fixtureFetchKey = swrFetchKeys.getSbrFixtureKey(fixtureId);
    const {data: fixture, isLoading: loadingFixture, error: fixtureError} = useSWR(fixtureFetchKey, () => sbrService.getFixtureById(fixtureId));

    const eventsFetchKey = swrFetchKeys.getSbrFixtureEventsKey(fixtureId);
    const {data: events, isLoading: loadingEvents, error: eventsError} = useSWR(eventsFetchKey, () => sbrService.getFixtureEvents(fixtureId));

    const boxscoreFetchKey = swrFetchKeys.getSbrFixtureBoxscoreKey(fixtureId);
    const {data: boxscore, isLoading: loadingBoxscore, error: boxscoreError} = useSWR(boxscoreFetchKey, () => sbrService.getFixtureBoxscoreById(fixtureId));

    const error = fixtureError || eventsError || boxscoreError;
    const isLoading = loadingFixture || loadingBoxscore || loadingEvents;

    useEffect(() => {

        if (fixture) setSbrFixture(fixture);
        if (events) setSbrFixtureEvents(events);
        if (boxscore) setSbrFixtureBoxscore(boxscore);

    }, [fixture, events, boxscore]);

    if (isLoading) {
        return <LoadingState />
    }

    if (error) {
        return <ErrorState error="Failed to Load Match data" />
    }

    return (
        <>
            {children}
        </>
    )
}
