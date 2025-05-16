// Sort Players by Offensive Stats

import { IBoxScoreItem } from "../types/boxScore";

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
    let kicksAtGoal = 0;
    let lineOutsWon = 0;
    let turnoversWon = 0;
    let turnoversConceded = 0;
    let redCards = 0;
    let yellowCards = 0;

    boxScore
    .filter(bs => bs.athlete_team_id === teamId)
    .forEach((bs) => {
        points += bs.points;
        tries += bs.tries;
        convertionsScored += bs.convertionsScored;
        convertionsMissed += bs.convertionsMissed;
        penaltiesConceded += bs.penaltiesconceded;
        penaltiesScored +=bs.penaltygoalsscored;
        dropGoalsScored += bs.dropgoalsscored;
        kicksAtGoal += bs.trykicks;
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