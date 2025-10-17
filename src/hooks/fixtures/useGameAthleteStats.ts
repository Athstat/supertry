import { useCallback, useMemo } from "react";
import { attackBoxscoreList, defenseBoxscoreList, kickingBoxscoreList, disciplineBoxscoreList } from "../../utils/boxScoreUtils";
import useSWR from "swr";
import { boxScoreService } from "../../services/boxScoreService";
import { IFixture } from "../../types/games";
import { GameSportAction } from "../../types/boxScore";

/** provides hook to access game athlete stats */
export function useGameAthleteStats(fixture: IFixture, selectedTeamId?: string) {

    const fixtureId = fixture.game_id;
    const sportsActionsKey = fixtureId ? `fixtures/${fixtureId}/sports-actions` : null;
    
    const { data, isLoading } = useSWR(sportsActionsKey, () =>
        boxScoreService.getSportActionsByGameId(fixtureId ?? '')
    );

    const sportActions = useMemo(() => {
        return (data ?? [])
    }, [data]);

    console.log("Sports Actions ", sportActions.filter(s => s.team_id === '45c49225-bee0-5d61-b13a-1fe84e3a31c4') );

    const isEmpty = sportActions.length === 0;

    const attackList = useMemo(() => {
        return attackBoxscoreList(sportActions, selectedTeamId ?? '');
    }, [sportActions, selectedTeamId]);

    const defenseList = useMemo(() => {
        return defenseBoxscoreList(sportActions, selectedTeamId ?? '');
    }, [sportActions, selectedTeamId]);

    const kickingList = useMemo(() => {
        return kickingBoxscoreList(sportActions, selectedTeamId ?? '');
    }, [sportActions, selectedTeamId]);

    const disciplineList = useMemo(() => {
        return disciplineBoxscoreList(sportActions, selectedTeamId ?? '');
    }, [sportActions, selectedTeamId]);

    const getStatLeader = useCallback((statName: string) => {
        let winner: GameSportAction | undefined = undefined;

        const filteredList = sportActions.filter((s) => {
            return s.definition?.action_name === statName;
        });

        filteredList.forEach((s) => {
            if (!winner) {
                winner = s;
            } else {
                if (s.action_count > winner.action_count) {
                    winner = s;
                }
            }
        });

        return winner;

    }, [sportActions]);

    return {
        isLoading,
        sportActions: (sportActions ?? []),
        attackList,
        defenseList,
        kickingList,
        disciplineList,
        getStatLeader,
        isEmpty
    }
}