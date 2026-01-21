import { useAtom, useAtomValue } from "jotai";
import { teamHistoryCurrentTeamAtom, teamHistoryTeamManagerAtom } from "../../state/fantasy/fantasy-teams/teamHistory.atoms";
import { useCallback, useMemo } from "react";
import { useQueryState } from "../web/useQueryState";
import { queryParamKeys } from "../../types/constants";
import { useFantasySeasons } from "../dashboard/useFantasySeasons";
import { ISeasonRound } from "../../types/fantasy/fantasySeason";

/** 
 * Hook that provides functionality to travel through a teams history.
 * This hook depends on the `FantasyLeagueGroupProvider` and the `TeamHistoryProvider`
*/

export function useTeamHistory() {

    
    const { seasonRounds: sortedRounds, currentRound: seasonCurrentRound  } = useFantasySeasons();

    const [roundId, setRoundId] = useQueryState(queryParamKeys.ROUND_ID_QUERY_KEY);

    const [team, setTeam] = useAtom(teamHistoryCurrentTeamAtom);
    const manager = useAtomValue(teamHistoryTeamManagerAtom);

    const setCurrentRound = useCallback((round: ISeasonRound) => {
        setRoundId(round.round_number.toString());
    }, [setRoundId]);

    const currentRound = useMemo(() => {

        // TODO: Come back and fix this
        return seasonCurrentRound;

        if (!roundId) {
            return seasonCurrentRound;
        }
    
        return sortedRounds.find((r) => r.round_number.toString() === roundId)
    }, [roundId, seasonCurrentRound, sortedRounds]);


    const resetTeamForNewRound = useCallback(() => {
        setTeam(undefined);
    }, [setTeam]);

    const currentRoundIndex = useMemo(() => {
        if (currentRound) {
            return sortedRounds.findIndex((r) => {
                return r.id === currentRound.id
            });
        }

        return undefined;
    }, [currentRound, sortedRounds]);

    const maxIndex = useMemo<number | undefined>(() => {
        if (seasonCurrentRound) {
            return sortedRounds.findIndex((r) => {
                return r.round_number === seasonCurrentRound.round_number
            });
        }

        return undefined;

    }, [seasonCurrentRound, sortedRounds]);

    const moveNextRound = useCallback(() => {

        if (maxIndex === undefined || currentRoundIndex === undefined || sortedRounds.length === 0) {
            return;
        }

        const nextIndex = currentRoundIndex + 1;

        if (nextIndex > maxIndex) {
            return;
        }

        const nextRound = sortedRounds[nextIndex];
        setCurrentRound(nextRound);
        resetTeamForNewRound();

    }, [maxIndex, currentRoundIndex, sortedRounds, setCurrentRound, resetTeamForNewRound]);

    const movePreviousRound = useCallback(() => {

        if (maxIndex === undefined || currentRoundIndex === undefined || sortedRounds.length === 0) {
            return;
        }

        const nextIndex = currentRoundIndex - 1;

        if (nextIndex < 0) {
            return;
        }

        const nextRound = sortedRounds[nextIndex];
        setCurrentRound(nextRound);
        resetTeamForNewRound();

    }, [maxIndex, currentRoundIndex, sortedRounds, setCurrentRound, resetTeamForNewRound]);

    return {
        roundTeam: team,
        round: currentRound,
        manager,
        rounds: sortedRounds,
        moveNextRound,
        movePreviousRound,
        setRoundTeam: setTeam,
        jumpToRound: setCurrentRound
    }
}