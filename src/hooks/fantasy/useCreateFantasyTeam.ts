import { useMyTeam } from "./my_team/useMyTeam";

/** Hook for accessing create team functionality */
export function useCreateFantasyTeam() {
    return useMyTeam();
}