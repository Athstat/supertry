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
            const params = new URLSearchParams(window.location.search);
            const url = new URL(oneLinkBase);

            // Standard UTM mappings to AppsFlyer params
            url.searchParams.set('pid', params.get('utm_source') || 'invite_steps_screen'); // media source
            const campaign = params.get('utm_campaign');
            if (campaign) url.searchParams.set('c', campaign);

            const channel = params.get('utm_medium');
            if (channel) url.searchParams.set('af_channel', channel);

            const term = params.get('utm_term');
            if (term) url.searchParams.set('af_sub1', term);

            const content = params.get('utm_content');
            if (content) url.searchParams.set('af_sub2', content);

            // Extra context for analytics/debug
            if (joinCode) url.searchParams.set('af_sub3', (joinCode ?? '').toUpperCase());
            if (leagueName) url.searchParams.set('af_sub4', leagueName as string);
            if (userName) url.searchParams.set('af_sub5', userName as string);

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