import { NotificationProfile } from "../types/notifications";

export function hashNotificationProfile(profile: NotificationProfile) {
    return `
    receive-notifications-enabled:${profile.receive_notifications_enabled},
    game_updates_enabled:${profile.game_updates_enabled},
    game_roster_updates_enabled:${profile.game_roster_updates_enabled},
    news_updates_enabled:${profile.news_updates_enabled},
    my_team_updates_enabled:${profile.my_team_updates_enabled},
    email_updates_enabled:${profile.email_updates_enabled},
    game_updates_preference:${profile.game_updates_preference}
    `
}