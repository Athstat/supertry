import { IFantasyAthlete } from "../types/rugbyPlayer";

/** Formats a position by removing any `-` and capitalising the first letter in each word */
export const formatPosition = (inStr: string) => {
    const parts = inStr.split("-");
    let outStr = "";

    parts.forEach((part) => {
        if (part.length === 0) return;

        if (part.length > 1) {
            const partNormalised = part[0].toUpperCase() + part.slice(1);
            outStr += partNormalised + " ";
        } else {
            const partNormalised = part[0].toUpperCase();
            outStr += partNormalised + " ";
        }
    });

    return outStr
}

function normalizeName(name: string) {
    return name.trim().toLowerCase().replace(/\s+/g, ' ');
}

function getInitials(name: string) {
    return name
        .split(' ')
        .map(word => word[0])
        .join('');
}

function nameMatches(input: string, target: string): boolean {
    const inputNorm = normalizeName(input);
    const targetNorm = normalizeName(target);

    const inputTokens = inputNorm.split(' ');
    const targetTokens = targetNorm.split(' ');

    const inputLast = inputTokens[inputTokens.length - 1];
    const targetLast = targetTokens[targetTokens.length - 1];

    // Always require exact match on last name
    if (inputLast !== targetLast) return false;

    // If full names match
    if (inputNorm === targetNorm) return true;

    // If all non-last input tokens match prefix of target tokens
    for (let i = 0; i < inputTokens.length - 1; i++) {
        const inputPart = inputTokens[i];
        const targetPart = targetTokens[i] || '';
        if (!targetPart.startsWith(inputPart)) return false;
    }

    // Match initials (e.g. "J Hurts" → "Jaylen Hurts")
    const inputInitials = getInitials(inputNorm);
    const targetInitials = getInitials(targetNorm);
    if (inputInitials === targetInitials && inputLast === targetLast) {
        return true;
    }

    return true;
}


export function playerSearchPredicate(athlete: IFantasyAthlete, query: string) {
    return nameMatches(athlete.player_name ?? "", query);
}

export function formatAction(actionName: string) {
    const displayName = actionName
    .replace(/([A-Z])/g, " $1")
    .trim();

    const res = displayName.charAt(0).toUpperCase() + displayName.slice(1);

    return res
}