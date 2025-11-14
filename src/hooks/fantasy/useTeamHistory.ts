import { useAtom, useAtomValue } from "jotai";
import { teamHistoryCurrentRoundAtom, teamHistoryCurrentTeamAtom, teamHistoryTeamManagerAtom } from "../../state/fantasy/fantasy-teams/teamHistory.atoms";
import { useFantasyLeagueGroup } from "../leagues/useFantasyLeagueGroup";
import { useCallback, useMemo } from "react";

/** 
 * Hook that provides functionality to travel through a teams history.
 * This hook depends on the `FantasyLeagueGroupProvider` and the `TeamHistoryProvider`
*/

export function useTeamHistory() {
    const [team, setTeam] = useAtom(teamHistoryCurrentTeamAtom);
    const [currentRound, setCurrentRound] = useAtom(teamHistoryCurrentRoundAtom);
    const manager = useAtomValue(teamHistoryTeamManagerAtom);

    const { sortedRounds, currentRound: groupCurrentRound } = useFantasyLeagueGroup();

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