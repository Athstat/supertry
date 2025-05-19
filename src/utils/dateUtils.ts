import { eachDayOfInterval, endOfWeek, format, lastDayOfMonth, startOfWeek } from "date-fns";

/** Returns the difference in epoch between a future date and today */
export function epochDiff(futureDate: Date) {
    const today = new Date();
    
    const futureLocalTime = new Date(futureDate);
    const diff = futureLocalTime.valueOf() - today.valueOf();

    return diff;
}

/** Comparator for dates */
export function dateComparator(a: Date | null | undefined, b: Date | null | undefined) {

    const aDate = new Date(a ?? new Date());
    const bDate = new Date(b ?? new Date());

    return aDate.valueOf() - bDate.valueOf();

}

export type Month = "January" | "February" | "March" | "April" | "May" | "June"
    | "July" | "August" | "September" | "October" | "November" | "December" | string;

export const monthsOfYear: Month[] = [
    "January", "February", "March", "April", "May", "June"
, "July", "August", "September", "October", "November", "December"
];

export function getMonthByIndex(monthIndex: number) {
    if (monthIndex > 11) {
        throw new Error("Month index can't be greater than 11");
    }

    return monthsOfYear[monthIndex];
} 

export function getLastAndNext3Years() {
    const now = new Date();
    const thisYear = now.getFullYear();
    const years: number[] = []

    for (let x = 1; x <= 3; x++) {
        years.push(thisYear - x);
    }

    years.push(thisYear);
        for (let x = 1; x <= 3; x++) {
        years.push(thisYear + x);
    }

    return years.sort((a, b) => a - b);
}

export function getWeeksInMonthArr(year: number, month: number) {
    
    const monthStart = new Date(year, month, 1);
    const monthEnd = lastDayOfMonth(monthStart);

    const startOfFirstWeek = startOfWeek(monthStart);
    const endOfLastWeek = endOfWeek(monthEnd);
    
    const days = eachDayOfInterval({
        start: startOfFirstWeek,
        end: endOfLastWeek
    });

    const weeks: Date[][] = [];
    let buff: Date[] = [];


    days.forEach((day) => {
        if (buff.length >= 7) {
            weeks.push(buff);
            buff = [];
        }

        buff.push(day);
    })

    if (buff.length > 0) {
        weeks.push(buff);
    }

    return weeks;
}

export function weekHash(week: Date[]) {
    let digest = "";

    week.forEach((day) => {
        const dayOb = new Date(day);
        digest += `${dayOb.getFullYear()}-${dayOb.getMonth()}-${format(dayOb, "dd")};`
    });

    return digest;
}

export function isWeeksSame(week1: Date[], week2: Date[]) {
    const week1Str = weekHash(week1);
    const week2Str = weekHash(week2);

    return week1Str === week2Str;
}