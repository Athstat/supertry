// Sort Players by Offensive Stats


import { BoxscoreListRecordItem, GameSportAction, IBoxScoreItem } from "../types/boxScore";

export function rankByAttackingStats(stats: IBoxScoreItem[]) {
    
    return stats.sort((a, b) => {
        return attackBias(b) - attackBias(a);
    });

}

export function rankByDefensiveStats(stats: IBoxScoreItem[]) {
    
    return stats.sort((a, b) => {
        return defenseBias(b) - defenseBias(a);
    });

}

export function rankByKickingStats(stats: IBoxScoreItem[]) {
    
    return stats.sort((a, b) => {
        return defenseBias(b) - defenseBias(a);
    });

}

export function rankByDisciplineStats(stats: IBoxScoreItem[]) {
    
    return stats.sort((a, b) => {
        return defenseBias(b) - defenseBias(a);
    });

}


export function attackBias(statLine: IBoxScoreItem) {
    let total = 0;

    const {tries, passes, carries, points, defendersbeaten} = statLine;

    if (points != null) {
        total += points * 4;
    }

    if (tries != null) {
        total += tries * 5
    }

    if (carries != null) {
        total += carries * 1
    }

    if (passes != null) {
        total += passes * 0.2
    }

    if (defendersbeaten != null) {
        total += defendersbeaten * 1
    }

    return total;
}

export function defenseBias(statLine: IBoxScoreItem) {
    let total = 0;

    const {tacklesmade, tacklesmissed, lineoutswonsteal, retainedkicks, turnoverswon, redcards, yellowcards} = statLine;

    if (tacklesmade != null) {
        total += tacklesmade * 6;
    }

    if (tacklesmissed != null) {
        total -= tacklesmissed;
    }

    if (tacklesmade !== null && tacklesmissed != null) {
        const totalTackles = tacklesmade + tacklesmissed;
        const percentage = tacklesmade / totalTackles;

        total += percentage * 4;
    }

    if (turnoverswon != null) {
        total += turnoverswon * 5;
    }

    if (retainedkicks != null) {
        total += retainedkicks * 3
    }

    if (lineoutswonsteal != null) {
        total += lineoutswonsteal * 2
    }

    if (yellowcards != null) {
        total -= yellowcards * 2
    }

    if (redcards != null) {
        total -= redcards * 3
    }

    return total;
}

export function kickingBias(statLine: IBoxScoreItem) {
    let total = 0;

    const {dropgoalsscored, kicksfromhand, kicksfromhandmetres} = statLine;

    if (kicksfromhand != null) {
        total += kicksfromhand * 5;
    }

    if (kicksfromhandmetres != null) {
        total += kicksfromhandmetres * 4;
    }

    
    if (dropgoalsscored != null) {
        total += dropgoalsscored * 3;
    }

    return total;
}

export function disciplineBias(statLine: IBoxScoreItem) {
    let total = 0;

    const {redcards, yellowcards} = statLine;

    if (redcards != null) {
        total += redcards * 5;
    }

    if (yellowcards != null) {
        total += yellowcards * 4;
    }

    return total;
}

export function aggregateTeamStats(teamId: string, boxScore: IBoxScoreItem[]) {
    let points = 0
    let tries = 0;
    let convertionsScored = 0;
    let convertionsMissed = 0;
    let penaltiesScored = 0;
    let penaltiesConceded = 0;
    let dropGoalsScored = 0;
    const kicksAtGoal = 0;
    let lineOutsWon = 0;
    let turnoversWon = 0;
    let turnoversConceded = 0;
    let redCards = 0;
    let yellowCards = 0;

    boxScore
    .filter(bs => bs.athlete.team_id === teamId)
    .forEach((bs) => {
        points += bs.points;
        tries += bs.tries;
        convertionsScored += bs.conversionsscored;
        convertionsMissed += bs.conversionsmissed;
        penaltiesConceded += bs.penaltiesconceded;
        penaltiesScored +=bs.penaltygoalsscored;
        dropGoalsScored += bs.dropgoalsscored;
        // kicksAtGoal += bs.trykicks;
        lineOutsWon += bs.lineoutswon;
        turnoversWon += bs.turnoverswon;
        turnoversConceded += bs.turnoversconceded;
        redCards += bs.redcards;
        yellowCards += bs.yellowcards;
    });

    return {
        points,
        tries,
        convertionsScored,
        convertionsMissed,
        penaltiesScored,
        penaltiesConceded,
        dropGoalsScored,
        kicksAtGoal,
        lineOutsWon,
        turnoversWon,
        turnoversConceded,
        redCards,
        yellowCards
    }
}

export function convertionsStr(made: number, missed: number) {

    if (Number.isNaN(made) || Number.isNaN(missed)) {
        return "-"
    }

    const total = made + missed;

    if (total === 0) {
        return "0/0";
    }

    return `${made}/${total}`;
}

/** Calculates the convertions percentage value out of 100 */
export function convertionsPercVal(made: number, missed: number) {

    if (Number.isNaN(made) || Number.isNaN(missed)) {
        return 0;
    }

    const total = made + missed;

    if (total === 0) {
        return 0;
    }

    return (made/total) * 100;
}


export function allStatsBoxscoreList(bs: GameSportAction[], teamId: string): BoxscoreListRecordItem[] {
    const athleteIds: string[] = [];

    bs.forEach((b) => {
        if (!athleteIds.includes(b.athlete_id) && b.team_id === teamId) {
            athleteIds.push(b.athlete_id);
        }
    });

    const athleteStats: BoxscoreListRecordItem[] = athleteIds.map((a) => {
        const stats = bs.filter((b) => b.athlete_id === a);

        const tries = stats.find((b) => b.action === "tries")?.action_count;
        const points = stats.find((b) => b.action === "points")?.action_count;
        const tryAssits = stats.find((b) => b.action === "try_assits")?.action_count;
        const carries = stats.find((b) => b.action === "carry_dominant")?.action_count;
        const tackles = stats.find((b) => b.action === "tackles")?.action_count;
        const tackleSuccess = stats.find((b) => b.action === "tackle_success")?.action_count;
        const postContactMetres = stats.find((b) => b.action === "post_contact_metres")?.action_count;
        const ruckArrivals = stats.find((b) => b.action === "ruck_arrival")?.action_count;
        const defendersBeaten = stats.find((b) => b.action === "defenders_beaten")?.action_count;

        const tacklingPerc = Math.floor((tackleSuccess ?? 0) * 100)

        return {
            stats: [
                Math.floor(tries ?? 0),
                Math.floor(points ?? 0),
                Math.floor(tryAssits ?? 0),
                Math.floor(carries ?? 0),
                `${Math.floor(tackles ?? 0)}`,
                tacklingPerc + "%",
                Math.floor(postContactMetres ?? 0),
                Math.floor(ruckArrivals ?? 0),
                Math.floor(defendersBeaten ?? 0)
            ],
            athleteId: a
        }
    }).sort((a, b) => {
        const [, points] = a.stats;
        const [, bPoints] = b.stats;

        return ((bPoints as number) ?? 0) - ((points as number) ?? 0)
    });


    return athleteStats;

}

export function attackBoxscoreList(bs: GameSportAction[], teamId: string): BoxscoreListRecordItem[] {
    const athleteIds: string[] = [];

    bs.forEach((b) => {
        if (!athleteIds.includes(b.athlete_id) && b.team_id === teamId) {
            athleteIds.push(b.athlete_id);
        }
    });

    const athleteStats: BoxscoreListRecordItem[] = athleteIds.map((a) => {
        const stats = bs.filter((b) => b.athlete_id === a);

        const tries = stats.find((b) => b.action === "tries")?.action_count;
        const points = stats.find((b) => b.action === "points")?.action_count;
        const passes = stats.find((b) => b.action === "carry_dominant")?.action_count;

        return {
            stats: [Math.floor(tries ?? 0), Math.floor(points ?? 0), Math.floor(passes ?? 0)],
            athleteId: a
        }
    }).sort((a, b) => {
        const [, points] = a.stats;
        const [, bPoints] = b.stats;

        return (bPoints ?? 0) - (points ?? 0)
    });


    return athleteStats;

}


export function defenseBoxscoreList(bs: GameSportAction[], teamId: string): BoxscoreListRecordItem[] {
    const athleteIds: string[] = [];

    bs.forEach((b) => {
        if (!athleteIds.includes(b.athlete_id) && b.team_id === teamId) {
            athleteIds.push(b.athlete_id);
        }
    });

    const athleteStats: BoxscoreListRecordItem[] = athleteIds.map((a) => {
        const stats = bs.filter((b) => b.athlete_id === a);

        const tackles = stats.find((b) => b.action === "tackles")?.action_count;
        const tackleSuccess = stats.find((b) => b.action === "tackle_success")?.action_count;
        const dominantTackles = stats.find((b) => b.action === "dominant_tackles")?.action_count;
        const turnoversWon = stats.find((b) => b.action === "turnover_won")?.action_count;

        const tacklingPerc = Math.floor((tackleSuccess ?? 0) * 100)

        return {
            stats: [
                Math.floor(tackles ?? 0),
                `${tacklingPerc}%`,
                Math.floor(dominantTackles ?? 0),
                Math.floor(turnoversWon ?? 0)
            ],
            athleteId: a
        }
    }).sort((a, b) => {
        const [tackles] = a.stats;
        const [bTackles] = b.stats;

        return ((bTackles as number) ?? 0) - ((tackles as number) ?? 0)
    }).filter((a) => {
        const [x] = a.stats;

        return (x as number) > 0;
    });


    return athleteStats;

}


export function kickingBoxscoreList(bs: GameSportAction[], teamId: string): BoxscoreListRecordItem[] {
    const athleteIds: string[] = [];

    bs.forEach((b) => {
        if (!athleteIds.includes(b.athlete_id) && teamId === b.team_id) {
            athleteIds.push(b.athlete_id);
        }
    });

    const athleteStats: BoxscoreListRecordItem[] = athleteIds.map((a) => {
        const stats = bs.filter((b) => b.athlete_id === a);

        const conversion_goals = stats.find((b) => b.action === "conversion_goals")?.action_count;
        const drop_goals_scored = stats.find((b) => b.action === "drop_goals_converted")?.action_count;
        const penalty_goals = stats.find((b) => b.action === "kick_penalty_good")?.action_count;

        return {
            stats: [Math.floor(conversion_goals ?? 0), Math.floor(drop_goals_scored ?? 0), Math.floor(penalty_goals ?? 0)],
            athleteId: a
        }
    }).sort((a, b) => {
        const [conversion_goals] = a.stats;
        const [bConversion_goals] = b.stats;

        return (bConversion_goals ?? 0) - (conversion_goals ?? 0)
    }).filter((a) => {
        const [x, b, c] = a.stats;

        return (x > 0) || (b > 0) || (c > 0)
    });


    return athleteStats;

}

export function disciplineBoxscoreList(bs: GameSportAction[], teamId: string): BoxscoreListRecordItem[] {
    const athleteIds: string[] = [];

    bs.forEach((b) => {
        if (!athleteIds.includes(b.athlete_id) && teamId === b.team_id) {
            athleteIds.push(b.athlete_id);
        }
    });

    const athleteStats: BoxscoreListRecordItem[] = athleteIds.map((a) => {
        const stats = bs.filter((b) => b.athlete_id === a);

        const red_cards = stats.find((b) => b.action === "red_cards")?.action_count;
        const yellow_cards = stats.find((b) => b.action === "yellow_cards")?.action_count;

        return {
            stats: [Math.floor(red_cards ?? 0), Math.floor(yellow_cards ?? 0)],
            athleteId: a
        }
    }).sort((a, b) => {
        const [redCards] = a.stats;
        const [bRedCards] = b.stats;

        return (bRedCards ?? 0) - (redCards ?? 0)

    }).filter((a) => {
        const [x, b] = a.stats;

        return (x > 0) || (b > 0);
    });


    return athleteStats;

}
