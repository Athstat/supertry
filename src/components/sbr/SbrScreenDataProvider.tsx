
/** Fetches data needed by the sbr screen and makes it available
 * through global shared atoms*/

import useSWR from "swr";
import { useSetAtom } from "jotai"
import { ReactNode, useEffect } from "react";
import { LoadingState } from "../ui/LoadingState";
import { sbrService } from "../../services/sbrService";
import { useQueryState } from "../../hooks/useQueryState";
import { allSbrWeekFixturesAtom, sbrFixturesPivotDateAtom } from "../../state/sbrFixtures.atoms"
import { dateToStrWithoutTime, safeTransformStringToDate } from "../../utils/dateUtils";

type Props = {
    children?: ReactNode
}

export default function SbrScreenDataProvider({ children }: Props) {

    // get all the fixtures as an atom
    // save the week start and week end as atoms

    // use the week start and end to filter the matches
    // set all of these related fixture atoms

    const { data: allFixtures, isLoading } = useSWR("sbr-fixtures", () => sbrService.getAllFixtures());
    
    const [pivotDateStr] = useQueryState('pivot', { init: dateToStrWithoutTime() });
    const pivotDate = safeTransformStringToDate(pivotDateStr);

    const setSbrFixturesAtom = useSetAtom(allSbrWeekFixturesAtom);
    const setSbrFixturesPivotDate = useSetAtom(sbrFixturesPivotDateAtom);

    useEffect(() => {
        if (allFixtures) setSbrFixturesAtom(allFixtures);
        if (pivotDate) setSbrFixturesPivotDate(pivotDate);
    }, [allFixtures, pivotDate]);

    if (isLoading) return <LoadingState />

    return (
        <>
            {children}
        </>
    )
}
