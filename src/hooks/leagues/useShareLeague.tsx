import { useAuth } from "../../contexts/AuthContext";
import { analytics } from "../../services/anayticsService";
import { FantasyLeagueGroup } from "../../types/fantasyLeagueGroups";

export function useShareLeague(league?: FantasyLeagueGroup) {

    const { authUser } = useAuth();
    const username = authUser?.username || authUser?.first_name;

    const handleShare = () => {

        if (!league) return;

        const baseUrl = (import.meta as any)?.env?.VITE_APP_LINK_BASE_URL || window.location.origin;
        const inviteInstructions = encodeURI(`${baseUrl}/invite-steps?league_name=${league?.title ?? ''}&user_name=${username ?? ''}&join_code=${league?.entry_code ?? ''}`);

        const shareMessage =`You've been invited to join ${league.title} on SCRUMMY! Tap the link below to get started.\n${inviteInstructions}`;

        // Ensure there are no leading blank lines
        //const cleanedMessage = shareMessage.replace(/\r\n/g, '\n').replace(/^\s*\n+/, '');

        // Share ONLY the composed message text (no title/url),
        // so the share sheet doesn't prepend extra lines.
        const shareData: ShareData = {
            title: `SCRUMMY Fantasy League Invite`,
            text: `🔥 You've been invited to join ${league.title} on SCRUMMY! Tap the link below to get started.\n\n${inviteInstructions}`,
            // url: inviteInstructions
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
        handleShare
    }

}