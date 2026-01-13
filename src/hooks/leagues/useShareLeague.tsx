import { useAuth } from "../../contexts/AuthContext";
import { analytics } from "../../services/analytics/anayticsService";
import { leagueInviteQueryParams } from "../../types/constants";
import { FantasyLeagueGroup } from "../../types/fantasyLeagueGroups";

export function useShareLeague(league?: FantasyLeagueGroup) {

    const { authUser } = useAuth();
    const username = authUser?.username || authUser?.first_name;

    const qs = leagueInviteQueryParams;

    const baseUrl = (import.meta)?.env?.VITE_APP_LINK_BASE_URL || window.location.origin;
    const inviteLink = encodeURI(`${baseUrl}/invite-steps?${qs.LEAGUE_ID}=${league?.id}&${qs.USER_ID}=${authUser?.kc_id}&${qs.JOIN_CODE}=${league?.entry_code}`);

    const handleShare = () => {

        if (!league) return;

        const shareMessage = `${username} is inviting you to join ${league.title} league on SCRUMMY 🏉. Use the link below to join\n\n${inviteLink}`

        // Ensure there are no leading blank lines
        //const cleanedMessage = shareMessage.replace(/\r\n/g, '\n').replace(/^\s*\n+/, '');

        // Share ONLY the composed message text (no title/url),
        // so the share sheet doesn't prepend extra lines.

        const shareData: ShareData = {
            text: shareMessage
        };

        if (navigator.share) {
            navigator.share(shareData)
            .then(() => {
                analytics.trackFriendInvitesSent('League_Invite_Button', league);
            })
            .catch(err => {
                console.error('Share failed:', err);
                // Fallback to clipboard if share dismissed or fails
                navigator.clipboard
                    .writeText(shareMessage)
                    .then(() => alert('Invite copied to clipboard'))
                    .catch(() => alert('Unable to share or copy. Please try manually.'));
            });
        } else {
            navigator.clipboard
                .writeText(shareMessage)
                .then(() => alert('Invite copied to clipboard'))
                .catch(() => alert('Unable to copy invite. Please try manually.'));
        }
    };


    return {
        handleShare,
        inviteLink
    }

}