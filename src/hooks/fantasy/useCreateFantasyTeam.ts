import { useFantasyLeagueTeam } from "../../components/fantasy-leagues/my-team/FantasyLeagueTeamProvider";

/** Hook for accessing create team functionality */
export function useCreateFantasyTeam() {
    return useFantasyLeagueTeam();
}