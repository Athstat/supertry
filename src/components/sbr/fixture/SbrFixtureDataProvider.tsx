import useSWR from "swr"
import { swrFetchKeys } from "../../../utils/swrKeys"
import { sbrService } from "../../../services/sbr/sbrService";
import { useSetAtom } from "jotai";
import { sbrFixtureAtom, sbrFixtureBoxscoreAtom, sbrFixtureTimelineAtom as sbrFixtureTimelineAtom } from "../../../state/sbrFixtureScreen.atoms";
import { ReactNode, useEffect } from "react";
import { ErrorState } from "../../ui/ErrorState";
import { ISbrFixture } from "../../../types/sbr";

type Props = {
    fixture: ISbrFixture,
    children?: ReactNode,
    fetchTimeLine?: boolean
    fetchBoxscore?: boolean
}


/** Fetches and provides data for a single sbr fixture */
export default function SbrFixtureDataProvider({ fixture, children, fetchBoxscore, fetchTimeLine }: Props) {

    const setSbrFixture = useSetAtom(sbrFixtureAtom);
    const setSbrFixtureEvents = useSetAtom(sbrFixtureTimelineAtom);
    const setSbrFixtureBoxscore = useSetAtom(sbrFixtureBoxscoreAtom)

    const eventsFetchKey = fetchTimeLine ? swrFetchKeys.getSbrFixtureTimeline(fixture.fixture_id) : null;
    const {data: events, isLoading: loadingTimeline, error: eventsError} = useSWR(eventsFetchKey, () => sbrService.getFixtureEvents(fixture.fixture_id));

    const boxscoreFetchKey = fetchBoxscore ? swrFetchKeys.getSbrFixtureBoxscoreKey(fixture.fixture_id) : null;
    const {data: boxscore, isLoading: loadingBoxscore, error: boxscoreError} = useSWR(boxscoreFetchKey, () => sbrService.getFixtureBoxscoreById(fixture.fixture_id));

    const error = eventsError || boxscoreError;
    const isLoading = loadingBoxscore || loadingTimeline;

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
