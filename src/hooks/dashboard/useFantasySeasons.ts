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

    const previousRound = useMemo(() => {
        if (currentRound && seasonRounds) {
            return seasonRounds.find((r) => {
                return r.round_number = currentRound.round_number - 1
            });
        }

        return undefined;

    }, [seasonRounds, currentRound]);


    const scoringRound = useMemo(() => {
        const now = new Date();

        const curr_kickoff = currentRound?.games_start ? new Date(currentRound?.games_start) : undefined

        if (curr_kickoff && curr_kickoff.valueOf() <= now.valueOf()) {
            return currentRound
        }

        return previousRound || currentRound;

    }, [currentRound, previousRound]);

    return {
        fantasySeasons,
        currentSeason,
        seasonRounds,
        currentRound,
        selectedSeason: diplaySeason,
        isLoading,
        setSelectedSeason,

        /** Previous round to the current round */
        previousRound,
        /** The round to display scored for in the app */
        scoringRound
    }

}