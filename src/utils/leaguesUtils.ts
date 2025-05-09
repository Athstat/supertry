import { differenceInDays } from "date-fns";
import { IFantasyLeague } from "../types/fantasyLeague";

/** Filters to only remain with leagues that seven days away */
export function activeLeaguesFilter(leagues: IFantasyLeague[]) {

    return leagues.filter((l) => {

        if (!l.join_deadline) {
            return false;
        }

        const today = new Date()
        const deadline = new Date(l.join_deadline);
        const daysDiff = differenceInDays(deadline, today);

        return daysDiff <= 5;
    })
    .sort((a,b) => {
        
        const aDeadline = new Date(a.join_deadline ?? 0);
        const bDealine = new Date(b.join_deadline ?? 0);

        return aDeadline.valueOf() - bDealine.valueOf();
    })
}

export function isLeagueOnTheClock (league: IFantasyLeague, targetDiff: number) {
    const {join_deadline} = league;

    if (!join_deadline) return false;

    const today = new Date();
    const deadline = new Date(join_deadline);

    const diff = deadline.valueOf() - today.valueOf();

    return diff >= 0 && diff <= targetDiff;
}