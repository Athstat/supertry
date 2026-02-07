import { PositionClass } from "../../types/athletes";
import { IFantasyLeagueTeam } from "../../types/fantasyLeague";
import { defaultFantasyPositions, FantasyPositionName, IFantasyLeagueTeamSlot, IFantasyPosition } from "../../types/fantasyLeagueTeam";
import { formatPosition } from "../athletes/athleteUtils";

/** Gets storage key for saving team in local storage */
export function getMyTeamStorageKey(leagueRoundId: string | number, authUserId: string) {
    return `local-team-save-for-user-${authUserId}-for-round-${leagueRoundId}`;
}

export function getSlotsFromTeam(team: IFantasyLeagueTeam): IFantasyLeagueTeamSlot[] {
    return team.athletes.map((a) => {

        const defaultPosition = {
            name: formatPosition(a.position_class) as FantasyPositionName,
            position_class: (a.position_class || '') as PositionClass,
            isSpecial: !a.is_starting
        } as IFantasyPosition

        return {
            athlete: a,
            slotNumber: a.slot,
            purchasePrice: a.purchase_price,
            is_starting: Boolean(a.is_starting),
            isCaptain: Boolean(a.is_captain),
            position: defaultFantasyPositions.at(a.slot) ?? defaultPosition
        }
    })
}