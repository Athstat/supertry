import { countryFlags } from "../types/countries";

/** Return a countries flag */
export function getCountryEmojiFlag(country: string | undefined, matchStartsWith: boolean = false) {

    if (country === undefined) return;

    const flag = countryFlags.find((c) => {
        const notNull = c.name && country;
        const matchCode = c.code === country;
        const matchesStart = country.startsWith(c.name);
        const matches = notNull && c.name.toUpperCase() === country.toUpperCase();
        return matches || matchCode || (matchStartsWith && matchesStart);
    })

    return flag?.flag;
}