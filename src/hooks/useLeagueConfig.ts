import { useEffect, useState } from "react";
import { leagueService } from "../services/leagueService";
import { IGamesLeagueConfig } from "../types/leagueConfig";
import { useDebounced } from "./useDebounced";

/** Fetches the league config */
export function useLeagueConfig(seasonId?: string) {

    const [isLoading, setLoading] = useState<boolean>(false);
    const [leagueConfig, setLeagueConfig] = useState<IGamesLeagueConfig | null>(null);

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
                    console.log("League config: ", config);
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