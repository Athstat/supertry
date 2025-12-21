import { useAtom, useAtomValue } from "jotai";
import { fantasySeasonsAtoms } from "../../state/dashboard/dashboard.atoms";
import { fantasySeasonsAtom } from "../../state/fantasy/fantasyLeagueScreen.atoms";
import { useMemo } from "react";

/** useDashboard is a useful hook to read state of the fantasys easons */
export function useFantasySeasons() {
    
    const [fantasySeasons,] = useAtom(fantasySeasonsAtom);
    const [currentSeason] = useAtom(fantasySeasonsAtoms.currentSeasonAtom);
    const [seasonRounds,] = useAtom(fantasySeasonsAtoms.seasonRoundsAtom);
    const [currentRound,] = useAtom(fantasySeasonsAtoms.currentSeasonRoundAtom);
    const [selectedSeason, setSelectedSeason] = useAtom(fantasySeasonsAtoms.selectedDashboardSeasonAtom);
    const isLoading = useAtomValue(fantasySeasonsAtoms.isFantasySeasonsLoadingAtom);

    const diplaySeason = useMemo(() => {
        return currentSeason || selectedSeason;
    }, [currentSeason, selectedSeason]);

    return {
        fantasySeasons,
        currentSeason,
        seasonRounds,
        currentRound,
        selectedSeason: diplaySeason,
        isLoading,
        setSelectedSeason
    }

}