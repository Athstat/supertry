import { useState, useCallback, useEffect, useMemo } from "react";
import { formatWeekHeader, findPreviousWeekPivotWithFixtures, findNextWeekPivotWithFixtures, findClosestWeekWithFixtures, getFixturesForWeek } from "../../utils/fixtureUtils";
import { useWeekCursor } from "../navigation/useWeekCursor";
import { IFixture } from "../../types/games";

type Props = {
    fixtures: IFixture[],
    isLoading: boolean,
    initDateVal?: Date
}

/** Hook that provides a cursor to view fixtures, over week periods */
export function useFixtureCursor({ fixtures, isLoading, initDateVal }: Props) {
    const [initDate, setInitDate] = useState(initDateVal ? new Date(initDateVal) : new Date());

    const {
        weekEnd, weekStart, isCurrentWeek,
        moveNextWeek, movePreviousWeek, reset, pivotDate,
        switchPivot
    } = useWeekCursor(initDate);

    const weekHeader = formatWeekHeader({
        start: weekStart, end: weekEnd
    });

    const handlePreviousWeek = useCallback(() => {

        const previousPivot = findPreviousWeekPivotWithFixtures(fixtures, pivotDate, 114);

        if (previousPivot) {
            switchPivot(previousPivot);
            return;
        }

        movePreviousWeek();
    }, [fixtures, movePreviousWeek, pivotDate, switchPivot])

    const handleNextWeek = useCallback(() => {
        const nextPivot = findNextWeekPivotWithFixtures(fixtures, pivotDate, 114);

        if (nextPivot) {
            switchPivot(nextPivot);
            return;
        }

        moveNextWeek()
    }, [fixtures, moveNextWeek, pivotDate, switchPivot])

    const handleJumpToCurrentWeek = () => {
        reset();
    };

    const hasPreviousWeek = true;
    const hasNextWeek = true;

    const hasAnyFixtures = fixtures.length > 0;

    // Update to closest week with fixtures when component mounts or fixtures load
    useEffect(() => {

        if (isLoading) {
            return;
        }

        const today = initDateVal ? new Date(initDateVal) : new Date();

        if (hasAnyFixtures) {
            const closestPivot = findClosestWeekWithFixtures(fixtures, today);

            if (closestPivot) {
                setInitDate(closestPivot);
                return;
            }

        }

        setInitDate(today);

    }, [fixtures, hasAnyFixtures, initDateVal, isLoading, setInitDate]);

    const weekFixtures = useMemo(() => {

        return getFixturesForWeek(fixtures, weekStart, weekEnd);

    }, [fixtures, weekEnd, weekStart])

    return {
        isCurrentWeek,
        hasPreviousWeek,
        hasNextWeek,
        handleJumpToCurrentWeek,
        handleNextWeek,
        handlePreviousWeek,
        weekEnd,
        weekHeader,
        weekStart,
        hasAnyFixtures,
        switchPivot,
        weekFixtures
    }
}