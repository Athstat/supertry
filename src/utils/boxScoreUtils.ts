// Sort Players by Offensive Stats

import { IBoxScore } from "../types/boxScore";

export function rankByAttackingStats(stats: IBoxScore[]) {
    
    return stats.sort((a, b) => {
        return attackBias(b) - attackBias(a);
    });

}

export function rankByDefensiveStats(stats: IBoxScore[]) {
    
    return stats.sort((a, b) => {
        return defenseBias(b) - defenseBias(a);
    });

}

export function rankByKickingStats(stats: IBoxScore[]) {
    
    return stats.sort((a, b) => {
        return defenseBias(b) - defenseBias(a);
    });

}

export function rankByDisciplineStats(stats: IBoxScore[]) {
    
    return stats.sort((a, b) => {
        return defenseBias(b) - defenseBias(a);
    });

}


export function attackBias(statLine: IBoxScore) {
    let total = 0;

    const {tries, passes, carries, points, defendersbeaten} = statLine;

    if (points != null) {
        total += points * 5;
    }

    if (tries != null) {
        total += tries * 4
    }

    if (carries != null) {
        total += carries * 3
    }

    if (passes != null) {
        total += passes * 2
    }

    if (defendersbeaten != null) {
        total += defendersbeaten * 1
    }

    return total;
}

export function defenseBias(statLine: IBoxScore) {
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

export function kickingBias(statLine: IBoxScore) {
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

export function disciplineBias(statLine: IBoxScore) {
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

export function aggregateTeamStats(teamId: string, boxScore: IBoxScore[]) {
    let points = 0
    let tries = 0;
    let conversionsScored = 0;
    let conversionsMissed = 0;
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
        conversionsScored += bs.conversionsscored;
        conversionsMissed += bs.conversionsmissed;
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
        conversionsScored,
        conversionsMissed,
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