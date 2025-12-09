export function titleCase(str: string): string {
    if (!str) return "";
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

export function alphabeticalComparator(a: string, b: string) {
    return a.localeCompare(b, undefined, { sensitivity: 'base' })
};

/** Validates an email */
export function emailValidator(email: string | undefined | null): boolean {
    if (!email) {
        return false;
    };

    const trimmed = email.trim();
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(trimmed);
}

/** Returns true if a string is an email */
export function isEmail(inStr: string) {
    return emailValidator(inStr.trim());
}


/**  Hides part of an email */
export function maskEmail(email: string): string {
    const [local, domain] = email.split('@');
    const maskedLocal = local[0] + '*'.repeat(Math.max(1, local.length - 2)) + local.slice(-1);
    const [domainName, tld] = domain.split('.');
    const maskedDomain = domainName[0] + '*'.repeat(Math.max(1, domainName.length - 2)) + domainName.slice(-1);
    return `${maskedLocal}@${maskedDomain}.${tld}`;
}


export function renderIfNotEmail(str: string) {
    const isEmail = emailValidator(str);

    if (isEmail) {
        return "";
    }

    return str;
}

export function replaceDashesWithUnderscrolls(inStr: string) {
    return String(inStr).replace(/-/g, '_');
}


export function isNumeric(str: string) {
    if (typeof str != "string") return false; // only process strings
    return !isNaN(Number(str)) && !isNaN(parseFloat(str));
}


/** Gets the Pathname and Search Params from a URI, the Search Params will include the '?' symbol */
export function getPathNameAndSearchParams(uri: string): [(string | undefined), (string | undefined)] {
    if (!uri) {
        return [undefined, undefined];
    }

    if (uri.includes("?")) {
        const [pathName, queryWithoutQuestionMark] = uri.split("?");
        return [pathName, "?" + queryWithoutQuestionMark];
    }

    return [uri, undefined];
}


export const sanitizeStat = (actionCount?: number) => {
    if (!actionCount || actionCount === undefined || actionCount === null) {
        return undefined;
    }


    const [, decimal] = actionCount.toString().split(".");

    if (Number(decimal) > 0) {
        return Number(actionCount.toString()).toFixed(1);
    }

    return Math.floor(actionCount);
}


export const getStatUnit = (actionDisplayName?: string) => {
    if (!actionDisplayName) {
        return undefined;
    }

    if (actionDisplayName.includes("Minute")) {
        return "'"
    }

    if (actionDisplayName.includes("Metres")) {
        return "m"
    }
    return undefined;
}

export const stripCountryName = (name: string) => {
    if (name.endsWith(" A")) {
        name = name.replace(" A", "");
    }

    name = name.replace(" B", "");
    name = name.replace(" XV", "");
    name = name.replace(" 7s", "");
    name = name.replace(" U18", "");
    name = name.replace(" U20", "");
    name = name.replace(" U19", "");

    return name;
}