// Sort Players by Offensive Stats

import { IBoxScore } from "../types/boxScore";

export function rankByAttackingStats(stats: IBoxScore[]) {
    
    return stats.sort((a, b) => {
        return attackBias(a) - attackBias(b);
    });

}

export function rankByDeffensiveStats(stats: IBoxScore[]) {
    
    return stats.sort((a, b) => {
        return defenseBias(a) - defenseBias(b);
    });

}


function attackBias(statLine: IBoxScore) {
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

function defenseBias(statLine: IBoxScore) {
    let total = 0;

    const {tacklesmade, tacklesmissed, lineoutswonsteal, retainedkicks, turnoverswon, redcards, yellowcards} = statLine;

    if (tacklesmade !== null && tacklesmissed != null) {
        const totalTackles = tacklesmade + tacklesmissed;
        const percentage = tacklesmade / totalTackles;

        total += percentage * 5;
    }

    if (turnoverswon != null) {
        total += turnoverswon * 4;
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