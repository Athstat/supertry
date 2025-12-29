import { addDays, endOfWeek, isSameDay, startOfWeek, subDays } from "date-fns";
import { useCallback, useMemo, useState } from "react";

/** Hook that allows you to move inbetween different weeks */
export function useWeekCursor() {

    const today = useMemo(() => {
        return new Date();
    }, []);
    
    const [pivotDate, setPivotDate] = useState(today);

    const weekStart = useMemo(() => {
        if (pivotDate) {
            return startOfWeek(new Date(pivotDate));
        }

        return new Date();
    }, [pivotDate]);

    const weekEnd = useMemo(() => {

        if (pivotDate) {
            return endOfWeek(new Date(pivotDate));
        }

        return new Date();

    }, [pivotDate]);

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
        setPivotDate(new Date());
    }, [setPivotDate]);

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