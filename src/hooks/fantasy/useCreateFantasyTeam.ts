import { useFantasyLeagueTeam } from "../../providers/fantasy_teams/FantasyTeamProvider";


/** Hook for accessing create team functionality */
export function useCreateFantasyTeam() {
    return useFantasyLeagueTeam();
}