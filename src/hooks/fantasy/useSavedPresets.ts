import { useEffect, useState } from "react";
import { IFantasyLeagueRound } from "../../types/fantasyLeague";
import { TeamPreset, teamPresetsService } from "../../services/fantasy/teamPresetsService";
import { useAuth } from "../../contexts/AuthContext";

// Load saved team presets for the season (scoped to current user)
export function useSavedPresets(leagueRound?: IFantasyLeagueRound) {

    const [presets, setPresets] = useState<TeamPreset[]>();
    const [isLoading, setLoading] = useState<boolean>(false);
    const {authUser} = useAuth();

    useEffect(() => {
        const loadPresets = async () => {
            if (!leagueRound || !authUser) return;
            try {

                setLoading(true);

                const res = await teamPresetsService.list({
                    userId: authUser.kc_id,
                    seasonId: leagueRound.season_id,
                });

                setPresets(res);

            } catch (e) {
                console.error('Failed to load team presets', e);
            } finally {
                setLoading(false);
            }
        };
        loadPresets();
    }, [authUser, leagueRound]);

    return {
        presets,
        isLoading
    }
}