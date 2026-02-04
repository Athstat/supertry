import { useCallback, useEffect, useState } from "react";
import { logger } from "../../services/logger";
import { notificationService } from "../../services/notificationsService";
import { NotificationProfile, UpdateNotificationProfileReq } from "../../types/notifications";
import { compareProfiles } from "../../utils/notificationUtils";
import { useDebounced } from "../web/useDebounced";
import { useAuth } from "../../contexts/auth/AuthContext";

export function useNotificationPreferences() {
    const { authUser } = useAuth();

    // Whether data is being fetched or not
    const [isLoading, setLoading] = useState<boolean>(false);

    // Whether preferences are being saved or not
    const [isSaving, setSaving] = useState<boolean>(false);

    const [error, setError] = useState<string>();


    // Original Profile for comparison on auto save
    const [originalProfile, setOriginalProfile] = useState<NotificationProfile>();

    // Profile Object for making edits to
    const [profile, setProfile] = useState<NotificationProfile>();


    useEffect(() => {
        const fetcher = async () => {

            try {
                if (!authUser) {
                    return;
                }

                setLoading(true);
                const data = await notificationService.getNotificationProfile(authUser?.kc_id);

                if (data) {
                    setOriginalProfile(data);
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

    const debouncedLoading = useDebounced(isLoading, 500);

    const handleAutoSave = useCallback(async () => {
        try {

            if (!profile || !originalProfile || !authUser) {
                return;
            }

            setSaving(true);
            setError(undefined);

            

            if (compareProfiles(profile, originalProfile)) {
                return;
            }

            const updateData: UpdateNotificationProfileReq = {
                receive_notifications_enabled: profile.receive_notifications_enabled,
                game_updates_enabled: profile.game_updates_enabled,
                game_roster_updates_enabled: profile.game_roster_updates_enabled,
                news_updates_enabled: profile.news_updates_enabled,
                my_team_updates_enabled: profile.my_team_updates_enabled,
                email_updates_enabled: profile.email_updates_enabled,
                game_updates_preference: profile.game_updates_preference
            };

            const updatedProfile = await notificationService.updateNotificationProfile(
                authUser.kc_id,
                updateData
            );

            // Set original hash to the last set profile
            // in order to track original profile as this is the one
            // currently in the database right now
            if (updatedProfile) {
                setOriginalProfile(updatedProfile);
            }

        } catch (err) {

            logger.error("Error updating notification profile ", err);
            setError("Something wen't wrong updating your preferences");

        } finally {
            setSaving(false);
        }

    }, [profile, originalProfile, authUser]);

    useEffect(() => {
        const timer = setTimeout(() => {
            handleAutoSave();
        }, 1000);

        return () => {
            clearTimeout(timer);
        }
    }, [handleAutoSave]);

    const clearError = () => {
        setError(undefined);
    }

    const isProfileFetchFailed = !profile && !isLoading;

    return { profile, isProfileFetchFailed, isSaving, isLoading: debouncedLoading, error, clearError, setProfile, handleAutoSave }
}