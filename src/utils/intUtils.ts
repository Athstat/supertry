

/** Function that only rounds up a fractional value but
 * if the number has no fraction it will return that number */
export function smartRoundUp(val?: number | null | undefined) {
    if (val === null || val === undefined) {
        return 0;
    }

    return Math.ceil(val);
}