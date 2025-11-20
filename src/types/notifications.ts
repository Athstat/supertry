import { RadioListOption } from "./ui";

export type GameUpdatesPreference = "key-updates" | "all-updates" | "results-only";

/** An Array with game updates preference options */
export const gameUpdatesPreferenceOptions: GameUpdatesPreference[] = [
    "key-updates",
    "all-updates",
    "results-only"
];

export const gameUpdatesPreferenceRadioListOptions: RadioListOption[] = [
    {
        value: "key-updates",
        label: "Key Updates"
    },
    {
        value: "results-only",
        label: "Results Only"
    }, 
    {
        value: "all-updates",
        label: "All Updates"
    }
];

export type NotificationProfile = {
    user_id: string,
    receive_notifications_enabled: boolean,
    game_updates_enabled: boolean,
    game_roster_updates_enabled: boolean,
    news_updates_enabled: boolean,
    my_team_updates_enabled: boolean,
    email_updates_enabled: boolean,
    created_at: Date,
    updated_at: Date,
    game_updates_preference: GameUpdatesPreference
}

export type UpdateNotificationProfileReq = {
    receive_notifications_enabled: boolean,
    game_updates_enabled: boolean,
    game_roster_updates_enabled: boolean,
    news_updates_enabled: boolean,
    my_team_updates_enabled: boolean,
    email_updates_enabled: boolean,
    game_updates_preference: GameUpdatesPreference
}