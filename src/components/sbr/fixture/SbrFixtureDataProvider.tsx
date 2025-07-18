import useSWR from "swr"
import { swrFetchKeys } from "../../../utils/swrKeys"
import { sbrService } from "../../../services/sbrService";
import { useSetAtom } from "jotai";
import { sbrFixtureAtom, sbrFixtureBoxscoreAtom, sbrFixtureTimelineAtom as sbrFixtureTimelineAtom } from "../../../state/sbrFixtureScreen.atoms";
import { ReactNode, useEffect } from "react";
import { ErrorState } from "../../ui/ErrorState";

type Props = {
    fixtureId: string,
    children?: ReactNode,
    waitForTimeline?: boolean
}


/** Fetches and provides data for a single sbr fixture */
export default function SbrFixtureDataProvider({ fixtureId, children, waitForTimeline }: Props) {

    const setSbrFixture = useSetAtom(sbrFixtureAtom);
    const setSbrFixtureEvents = useSetAtom(sbrFixtureTimelineAtom);
    const setSbrFixtureBoxscore = useSetAtom(sbrFixtureBoxscoreAtom)

    const fixtureFetchKey = swrFetchKeys.getSbrFixtureKey(fixtureId);
    const {data: fixture, isLoading: loadingFixture, error: fixtureError} = useSWR(fixtureFetchKey, () => sbrService.getFixtureById(fixtureId));

    const eventsFetchKey = swrFetchKeys.getSbrFixtureTimeline(fixtureId);
    const {data: events, isLoading: loadingTimeline, error: eventsError} = useSWR(eventsFetchKey, () => sbrService.getFixtureEvents(fixtureId));

    const boxscoreFetchKey = swrFetchKeys.getSbrFixtureBoxscoreKey(fixtureId);
    const {data: boxscore, isLoading: loadingBoxscore, error: boxscoreError} = useSWR(boxscoreFetchKey, () => sbrService.getFixtureBoxscoreById(fixtureId));

    const error = fixtureError || eventsError || boxscoreError;
    const isLoading = loadingFixture || loadingBoxscore || (waitForTimeline && loadingTimeline);

    useEffect(() => {

        if (fixture) setSbrFixture(fixture);
        if (events) setSbrFixtureEvents(events);
        if (boxscore) setSbrFixtureBoxscore(boxscore);

    }, [fixture, events, boxscore]);

    if (isLoading) {
        return <div className="min-w-[350px] w-full bg-white rounded-xl dark:bg-slate-700/50 animate-pulse h-[250px]" >

        </div>
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
