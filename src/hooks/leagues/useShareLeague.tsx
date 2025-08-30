import { useAuth } from "../../contexts/AuthContext";
import { FantasyLeagueGroup } from "../../types/fantasyLeagueGroups";

export function useShareLeague(league?: FantasyLeagueGroup) {

    const { authUser } = useAuth();
    const username = authUser?.username || authUser?.first_name;

    const handleShare = () => {

        if (!league) return;

        const baseUrl = (import.meta as any)?.env?.VITE_APP_LINK_BASE_URL || window.location.origin;
        const inviteInstructions = encodeURI(`${baseUrl}/invite-steps?league_name=${league?.title ?? ''}&user_name=${username ?? ''}&join_code=${league?.entry_code ?? ''}`);

        const shareMessage =
            `You’ve been invited to join a rugby fantasy league: “${league?.title} on SCRUMMY ${username ? ` by ${username}` : ''}”\n\n` +
            `🏉 Step 1: Install the app\n` +
            `👉 Download for iOS: https://apps.apple.com/za/app/scrummy-fantasy-rugby/id6744964910\n` +
            `👉 Download for Android: https://play.google.com/store/apps/details?id=com.scrummy&hl=en_ZA\n\n` +
            `📲 Step 2: Open the app, tap “Join a League”, and enter this code: ${league?.entry_code}. New to SCRUMMY? Just click here to get started ${inviteInstructions}`;

        // Ensure there are no leading blank lines
        //const cleanedMessage = shareMessage.replace(/\r\n/g, '\n').replace(/^\s*\n+/, '');

        // Share ONLY the composed message text (no title/url),
        // so the share sheet doesn't prepend extra lines.
        const shareData: ShareData = {
            title: `Join ${league?.title} on SCRUMMY`,
            text: shareMessage,
            url: inviteInstructions
        };


        if (navigator.share) {
            navigator.share(shareData).catch(err => {
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