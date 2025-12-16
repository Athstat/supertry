import { useAtom } from "jotai";
import { dashboardAtoms } from "../../state/dashboard/dashboard.atoms";
import { fantasySeasonsAtom } from "../../state/fantasy/fantasyLeagueScreen.atoms";

/** useDashboard is a useful hook to read state of the dashboard screen */
export function useDashboard() {
    const [fantasySeasons,] = useAtom(fantasySeasonsAtom);
    const [currentSeason,] = useAtom(dashboardAtoms.currentSeasonAtom);
    const [seasonRounds,] = useAtom(dashboardAtoms.seasonRoundsAtom);
    const [currentRound,] = useAtom(dashboardAtoms.currentSeasonRoundAtom);
    const [selectedSeason] = useAtom(dashboardAtoms.selectedDashboardSeasonAtom);

    return {
        fantasySeasons,
        currentSeason,
        seasonRounds,
        currentRound,
        selectedSeason
    }

}