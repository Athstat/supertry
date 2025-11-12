/** Team History is  feaure on scrummy that allows you to
 * flip the switch and view a teams state from previous weeks
 */

import { atom } from "jotai";
import { FantasyLeagueTeamWithAthletes, IFantasyLeagueRound } from "../../../types/fantasyLeague";
import { DjangoUserMinimal } from "../../../types/auth";

/** Holds the current league round atom to fetch team from */
export const teamHistoryCurrentRoundAtom = atom<IFantasyLeagueRound>();

/** Holds the current league round team to display */
export const teamHistoryCurrentTeamAtom = atom<FantasyLeagueTeamWithAthletes>();

/** Export holds the user id of the manager of a team */
export const teamHistoryTeamManagerAtom = atom<DjangoUserMinimal>();

export const teamHistoryAtoms = {
    teamHistoryCurrentRoundAtom,
    teamHistoryCurrentTeamAtom
}
