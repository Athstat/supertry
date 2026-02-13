import { useContext } from "react";
import { MyTeamContext } from "../../../contexts/fantasy/my_team/MyTeamContext";
import { MAX_TEAM_BUDGET } from "../../../types/constants";
import { IProAthlete } from "../../../types/athletes";
import { IFantasyLeagueTeamSlot } from "../../../types/fantasyLeagueTeam";
import { isPastSeasonRound, isSeasonRoundStarted } from "../../../utils/leaguesUtils";

export function useMyTeam() {
    const context = useContext(MyTeamContext);

    if (context === null) {
        throw new Error("useMyTeam() used outside MyTeamProvider");
    }

    const totalSpent = context.slots.reduce((total, curr) => {
        return (curr.athlete?.purchase_price ?? curr.purchasePrice ?? 0) + total
    }, 0);

    const budgetRemaining = MAX_TEAM_BUDGET - totalSpent;

    const selectedCount = context.slots.reduce((total, curr) => {
        if (curr.athlete) {
            return total + 1;
        }

        return total;
    }, 0);

    const teamCaptain = context.slots.find((s) => {
        return s.isCaptain === true;
    })

    const isPlayerLocked = (athlete?: IProAthlete) => {

        if (context.isReadOnly || !context.round || !isSeasonRoundStarted(context.round)) {
            return false;
        }

        const seasonTeamIds = athlete?.athlete_teams?.filter((t) => {
            return t.season_id === context.round?.season;
        }).map((t) => t.team_id);

        const eligibleTeamIds: string[] = [];

        context.roundGames
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

    const isSlotLocked = (slot: IFantasyLeagueTeamSlot) => {
        return isPlayerLocked(slot.athlete?.athlete);
    }

    const isShowPlayerLock = (player?: IProAthlete) => {
        const isLocked = isPlayerLocked(player);
        const isSecondChanceMode = context.round && isSeasonRoundStarted(context.round);
        return isLocked && !context.isReadOnly && context.round && !isPastSeasonRound(context.round) && isSecondChanceMode;
    }

    const isPlayerGameStarted = (athlete?: IProAthlete) => {

        const seasonTeamIds = athlete?.athlete_teams?.filter((t) => {
            return t.season_id === context.round?.season;
        }).map((t) => t.team_id);

        const eligableGamesStarted = context.roundGames
            .filter((f) => {
                return f.game_status !== "not_started";
            })
            .filter((f) => {
                return seasonTeamIds?.includes(f.team?.athstat_id || '') || seasonTeamIds?.includes(f.opposition_team?.athstat_id || '');
            })

        return eligableGamesStarted.length > 0;

    }

    return {
        ...context,
        totalSpent,
        budgetRemaining,
        selectedCount,
        teamCaptain,
        isSlotLocked,
        isShowPlayerLock,
        isPlayerLocked,
        isPlayerGameStarted
    }
}