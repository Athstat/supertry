import { differenceInDays } from "date-fns";
import { IFantasyLeague } from "../types/fantasyLeague";

/** Filters to only remain with leagues that seven days away */
export function activeLeaguesFilter(leagues: IFantasyLeague[]) {

    return leagues.filter((l) => {

        if (!l.join_deadline) {
            return true;
        }

        const today = new Date()
        const deadline = new Date(l.join_deadline);
        const daysDiff = differenceInDays(deadline, today);

        console.log(daysDiff, " is in 7 days? ", 7 >= daysDiff);

        return daysDiff <= 7;
    })
}