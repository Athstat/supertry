import { useAtom, useAtomValue } from "jotai";
import { fantasySeasonsAtoms } from "../../state/dashboard/dashboard.atoms";
import { fantasySeasonsAtom } from "../../state/fantasy/fantasyLeagueScreen.atoms";

/** useDashboard is a useful hook to read state of the fantasys easons */
export function useFantasySeasons() {
    
    const [fantasySeasons,] = useAtom(fantasySeasonsAtom);
    const [currentSeason, setCurrentSeason] = useAtom(fantasySeasonsAtoms.currentSeasonAtom);
    const [seasonRounds,] = useAtom(fantasySeasonsAtoms.seasonRoundsAtom);
    const [currentRound,] = useAtom(fantasySeasonsAtoms.currentSeasonRoundAtom);
    const [selectedSeason] = useAtom(fantasySeasonsAtoms.selectedDashboardSeasonAtom);
    const isLoading = useAtomValue(fantasySeasonsAtoms.isFantasySeasonsLoadingAtom);

    return {
        fantasySeasons,
        currentSeason,
        seasonRounds,
        currentRound,
        selectedSeason,
        isLoading,
        setCurrentSeason
    }

}