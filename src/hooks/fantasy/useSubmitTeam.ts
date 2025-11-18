import { IFantasyLeagueTeam } from './../../types/fantasyLeague';
import { useCallback, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { analytics } from "../../services/analytics/anayticsService";
import { leagueService } from "../../services/leagueService";
import { ICreateFantasyTeamAthleteItem } from "../../types/fantasyTeamAthlete";
import { useFantasyLeagueGroup } from "../leagues/useFantasyLeagueGroup";
import { useCreateFantasyTeam } from "./useCreateFantasyTeam";

/** Hook for submitting a fantasy league team */
export function useSubmitTeam(onSuccess?: (createdTeam:IFantasyLeagueTeam) => void) {

    const { leagueConfig } = useFantasyLeagueGroup();
    const { leagueRound, teamCaptain, slots } = useCreateFantasyTeam();
    const { authUser } = useAuth();

    const [isSaving, setIsSaving] = useState<boolean>(false);
    const [saveError, setSaveError] = useState<string>();

    const clearSaveError = () => {
        setSaveError(undefined);
    }

    const handleSave = useCallback(async () => {

        const shouldCancelSave = !authUser || !leagueRound ||
            !leagueConfig;

        if (shouldCancelSave) {
            return;
        }

        if (!teamCaptain) {
            setIsSaving(false);
            setSaveError("You haven't picked a team captain");
            return;
        }

        try {
            setIsSaving(true);
            setSaveError(undefined);

            const teamName = `${authUser.username} - ${leagueRound.title}`;

            const athletes: ICreateFantasyTeamAthleteItem[] = slots.map((s, index) => {
                const slotPlayer = s.athlete;
                if (!slotPlayer) return;

                const isSuperSub = s.is_starting === false;

                return {
                    athlete_id: slotPlayer.tracking_id,
                    purchase_price: slotPlayer.price || 0,
                    purchase_date: new Date(),
                    is_starting: !isSuperSub,
                    slot: index + 1,
                    is_super_sub: isSuperSub,
                    is_captain: teamCaptain.tracking_id === slotPlayer.tracking_id,
                } as ICreateFantasyTeamAthleteItem;
            })
                .filter(Boolean) as ICreateFantasyTeamAthleteItem[];

            if (athletes.length < 6) {
                setSaveError("You have an empty slot on your team");
                setIsSaving(false);
            }

            const createdTeam = await leagueService.joinLeague(
                leagueRound.id,
                authUser.kc_id,
                teamName,
                athletes
            );

            // Show success modal
            if (onSuccess && createdTeam) {
                clearSaveError();
                // Perform Optimistic Update
                onSuccess(createdTeam);
            }

            analytics.trackTeamCreationCompleted(leagueRound, createdTeam);

        } catch (error) {
            console.error('Failed to save team:', error);
            setSaveError(
                error instanceof Error ? error.message : 'Failed to save team. Please try again.'
            );
        } finally {
            setIsSaving(false);
        }
    }, [authUser, leagueConfig, leagueRound, onSuccess, slots, teamCaptain])

    return {
        handleSave,
        isSaving,
        saveError,
        clearSaveError
    }
}