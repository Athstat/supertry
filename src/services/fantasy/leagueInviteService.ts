import { LeagueGroupInvite } from "../../types/fantasyLeague";
import { getAuthHeader, getUri } from "../../utils/backendUtils";
import { logger } from "../logger"

export const leagueInviteService = {
    createInvite: async (leagueId: string) => {
        try {
            const uri = getUri(`/api/v1/fantasy-league-groups/${leagueId}/invite`);
            const res = await fetch(uri, {
                headers: getAuthHeader(),
                method: 'POST'
            });

            if (res.ok) {
                return (await res.json()) as LeagueGroupInvite
            }

        } catch (err) {
            logger.error("Error creating invite", err);
        }

        return undefined;
    }
}