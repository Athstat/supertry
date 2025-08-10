import { useEffect, useState } from "react";
import { leagueService } from "../services/leagueService";
import { IGamesLeagueConfig } from "../types/leagueConfig";
import { IFantasyLeagueRound } from "../types/fantasyLeague";

/** Fetches the league config */
export function useLeagueConfig(league: IFantasyLeagueRound | undefined) {

    const [leagueConfig, setLeagueConfig] = useState<IGamesLeagueConfig | null>(null);

    useEffect(() => {
        const fetchLeagueConfig = async () => {
            if (!league?.id) {
                return;
            }

            try {
                const config = await leagueService.getLeagueConfig(
                    league?.official_league_id
                );
                if (config) {
                    setLeagueConfig(config);
                    console.log("League config: ", config);
                } else {
                    console.log("Failed to load league configuration");
                }
            } catch (err) {
                console.error("Error fetching league config:", err);
                console.log("An error occurred while loading league configuration");
            }
        };

        fetchLeagueConfig();
    }, [league?.id]);

    return leagueConfig;
}