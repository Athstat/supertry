import { atom } from "jotai";
import { MAX_TEAM_BUDGET } from "../../types/constants";
import { IFantasyClubTeam, IFantasyTeamAthlete } from "../../types/fantasyTeamAthlete";
import { IFantasyLeague } from "../../types/fantasyLeague";

export const fantasyTeamValueAtom = atom<number>(0);
export const remainingTeamBudgetAtom = atom((get) => MAX_TEAM_BUDGET - get(fantasyTeamValueAtom))
export const fantasyTeamAthletesAtom = atom<IFantasyTeamAthlete[]>([]);
export const fantasyTeamAtom = atom<IFantasyClubTeam>();
export const fantasyLeagueAtom = atom<IFantasyLeague>();