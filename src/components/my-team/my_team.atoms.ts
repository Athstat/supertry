import { atom } from "jotai";
import { MAX_TEAM_BUDGET } from "../../types/constants";

export const teamValueAtom = atom<number>(0);
export const remainingTeamBudgetAtom = atom((get) => MAX_TEAM_BUDGET - get(teamValueAtom))