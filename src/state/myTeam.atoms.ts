import { atom } from "jotai";
import { MAX_TEAM_BUDGET } from "../types/constants";
import { IFantasyTeamAthlete, IFantasyClubTeam } from "../types/fantasyTeamAthlete";

export const fantasyTeamValueAtom = atom<number>(0);
export const remainingTeamBudgetAtom = atom((get) => MAX_TEAM_BUDGET - get(fantasyTeamValueAtom))
export const fantasyTeamAthletesAtom = atom<IFantasyTeamAthlete[]>([]);
export const fantasyTeamAtom = atom<IFantasyClubTeam>();

export const fantasyTeamPointsAtom = atom((get) => {
    const athletes = get(fantasyTeamAthletesAtom);
    return athletes.reduce((sum, a) => {
        return sum + (a.score ?? 0);
    }, 0)
});