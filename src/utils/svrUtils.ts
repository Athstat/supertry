import { countryFlags } from "../types/countries";

/** Return a countries flag */
export function getCountryEmojiFlag(country: string | undefined, matchStartsWith: boolean = false) {

    if (country === undefined || country === null) return;

    const flag = countryFlags.find((c) => {
        const notNull = c.name && country;
        const matchCode = c.code === country;
        const matchesStart = country.startsWith(c.name);
        const matches = notNull && c.name.toUpperCase() === country.toUpperCase();
        return matches || matchCode || (matchStartsWith && matchesStart);
    })

    return flag?.flag;
}


/** Returns a country object by name */
export function getCountryByName(countryName: string | undefined, matchStartsWith: boolean = false) {

    if (countryName === undefined || countryName === null) return;

    const country = countryFlags.find((c) => {
        const notNull = c.name && countryName;
        const matchCode = c.code === countryName;
        const matchesStart = countryName.startsWith(c.name);
        const matches = notNull && c.name.toUpperCase() === countryName.toUpperCase();
        return matches || matchCode || (matchStartsWith && matchesStart);
    })

    return country;
}