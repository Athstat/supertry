import { useContext } from "react";
import { useMyTeamActions } from "./useMyTeamActions";
import { MyTeamSlotContext } from "../../../contexts/fantasy/my_team/MyTeamSlotContext";
import { useMyTeam } from "./useMyTeam";
import { IProAthlete } from "../../../types/athletes";
import { isInSecondChanceMode, isSeasonRoundTeamsLocked, isPastSeasonRound } from "../../../utils/leaguesUtils";

export function useMyTeamSlot() {
    const context = useContext(MyTeamSlotContext);
    const { setCaptain } = useMyTeamActions();
    const { roundGames: roundFixtures, isReadOnly, round } = useMyTeam();

    if (context === null) {
        throw new Error("useMyTeamSlot() was used outside the MyTeamSlotProvider")
    }


    const makeCaptain = () => {
        setCaptain(context.slot.slotNumber);
    }

    const isPlayerLocked = (athlete?: IProAthlete) => {

        /** If second chance mode is off */
        if (round && !isInSecondChanceMode(round)) {
            return isSeasonRoundTeamsLocked(round)
        }

        const seasonTeamIds = athlete?.athlete_teams?.filter((t) => {
            return t.season_id === round?.season;
        }).map((t) => t.team_id);

        const eligibleTeamIds: string[] = [];

        roundFixtures
            .filter((f) => {
                return f.game_status === "not_started";
            })
            .forEach((f) => {

                if (f.team?.athstat_id && !eligibleTeamIds.includes(f.team?.athstat_id)) {
                    eligibleTeamIds.push(f.team.athstat_id);
                }

                if (f.opposition_team?.athstat_id && !eligibleTeamIds.includes(f.opposition_team?.athstat_id)) {
                    eligibleTeamIds.push(f.opposition_team.athstat_id);
                }
            });

        const playerIsEditable = seasonTeamIds?.reduce((flag, curr) => {
            return eligibleTeamIds.includes(curr) || flag;
        }, false);

        return !playerIsEditable;

    }

    const isSlotLocked = isPlayerLocked(context.slot.athlete?.athlete);

    const getShowPlayerLock = (player?: IProAthlete) => {
        const isLocked = isPlayerLocked(player);
        const isSecondChanceMode = round && isInSecondChanceMode(round);
        return isLocked && !isReadOnly && round && !isPastSeasonRound(round) && isSecondChanceMode;
    }

    const isSub = !context.slot.is_starting || context.slot.slotNumber === 6;
    

    return {
        ...context,
        isSub,
        makeCaptain,
        isSlotLocked,
        isShowPlayerLock: getShowPlayerLock(context.slot.athlete?.athlete)
    }
}