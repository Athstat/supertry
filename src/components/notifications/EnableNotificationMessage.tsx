import { useEffect, useState } from "react";
import { getPushPermissionStatus, isBridgeAvailable, isMobileWebView, openSystemNotificationSettings, requestPushPermissions } from "../../utils/bridgeUtils";
import PrimaryButton from "../shared/buttons/PrimaryButton";
import { authService } from "../../services/authService";
import { logger } from "../../services/logger";
import PushOptInModal from "../ui/PushOptInModal";
import WarningCard from "../shared/WarningCard";

/** Renders a enable notification message that pushes
 * the user to opt into enabling push notifications */
export default function EnableNotificationMessage() {

    const [showPushModal, setShowPushModal] = useState(false);
    const [showSettingsNote, setShowSettingsNote] = useState(false);
    const [pushPermissionStatus, setPushPermissionStatus] = useState<
        'granted' | 'denied' | 'prompt' | 'unknown'
    >('unknown');

    useEffect(() => {
        let cancelled = false;
        (async () => {
            if (!isBridgeAvailable()) return;
            try {
                const userInfo = await authService.getUserInfo();
                const kcId = userInfo?.kc_id;
                if (!kcId) return;

                const hasPushId = !!localStorage.getItem('onesignal_id');
                const dismissed = localStorage.getItem('push_optin_dismissed') === 'true';
                const firstSeenKey = `dashboard_seen_user_${kcId}`;
                const settingsNoteSeenKey = `push_settings_note_seen_user_${kcId}`;
                const hasSeenDash = localStorage.getItem(firstSeenKey) === 'true';

                if (!hasSeenDash) {
                    localStorage.setItem(firstSeenKey, 'true');
                    if (!hasPushId && !dismissed && !cancelled) {
                        setShowPushModal(true);
                    } else if (
                        !hasPushId &&
                        dismissed &&
                        localStorage.getItem(settingsNoteSeenKey) !== 'true' &&
                        !cancelled
                    ) {
                        setShowSettingsNote(true);
                    }
                }
            } catch {
                // no-op
            }
        })();
        return () => {
            cancelled = true;
        };
    }, []);

    // Query push permission status on mount
    useEffect(() => {
        let cancelled = false;
        (async () => {
            try {
                if (!isBridgeAvailable()) return;
                const status = await getPushPermissionStatus();
                if (!cancelled) setPushPermissionStatus(status);
            } catch (err) {
                logger.error("Error with push optin ", err)
            }
        })();
        return () => {
            cancelled = true;
        };
    }, []);

    // Keep settings note visible whenever notifications are not granted
    useEffect(() => {
        setShowSettingsNote(pushPermissionStatus !== 'granted');
    }, [pushPermissionStatus]);

    return (
        <div className="" >
            {showSettingsNote && (
                <WarningCard 
                    className="p-4"
                >
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div className="text-sm">
                            <span className="font-semibold">Enable push notifications.</span> Notifications are
                            disabled. Turn them on to get match updates and alerts.
                        </div>
                        {isMobileWebView() && (
                            <PrimaryButton
                                className="shrink-0"
                                onClick={async () => {
                                    const opened = await openSystemNotificationSettings();
                                    if (!opened) {
                                        console.warn('Could not open system settings from web environment');
                                    }
                                }}
                            >
                                Go to settings
                            </PrimaryButton>
                        )}
                    </div>
                </WarningCard>
            )}

            <PushOptInModal
                visible={showPushModal}
                onEnable={async () => {
                    try {
                        const granted = await requestPushPermissions();
                        setPushPermissionStatus(granted ? 'granted' : 'denied');
                        if (!granted) {
                            try {
                                const kcId = authService.getUserInfoSync()?.kc_id;
                                if (kcId) {
                                    const settingsNoteSeenKey = `push_settings_note_seen_user_${kcId}`;
                                    if (localStorage.getItem(settingsNoteSeenKey) !== 'true') {
                                        setShowSettingsNote(true);
                                    }
                                }
                            } catch (err) {
                                logger.error("Error with push optin ", err)
                            }
                        }
                    } catch {
                        // swallow error and proceed to hide modal
                    } finally {
                        setShowPushModal(false);
                    }
                }}
                onNotNow={() => {
                    try {
                        localStorage.setItem('push_optin_dismissed', 'true');
                        const kcId = authService.getUserInfoSync()?.kc_id;
                        if (kcId) {
                            const settingsNoteSeenKey = `push_settings_note_seen_user_${kcId}`;
                            if (localStorage.getItem(settingsNoteSeenKey) !== 'true') {
                                setShowSettingsNote(true);
                            }
                        }
                    } catch (err) {
                        logger.error("Error with push optin ", err)
                    }
                    setShowPushModal(false);
                }}
            />
        </div>
    )
}
