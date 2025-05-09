
/** Returns the difference in epoch between a future date and today */
export function epochDiff(futureDate: Date) {
    const today = new Date();
    
    const futureLocalTime = new Date(futureDate);
    const diff = futureLocalTime.valueOf() - today.valueOf();

    return diff;
}