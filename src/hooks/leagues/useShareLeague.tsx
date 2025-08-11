import { useAuth } from "../../contexts/AuthContext";
import { FantasyLeagueGroup } from "../../types/fantasyLeagueGroups";

export function useShareLeague(league?: FantasyLeagueGroup) {

    const {authUser} = useAuth();

    const handleShare = () => {

        // Native share (Web Share API) with fallback to clipboard
        const baseUrl = (import.meta as any)?.env?.VITE_APP_LINK_BASE_URL || window.location.origin;
        const deepLink = `${baseUrl}/league/${league?.id}`;

        const shareMessage =
            `You’ve been invited to join a fantasy league: “${league?.title}" on SCRUMMY${authUser && ` by ${authUser.username ?? authUser.first_name}`}!\n\n` +
            `🏉 Step 1: Install the app\n` +
            `👉 Download for iOS: https://apps.apple.com/za/app/scrummy-fantasy-rugby/id6744964910\n` +
            `👉 Download for Android: https://play.google.com/store/apps/details?id=com.scrummy&hl=en_ZA\n\n` +
            `📲 Step 2: Open the app, navigate to leagues and tap “Join a League”, and enter this code: ${league?.entry_code}\n\n` +
            `🏉⚔️ Step 3: Create your dream fantasy team and battle it out with your friends!`;
            // `Already have the app?\n`;
            // `Just click here to join instantly: ${deepLink}`;

        // Ensure there are no leading blank lines
        //const cleanedMessage = shareMessage.replace(/\r\n/g, '\n').replace(/^\s*\n+/, '');

        // Share ONLY the composed message text (no title/url),
        // so the share sheet doesn't prepend extra lines.
        const shareData: ShareData = {
            title: shareMessage,
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