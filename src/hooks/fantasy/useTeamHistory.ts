import { useAtom, useAtomValue } from "jotai";
import { teamHistoryCurrentTeamAtom, teamHistoryTeamManagerAtom } from "../../state/fantasy/fantasy-teams/teamHistory.atoms";
import { useFantasyLeagueGroup } from "../leagues/useFantasyLeagueGroup";
import { useCallback, useMemo } from "react";
import { useQueryState } from "../useQueryState";
import { queryParamKeys } from "../../types/constants";
import { IFantasyLeagueRound } from "../../types/fantasyLeague";

/** 
 * Hook that provides functionality to travel through a teams history.
 * This hook depends on the `FantasyLeagueGroupProvider` and the `TeamHistoryProvider`
*/

export function useTeamHistory() {

    
    const { sortedRounds, currentRound: groupCurrentRound } = useFantasyLeagueGroup();

    const [roundId, setRoundId] = useQueryState(queryParamKeys.ROUND_ID_QUERY_KEY);

    const [team, setTeam] = useAtom(teamHistoryCurrentTeamAtom);
    const manager = useAtomValue(teamHistoryTeamManagerAtom);

    const setCurrentRound = useCallback((round: IFantasyLeagueRound) => {
        setRoundId(round.id);
    }, [setRoundId]);

    const currentRound = useMemo(() => {
        if (!roundId) {
            return groupCurrentRound;
        }
    
        return sortedRounds.find((r) => r.id.toString() === roundId)
    }, [groupCurrentRound, roundId, sortedRounds]);



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
        if (groupCurrentRound) {
            return sortedRounds.findIndex((r) => {
                return r.id === groupCurrentRound.id
            });
        }

        return undefined;

    }, [groupCurrentRound, sortedRounds]);

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