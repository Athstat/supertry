import { useCallback, useEffect, useRef, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { logger } from "../../services/logger";
import { notificationService } from "../../services/notificationsService";
import { NotificationProfile, UpdateNotificationProfileReq } from "../../types/notifications";
import { hashNotificationProfile } from "../../utils/notificationUtils";
import { useDebounced } from "../useDebounced";

export function useNotificationPreferences() {
    const { authUser } = useAuth();

    const [isLoading, setLoading] = useState<boolean>(false);
    const [isSaving, setSaving] = useState<boolean>(false);
    const [error, setError] = useState<string>();
    const [profile, setProfile] = useState<NotificationProfile>();

    const debouncedProfile = useDebounced(profile, 1000);
    const originalProfileRef = useRef<NotificationProfile>(null);

    useEffect(() => {
        const fetcher = async () => {

            setLoading(true);

            try {
                if (!authUser) {
                    return;
                }

                const data = await notificationService.getNotificationProfile(authUser?.kc_id);

                if (data) {
                    originalProfileRef.current = data;
                    setProfile(data);
                }

            } catch (err) {
                logger.error("Error fetching profile in efffect", err);
            } finally {
                setLoading(false);
            }
        }

        fetcher();
    }, [authUser]);

    const debouncedLoading = useDebounced(isLoading, 700);

    const handleAutoSave = useCallback(async () => {
        try {
            setSaving(true);
            setError(undefined);

            if (!debouncedProfile || !originalProfileRef.current || !authUser) {
                return;
            }

            const originalHash = hashNotificationProfile(debouncedProfile);
            const newHash = hashNotificationProfile(originalProfileRef.current);

            if (originalHash === newHash) {
                return;
            }

            const updateData: UpdateNotificationProfileReq = {
                receive_notifications_enabled: debouncedProfile.receive_notifications_enabled,
                game_updates_enabled: debouncedProfile.game_updates_enabled,
                game_roster_updates_enabled: debouncedProfile.game_roster_updates_enabled,
                news_updates_enabled: debouncedProfile.news_updates_enabled,
                my_team_updates_enabled: debouncedProfile.my_team_updates_enabled,
                email_updates_enabled: debouncedProfile.email_updates_enabled,
                game_updates_preference: debouncedProfile.game_updates_preference
            };

            const res = await notificationService.updateNotificationProfile(
                authUser.kc_id,
                updateData
            );

            if (res) {
                originalProfileRef.current = res;
            }

        } catch (err) {

            logger.error("Error updating notification profile ", err);

            // Revert back to old settings
            if (originalProfileRef.current) {
                setProfile(originalProfileRef.current);
            }

            setError("Something wen't wrong updating your preferences");

        } finally {
            setSaving(false);
        }

    }, [debouncedProfile, authUser]);

    useEffect(() => {
        handleAutoSave();
    }, [debouncedProfile, handleAutoSave]);

    const clearError = () => {
        setError(undefined);
    }

    const isProfileFetchFailed = debouncedProfile && !debouncedLoading

    return {profile, isProfileFetchFailed, isSaving, isLoading: debouncedLoading, error, clearError, setProfile}
}