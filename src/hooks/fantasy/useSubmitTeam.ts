import { useCallback, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { analytics } from "../../services/analytics/anayticsService";
import { leagueService } from "../../services/leagueService";
import { IFantasyLeagueTeam } from "../../types/fantasyLeague";
import { ICreateFantasyTeamAthleteItem } from "../../types/fantasyTeamAthlete";
import { useFantasyLeagueGroup } from "../leagues/useFantasyLeagueGroup";
import { useCreateFantasyTeam } from "./useCreateFantasyTeam";

/** Hook for submitting a fantasy league team */
export function useSubmitTeam(onSuccess?: () => void) {

    const { leagueConfig } = useFantasyLeagueGroup();
    const { leagueRound, teamCaptain, slots } = useCreateFantasyTeam();
    const { authUser } = useAuth();

    const [isSaving, setIsSaving] = useState<boolean>(false);
    const [saveError, setSaveError] = useState<string>();

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

            const response = await leagueService.joinLeague(
                leagueRound.id,
                authUser.kc_id,
                teamName,
                athletes
            );

            console.log('Join league response:', response);
            // Best-effort mapping to IFantasyLeagueTeam
            const createdTeam: IFantasyLeagueTeam = {
                id: response?.id || response?.team?.id || '',
                team_id: String(response?.team?.id ?? response?.id ?? ''),
                league_id: Number(leagueRound.id),
                rank: response?.team?.rank ?? 0,
                overall_score: response?.team?.overall_score ?? 0,
                team_name: response?.team?.team_name ?? teamName,
                user_id: authUser.kc_id,
                first_name: authUser.first_name ?? '',
                last_name: authUser.last_name ?? '',
                athletes: Array.isArray(response?.team?.athletes) ? response.team.athletes : [],
            };

            // Show success modal
            if (onSuccess) {
                onSuccess();
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
        saveError
    }
}