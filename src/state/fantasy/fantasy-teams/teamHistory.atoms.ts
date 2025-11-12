/** Team History is  feaure on scrummy that allows you to
 * flip the switch and view a teams state from previous weeks
 */

import { atom } from "jotai";
import { IFantasyLeagueRound, IFantasyLeagueTeam } from "../../../types/fantasyLeague";

/** Holds the current league round atom to fetch team from */
export const teamHistoryCurrentRoundAtom = atom<IFantasyLeagueRound>();

/** Holds the current league round team to display */
export const teamHistoryCurrentTeamAtom = atom<IFantasyLeagueTeam>();