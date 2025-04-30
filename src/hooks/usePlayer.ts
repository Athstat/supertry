import { useEffect, useState } from "react";
import { RugbyPlayer } from "../types/rugbyPlayer";
import { useAthletes } from "../contexts/AthleteContext";
import { useLocation } from "react-router-dom";
import { athleteService } from "../services/athleteService";

export function usePlayer(id?: string) {

    const location = useLocation();
    const [player, setPlayer] = useState<RugbyPlayer>(location.state?.player || undefined);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>();

    const { getAthleteById } = useAthletes();

    useEffect(() => {

        const fetchPlayer = async () => {

            if (!player && id) {
                try {

                    setIsLoading(true);

                    const cachedPlayer = getAthleteById(id);

                    if (cachedPlayer) {
                        setPlayer(cachedPlayer);
                    } else {
                        const data = await athleteService.getAthleteById(id);
                        setPlayer(data);
                    }
                } catch (err) {
                    setError(
                        err instanceof Error ? err.message : "Failed to load player"
                    );
                    console.error("Error fetching player:", err);
                } finally {
                    setIsLoading(false);
                }
            }
        };

        fetchPlayer();
    }, [id, player, getAthleteById]);

    return {player, isLoading, error}
}