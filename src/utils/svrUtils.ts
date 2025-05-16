
/** Return a countries flag */
export function getCountryEmojiFlag(country: string) {
    const upperCase = country.toUpperCase();

    if (upperCase === "ZIMBABWE") {
        return "🇿🇼";
    }

    if (upperCase === "SOUTH AFRICA") {
        return "🇿🇦";
    }
}