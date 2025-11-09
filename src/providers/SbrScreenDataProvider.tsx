import useSWR from "swr";
import { useSetAtom } from "jotai"
import { ReactNode, useEffect } from "react";
import { LoadingState } from "../components/ui/LoadingState";
import { useQueryState } from "../hooks/useQueryState";
import { sbrService } from "../services/sbr/sbrService";
import { allSbrWeekFixturesAtom, sbrFixturesPivotDateAtom } from "../state/sbrFixtures.atoms";
import { dateToStrWithoutTime, safeTransformStringToDate } from "../utils/dateUtils";

type Props = {
    children?: ReactNode
}

/** Fetches data needed by the sbr screen and 
 * makes it available through global shared atoms*/
export default function SbrScreenDataProvider({ children }: Props) {

    const { data: allFixtures, isLoading } = useSWR("sbr-fixtures", () => sbrService.getAllFixtures());

    const [pivotDateStr] = useQueryState<string | null | undefined>('pivot', { init: dateToStrWithoutTime() });
    const pivotDate = safeTransformStringToDate(pivotDateStr);

    const setSbrFixturesAtom = useSetAtom(allSbrWeekFixturesAtom);
    const setSbrFixturesPivotDate = useSetAtom(sbrFixturesPivotDateAtom);

    useEffect(() => {
        if (allFixtures) setSbrFixturesAtom(allFixtures);
        if (pivotDate) setSbrFixturesPivotDate(pivotDate);
    }, [allFixtures, pivotDate, setSbrFixturesAtom, setSbrFixturesPivotDate]);

    if (isLoading) return <LoadingState />

    return (
        <>
            {children}
        </>
    )
}
