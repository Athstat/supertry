import { useAuth } from "../../contexts/AuthContext";
import { analytics } from "../../services/analytics/anayticsService";
import { leagueInviteService } from "../../services/fantasy/leagueInviteService";
import { DjangoUserMinimal } from "../../types/auth";
import { leagueInviteQueryParams } from "../../types/constants";
import { FantasyLeagueGroup } from "../../types/fantasyLeagueGroups";
import { isMobileWebView } from "../../utils/bridgeUtils";
import useSWR from "swr";

export function useShareLeague(league?: FantasyLeagueGroup, shouldFetch: boolean = true) {
    const { authUser } = useAuth();

    const key = shouldFetch ? `/fantasy-league-groups/${league?.id}/invite` : null;
    const {data, isLoading} = useSWR(key, () => createInviteLinkV2(league, authUser), {
        revalidateOnFocus: false,
        revalidateIfStale: true,
        dedupingInterval: 1000 * 60 * 60 * 24
    });

    const inviteLink = data || '';

    const handleShareWithBridge = (message: string) => {
        const jsonObj = { message };

        window.ReactNativeWebView?.postMessage(JSON.stringify({
            type: 'NATIVE_SHARE',
            payload: JSON.stringify(jsonObj)
        }));
    }

    const isMobileShareAvailable = isMobileWebView() && Boolean(window.CAN_USE_MOBILE_SHARE_API);

    const handleShare = () => {

        if (!league) return;

        const username = authUser?.username || authUser?.first_name;
        const shareMessage = `${username} is inviting you to join ${league.title} league on SCRUMMY 🏉. Use the link below to join\n\n${inviteLink}`
        
        
        if (isMobileShareAvailable) {
            handleShareWithBridge(shareMessage);
            return;
        }

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
        inviteLink,
        isLoading
    }

}

function createLegacyInviteLink(league?: FantasyLeagueGroup, authUser?: DjangoUserMinimal) {
    const qs = leagueInviteQueryParams;

    const baseUrl = (import.meta)?.env?.VITE_APP_LINK_BASE_URL || window.location.origin;
    const inviteLink = encodeURI(`${baseUrl}/invite-steps?${qs.LEAGUE_ID}=${league?.id}&${qs.USER_ID}=${authUser?.kc_id}&${qs.JOIN_CODE}=${league?.entry_code}`);

    return inviteLink;

}

async function createInviteLinkV2(league?: FantasyLeagueGroup, authUser?: DjangoUserMinimal) {
    const invite = await leagueInviteService.createInvite(league?.id || '');

    if (invite) {
        const baseUrl = (import.meta)?.env?.VITE_APP_LINK_BASE_URL || window.location.origin;
        const inviteLink = encodeURI(`${baseUrl}/i/${invite.id}`);
        return inviteLink;
    }

    return createLegacyInviteLink(league, authUser);
} 