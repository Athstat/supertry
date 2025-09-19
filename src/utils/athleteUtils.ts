// import { PointsBreakdownItem } from "../services/athletes/athleteService";
import { IProAthlete, IAthleteSeasonStarRatings } from "../types/athletes";
import { IFantasyTeamAthlete } from "../types/fantasyTeamAthlete";
import { SortField, SortDirection } from "../types/playerSorting";
import { PlayerForm } from "../types/rugbyPlayer";
import { IProTeam } from "../types/team";
import { IComparePlayerStats, ICompareStarRatingsStats } from "../types/comparePlayers";
import { getPlayerAggregatedStat, PlayerAggregateStatAction } from "../types/sports_actions";
import { FantasyLeagueTeamWithAthletes, IFantasyLeagueTeam } from "../types/fantasyLeague";

/** Formats a position by removing any `-` and capitalising the first letter in each word */
export const formatPosition = (inStr?: string) => {
    inStr = inStr ?? '';
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

function nameMatches(query: string, target: string) {
    // Normalize strings: convert to lowercase, remove diacritics, and remove apostrophes
    const normalizeString = (str: string) => {
        return str
            .toLowerCase()
            .normalize('NFD') // Decompose combined characters into base + diacritics
            .replace(/[\u0300-\u036f]/g, '') // Remove diacritics (combining diacritical marks)
            .replace(/'/g, ''); // Remove apostrophes
    };

    const normalizedQuery = normalizeString(query);
    const normalizedTarget = normalizeString(target);

    let queryIndex = 0; // Pointer for the normalized query string
    let targetIndex = 0; // Pointer for the normalized target string

    // Iterate through the normalized target string
    while (queryIndex < normalizedQuery.length && targetIndex < normalizedTarget.length) {
        // If the current characters match, move to the next character in the query
        if (normalizedQuery[queryIndex] === normalizedTarget[targetIndex]) {
            queryIndex++;
        }
        // Always move to the next character in the target string
        targetIndex++;
    }

    // If all characters in the normalized query were found in order within the normalized target,
    // then queryIndex will be equal to the length of the normalized query.
    return queryIndex === normalizedQuery.length;
};


export function athleteSearchPredicate(athlete: IProAthlete, query: string) {
    return nameMatches(query, athlete.player_name);
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

export const getGroupedActions = (breakdown: any[]) => {
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

/** filters athletes by selected positions and postion classes */
export function athletePositionFilter(athletes: IProAthlete[], selectedPositions: string[] | undefined): IProAthlete[] {

    const formatted = (selectedPositions === undefined) ? undefined
        : selectedPositions.map((p) => formatPosition(p));

    const filtered = [...athletes]

    if (!formatted || formatted.length === 0) {
        return athletes;
    }

    return filtered.filter((a) => {

        const position = a.position;
        const positionClass = a.position_class;

        const hasPosition = (position !== undefined) && position !== null;
        const hasPositionClass = (positionClass !== undefined) && positionClass !== null;

        const matchesPosition = hasPosition && formatted.includes(formatPosition(position));
        const matchesPositionClass = hasPositionClass && formatted.includes(formatPosition(positionClass));

        return matchesPosition || matchesPositionClass

    });

}

export function athleteTeamFilter(athletes: IProAthlete[], selectedTeamIds: string[] | undefined): IProAthlete[] {

    const filtered = [...athletes];

    if (selectedTeamIds === undefined || selectedTeamIds.length === 0) {
        return filtered;
    }

    return filtered.filter((a) => {
        const matchesTeamsId = selectedTeamIds.includes(a.team_id);
        return matchesTeamsId;
    });

}


export function athleteSorter(athletes: IProAthlete[], sortType: SortField | undefined, direction: SortDirection | undefined): IProAthlete[] {


    const sorted = [...athletes];

    if (!sortType || !direction) {
        return sorted;
    }

    if (sortType === 'form') {

        return sorted.sort((a, b) => {
            return direction === "asc" ?
                formBias(a.power_rank_rating ?? 0, a.form) - formBias(b.power_rank_rating ?? 0, b.form)
                : formBias(b.power_rank_rating ?? 0, b.form) - formBias(a.power_rank_rating ?? 0, a.form)
        })

    }

    if (sortType === "power_rank_rating") {
        return sorted.sort((a, b) => {
            return direction === "asc" ?
                (a.power_rank_rating ?? 0) - (b.power_rank_rating ?? 0)
                : (b.power_rank_rating ?? 0) - (a.power_rank_rating ?? 0)
        })
    }

    if (sortType === "player_name") {
        return sorted.sort((a, b) => {
            return direction === "asc" ?
                (a.player_name.localeCompare(b.player_name))
                : (b.player_name.localeCompare(a.player_name))
        });
    }

    return sorted;



}

export function athleteSearchFilter(athletes: IProAthlete[], query: string | undefined) {

    const buff = [...athletes];
    if (!query) return buff;

    return buff.filter((a) => {
        return athleteSearchPredicate(a, query);
    })
}

export function getAthletesSummary(athletes: IProAthlete[]) {

    const teams: IProTeam[] = [];

    const seenTeamIds = new Set<string>();
    const uniquePositions = new Set<string>();

    athletes.forEach((athlete) => {

        if (!athlete.team) return;

        if (!seenTeamIds.has(athlete.team?.athstat_id)) {
            seenTeamIds.add(athlete.team?.athstat_id);
            teams.push(athlete.team);
        }

        if (athlete.position) {
            uniquePositions.add(athlete.position);
        }
    });

    const positions = Array.of(...uniquePositions);


    return { teams, positions };
}

/**
 * Determines if a stat action value is the best (highest) among all compared players
 */
export function isStatActionBest(
    athlete: IProAthlete,
    value: number | undefined,
    statKey: PlayerAggregateStatAction,
    comparePlayerStats: IComparePlayerStats[]
): boolean {
    if (value === undefined || comparePlayerStats.length <= 1) return false;

    const allValues = comparePlayerStats
        .map(playerStat => {
            const stat = getPlayerAggregatedStat(statKey, playerStat.stats);
            return stat?.action_count;
        })
        .filter((val): val is number => val !== undefined);

    if (allValues.length < 1) return false;

    const maxValue = Math.max(...allValues);
    return value === maxValue && allValues.filter(v => v === maxValue).length === 1;
}

export function isSportActionBest(
    value: number | undefined,
    statDisplayName: string | undefined,
    comparePlayerStats: IComparePlayerStats[]
): boolean {
    if (value === undefined || statDisplayName === undefined) return false;

    const allValues = comparePlayerStats
        .map(playerStat => {

            console.log("Player Actions at some point ", playerStat);

            const stat = playerStat.stats.find((s) => {
                return s.definition?.display_name === statDisplayName
            })

            return stat?.action_count;
        })
        .filter((val): val is number => val !== undefined);

    if (allValues.length < 1) return false;

    const maxValue = Math.max(...allValues);
    return value === maxValue && allValues.filter(v => v === maxValue).length === 1;
}

/**
 * Determines if a star rating value is the best (highest) among all compared players
 */
export function isStarRatingBest(
    athlete: IProAthlete,
    value: number | undefined,
    starRatingKey: keyof IAthleteSeasonStarRatings,
    compareStarRatings: ICompareStarRatingsStats[]
): boolean {
    if (value === undefined || compareStarRatings.length <= 1) return false;

    const allValues = compareStarRatings
        .map(playerRating => playerRating.stats[starRatingKey])
        .filter((val): val is number => val !== undefined);

    if (allValues.length <= 1) return false;

    const maxValue = Math.max(...allValues);
    return value === maxValue && allValues.filter(v => v === maxValue).length === 1;
}

/**
 * Determines if a power rating value is the best (highest) among all compared players
 */
export function isPowerRatingBest(
    athlete: IProAthlete,
    comparePlayers: IProAthlete[]
): boolean {
    let maxVal: number = 0;

    comparePlayers.forEach((p) => {
        if (p.power_rank_rating && (p.power_rank_rating > maxVal)) {
            maxVal = p.power_rank_rating;
        }
    });


    return maxVal === athlete.power_rank_rating;
}

/** Get Frame Src by the given position class */
export function getPositionFrameBackground(positionClass: string) {

    positionClass = positionClass.toLowerCase();

    const frameByPosition: Record<string, string> = {
        'front-row': '/player_card_backgrounds/front-row-bg.png',
        'second-row': '/player_card_backgrounds/second-row-bg.png',
        'back-row': '/player_card_backgrounds/back-row-bg.png',
        'half-back': '/player_card_backgrounds/half-back-bg.png',
        back: '/player_card_backgrounds/back-bg.png',
    };
    const frameSrc = frameByPosition[positionClass] || '/player_card_backgrounds/back-bg.png';

    return frameSrc ?? '/player_card_backgrounds/front-row-bg.png';

}


export function getTeamJerseyImage(teamId: string) {
    const teamFallbackUrl = teamId
        ? `https://athstat-landing-assets-migrated.s3.us-east-1.amazonaws.com/logos/${teamId}-ph-removebg-preview.png`
        : undefined;

    return teamFallbackUrl;
}

/** Calculates the total amount of spent aquiring a team */
export function calculateTeamTotalSpent(team: FantasyLeagueTeamWithAthletes | IFantasyLeagueTeam) {
    return team.athletes.reduce((sum, player) => sum + (player.purchase_price || 0), 0)
}

export function hashFantasyTeamAthlete(a: IFantasyTeamAthlete) {
    const aEntry = `${a.athlete_id}-${a.is_captain}-${a.is_starting}-${a.price}`;
    return aEntry;
}

export function hashFantasyTeamAthletes(athletes: IFantasyTeamAthlete[]) {
    return athletes.reduce((hash, a) => {
        const aEntry = hashFantasyTeamAthlete(a);

        return hash === "" ? hash + `${aEntry}` : hash + `:${aEntry}`;
    }, "");
}

export function sortFantasyTeamAthletes(athletes: IFantasyTeamAthlete[]) {
    return athletes.sort((a, b) => {
        return a.slot - b.slot;
    })
}