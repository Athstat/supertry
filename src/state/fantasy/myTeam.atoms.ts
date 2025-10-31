import { atom } from "jotai";
import { MyTeamViewMode } from "../../types/fantasy/myTeam";

/** holds the current view mode for my team */
export const myTeamModeAtom = atom<MyTeamViewMode>("pitch");