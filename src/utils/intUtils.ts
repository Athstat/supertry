

/** Function that only rounds up a fractional value but
 * if the number has no fraction it will return that number */
export function smartRoundUp(val?: number | null | undefined) {
    if (val === null || val === undefined) {
        return 0;
    }

    return val.toFixed(1);
}

// Converts centimeters to feet and inches string, e.g., 170 -> 5'7"
export function cmToFeetInches(cm: number): string {
  const totalInches = cm / 2.54;
  const feet = Math.floor(totalInches / 12);
  const inches = Math.round(totalInches - feet * 12);
  return `${feet}'${inches}"`;
}

// Converts kilograms to pounds string, rounded to nearest pound
export function kgToLbs(kg: number): string {
  const lbs = Math.round(kg * 2.2046226218);
  return `${lbs} lbs`;
}