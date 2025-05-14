
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