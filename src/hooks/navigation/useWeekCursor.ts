import { addDays, endOfDay, isMonday, isSameDay, nextMonday, previousMonday, startOfDay, startOfWeek, subDays } from "date-fns";
import { useCallback, useEffect, useMemo, useState } from "react";

/** Hook that allows you to move inbetween different weeks */
export function useWeekCursor(today: Date = new Date()) {

    const [pivotDate, setPivotDate] = useState(today);

    useEffect(() => {
        setPivotDate(today);
    }, [today]);

    const weekStart = useMemo(() => {
        if (pivotDate) {

            if (isMonday(new Date(pivotDate))) {
                return startOfDay(new Date(pivotDate));
            }

            const start = startOfDay(previousMonday(new Date(pivotDate)));
            return start;
        }

        return startOfDay(today);
    }, [pivotDate, today]);

    const weekEnd = useMemo(() => {

        if (pivotDate) {
            const end = endOfDay(nextMonday(new Date(pivotDate)));
            return end;
        }

        return endOfDay(today);

    }, [pivotDate, today]);

    const moveNextWeek = useCallback(() => {
        setPivotDate(curr => {
            if (curr) {
                return addDays(curr, 7);
            }

            return curr;
        });
    }, [setPivotDate]);

    const movePreviousWeek = useCallback(() => {
        setPivotDate(curr => {
            if (curr) {
                return subDays(curr, 7);
            }

            return curr;
        });
    }, [setPivotDate]);

    const reset = useCallback(() => {
        setPivotDate(today);
    }, [today]);

    const isCurrentWeek = useMemo(() => {
        const todayWeekStart = startOfWeek(today);
        return isSameDay(weekStart, todayWeekStart);
    }, [today, weekStart]);

    const switchPivot = (newPivot: Date) => {
        if (newPivot) {
            setPivotDate(newPivot);
        }
    }

    return {
        today,
        pivotDate,
        moveNextWeek,
        movePreviousWeek,
        weekEnd,
        weekStart,
        reset,
        isCurrentWeek,
        switchPivot
    }
}