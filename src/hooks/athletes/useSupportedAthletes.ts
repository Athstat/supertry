import { useMemo } from "react";
import useSWR from "swr";
import { useAthletes } from "../../contexts/AthleteContext";
import { seasonService } from "../../services/seasonsService";
import { IProAthlete } from "../../types/athletes";

export function useSupportedAthletes() {
    const { athletes, isLoading: loadingAthletes} = useAthletes();

    const activeSeasonIdForFetch = useMemo(() => {
        // if (selectedSeason?.id) return selectedSeason.id;
        // if (selectedFantasySeasonId && selectedFantasySeasonId !== 'all')
        //   return selectedFantasySeasonId;
        return '9e74bed3-9ea2-5f41-a906-434d0d3e8f4e';
    }, []);

    // Fetch players for the selected season when a season is chosen (Overview uses context athletes)
    const {
        data: seasonPlayers,
        isLoading: loadingSeason,
    } = useSWR(
        activeSeasonIdForFetch ? `seasons/${activeSeasonIdForFetch}/athletes` : null,
        () => seasonService.getSeasonAthletes(activeSeasonIdForFetch!),
        { revalidateOnFocus: false, dedupingInterval: 5 * 60 * 1000, keepPreviousData: true }
    );

    // Choose dataset by selection
    const displayedAthletes: IProAthlete[] = useMemo(() => {
        if (activeSeasonIdForFetch) return (seasonPlayers as unknown as IProAthlete[]) ?? [];
        return athletes;
    }, [activeSeasonIdForFetch, athletes, seasonPlayers]);

    const isLoading = loadingSeason || loadingAthletes;

    return {
        athletes: displayedAthletes,
        isLoading
    }
}