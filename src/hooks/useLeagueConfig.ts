import { IGamesLeagueConfig } from "../types/leagueConfig";

/** Fetches the league config */
export function useLeagueConfig(seasonId?: string) {
    const leagueConfig = getFallbackConfig(seasonId || '');

    return {
        leagueConfig,
        isLoading: false
    };
}

function getFallbackConfig(leagueId: string) : IGamesLeagueConfig {
    return {
        "league_id": leagueId,
        "league": leagueId,
        "team_budget": 240.0,
        "lineup_size": 5,
        "bench_size": 0,
        "min_slot_index": 1,
        "max_slot_index": 5,
        "transfers_allowed": 0,
        "current_round": 18,
        "transfers_activated": true,
        "allowed_positions": [],
        "starting_positions": []
    }
}