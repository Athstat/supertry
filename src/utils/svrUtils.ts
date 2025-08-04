import { countryFlags } from "../types/countries";

/** Return a countries flag */
export function getCountryEmojiFlag(country: string | undefined) {

    if (country === undefined) return;

    const flag = countryFlags.find((c) => {
        const notNull = c.name && country;
        const matches = notNull && c.name.toUpperCase() === country.toUpperCase();
        return matches;
    })

    return flag?.flag;
}