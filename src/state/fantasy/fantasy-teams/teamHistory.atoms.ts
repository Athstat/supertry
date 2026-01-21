/** Team History is  feaure on scrummy that allows you to
 * flip the switch and view a teams state from previous weeks
 */

import { atom } from "jotai";
import { IFantasyLeagueTeam } from "../../../types/fantasyLeague";
import { DjangoUserMinimal } from "../../../types/auth";
import { ISeasonRound } from "../../../types/fantasy/fantasySeason";

/** Holds the current league round atom to fetch team from */
export const teamHistoryCurrentRoundAtom = atom<ISeasonRound>();

/** Holds the current league round team to display */
export const teamHistoryCurrentTeamAtom = atom<IFantasyLeagueTeam>();

/** Export holds the user id of the manager of a team */
export const teamHistoryTeamManagerAtom = atom<DjangoUserMinimal>();

export const teamHistoryAtoms = {
    teamHistoryCurrentRoundAtom,
    teamHistoryCurrentTeamAtom
}
