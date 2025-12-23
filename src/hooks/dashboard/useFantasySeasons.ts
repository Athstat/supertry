import { useAtom, useAtomValue } from "jotai";
import { fantasySeasonsAtoms } from "../../state/dashboard/dashboard.atoms";
import { fantasySeasonsAtom } from "../../state/fantasy/fantasyLeagueScreen.atoms";
import { useMemo } from "react";
import { ISeasonRound } from "../../types/fantasy/fantasySeason";

/** useDashboard is a useful hook to read state of the fantasys easons */
export function useFantasySeasons() {

    const [fantasySeasons,] = useAtom(fantasySeasonsAtom);
    const [currentSeason] = useAtom(fantasySeasonsAtoms.currentSeasonAtom);
    const [seasonRounds,] = useAtom(fantasySeasonsAtoms.seasonRoundsAtom);
    const [currentRound,] = useAtom(fantasySeasonsAtoms.currentSeasonRoundAtom);
    const [selectedSeason, setSelectedSeason] = useAtom(fantasySeasonsAtoms.selectedDashboardSeasonAtom);
    const isLoading = useAtomValue(fantasySeasonsAtoms.isFantasySeasonsLoadingAtom);

    const diplaySeason = useMemo(() => {
        return selectedSeason || currentSeason;
    }, [currentSeason, selectedSeason]);

    const previousRound = useMemo(() => {
        if (currentRound && seasonRounds) {
            return seasonRounds.find((r) => {
                return r.round_number === currentRound.round_number - 1
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


    const pastAndPresentRounds = useMemo(() => {
        const set: ISeasonRound[] = [];

        seasonRounds.forEach((r) => {
            if (!set.find((y) => y.round_number === r.round_number)) {
                set.push(r);
            }
        });

        return [...set].sort((a, b) => {
            return (a.round_number || 0) - (b.round_number || 0)
        }).filter((r) => {
            if (scoringRound) {
                return r.round_number <= scoringRound.round_number
            }

            return true;
        });
    }, [scoringRound, seasonRounds]);

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
        scoringRound,
        pastAndPresentRounds
    }

}