import { PointsBreakdownItem } from "../services/athletes/athleteService";
import { IFantasyTeamAthlete } from "../types/fantasyTeamAthlete";
import { IFantasyAthlete, PlayerForm } from "../types/rugbyPlayer";

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


export function athleteSearchPredicate(athlete: IFantasyAthlete, query: string) {
    return nameMatches(athlete.player_name ?? "", query);
}

/** Predicate for searching by human names */
export function nameSearchPredicate(fullName: string, query: string) {
    return nameMatches(fullName, query);
}


export function formatAction(actionName: string) {
    const displayName = actionName
        .replace(/([A-Z])/g, " $1")
        .trim();

    const res = displayName.charAt(0).toUpperCase() + displayName.slice(1);

    return res
}

export const getGroupedActions = (breakdown: PointsBreakdownItem[]) => {
    if (!breakdown || !breakdown.length) return [];

    const groupedActions = breakdown.reduce((result: any, item) => {
        const action = item.action || "";

        if (!result[action]) {
            result[action] = {
                action: action,
                action_count: 0,
                score: 0,
                instances: [],
            };
        }

        result[action].action_count += item.action_count || 1;
        result[action].score += item.score || 0;
        result[action].instances.push(item);

        return result;
    }, {});

    return Object.values(groupedActions);
};


export function calculateAveragePr(players: IFantasyTeamAthlete[]): number {
    if (!players.length) return 0;

    const totalPR = players.reduce((sum, player) => {
        return sum + (player.power_rank_rating || 0)
    }, 0);

    const playersLen = players.length
    const ave = totalPR / playersLen;

    return ave;
};

/** Calucates and returns the total value of a fantasy team by purchase price */
export function calculateFantasyTeamValue(athletes?: IFantasyTeamAthlete[]) {
    if (athletes) {
        return athletes.reduce((sum, a) => {
            return sum + (a.purchase_price || 0);
        }, 0);
    }

    return 0;
}

export function convertPositionNameToPositionObject(positionToSwap: string) {

    return {
        id: positionToSwap === "any" ? "any" : positionToSwap,
        name: positionToSwap === "any" ? "Any Position" : positionToSwap,
        shortName:
            positionToSwap === "any"
                ? "ANY"
                : positionToSwap.substring(0, 2).toUpperCase(),
        x: "0",
        y: "0",
    }
}

export const formBias = (powerRanking: number, form?: PlayerForm) => {
  switch (form) {
    case "UP":
      return 3 + powerRanking;
    case "NEUTRAL":
      return 2;
    case "DOWN":
      return -5;
    default:
      return 1;
  }
};