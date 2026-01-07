import { useEffect, useState } from "react";
import { leagueService } from "../services/leagueService";
import { IGamesLeagueConfig } from "../types/leagueConfig";
import { useDebounced } from "./web/useDebounced";



/** Fetches the league config */
export function useLeagueConfig(seasonId?: string) {

    const [isLoading, setLoading] = useState<boolean>(false);
    const [leagueConfig, setLeagueConfig] = useState<IGamesLeagueConfig>(
        getFallbackConfig(seasonId ?? "")
    );

    const debouncedLoading = useDebounced(isLoading, 500);

    useEffect(() => {
        const fetchLeagueConfig = async () => {
            if (!seasonId) {
                return;
            }

            setLoading(true);

            try {

                const config = await leagueService.getLeagueConfig(
                    seasonId ?? ""
                );

                if (config) {
                    setLeagueConfig(config);
                } else {
                    console.log("Failed to load league configuration");
                }
            } catch (err) {
                console.error("Error fetching league config:", err);
            }

            setLoading(false);
        };

        fetchLeagueConfig();
    }, [seasonId]);

    return {
        leagueConfig,
        isLoading: debouncedLoading
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