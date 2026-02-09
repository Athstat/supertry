import { useEffect } from "react";
import { analytics } from "../../services/analytics/anayticsService";
import { logger } from "../../services/logger";
import { DjangoUserMinimal } from "../../types/auth";
import { FantasyLeagueGroup } from "../../types/fantasyLeagueGroups";

/** Hook that creates a one link to track app download */
export function useStoreLinks(league?: FantasyLeagueGroup, inviter?: DjangoUserMinimal) {

    const joinCode = league?.entry_code;
    const userName = inviter?.email;
    const leagueName = league?.title;

    // Optional AppsFlyer OneLink support: if VITE_AF_ONELINK_BASE_URL is set,
    // we build a single OneLink URL that preserves UTMs and extra context.
    const oneLinkBase = import.meta.env.VITE_AF_ONELINK_BASE_URL;

    //console.log('oneLinkBase', oneLinkBase);

    const oneLinkUrl = (() => {
        if (!oneLinkBase) return null;
        try {
            const url = new URL(oneLinkBase);

            if (league) {
                url.searchParams.set('utm_source', `league_with_id_${league?.id}`);
                url.searchParams.set('media_source', `league_with_id_${league?.id}`);

                url.searchParams.set('utm_medium', `league_invite`);
                url.searchParams.set('af_channel', `league_invite`);

                url.searchParams.set('utm_campaign', `download_app`);
                url.searchParams.set('campaign', `download_app`);
            }

            return url.toString();
        } catch {
            return null;
        }
    })();

    useEffect(() => {
        try {
            const params = new URLSearchParams(window.location.search);
            const utm = {
                utm_source: params.get('utm_source') || undefined,
                utm_medium: params.get('utm_medium') || undefined,
                utm_campaign: params.get('utm_campaign') || undefined,
                utm_id: params.get('utm_id') || undefined,
                utm_term: params.get('utm_term') || undefined,
                utm_content: params.get('utm_content') || undefined,
                has_one_link: !!oneLinkUrl,
                league_name: leagueName || undefined,
                user_name: userName || undefined,
                join_code: (joinCode ?? '').toUpperCase() || undefined,
            };
            analytics.track('[Marketing] Invite Steps Viewed', utm);
        } catch (e) {
            logger.error('Error ', e);
        }
    }, [oneLinkUrl, leagueName, userName, joinCode]);

    return {
        oneLinkUrl
    }
}