import { FantasyLeagueGroup, FantasyLeagueGroupMember } from "../../types/fantasyLeagueGroups";
import { getAuthHeader, getUri } from "../../utils/backendUtils"

export const fantasyLeagueGroupsService = {

    getAllPublicLeagues: async (): Promise<FantasyLeagueGroup[]> => {
        try {

            const uri = getUri(`/api/v1/fantasy-league-groups/public`);
            const res = await fetch(uri, {
                headers: getAuthHeader()
            });

            if (res.ok) {
                return (await res.json()) as FantasyLeagueGroup[];
            }

        } catch (err) {
            console.log("Error fetching public fantasy league groups ", err);
        }

        return [];
    },

    getMyCreatedLeagues: async (): Promise<FantasyLeagueGroup[]> => {
        try {

            const uri = getUri(`/api/v1/fantasy-league-groups/mine`);
            const res = await fetch(uri, {
                headers: getAuthHeader()
            });

            if (res.ok) {
                return (await res.json()) as FantasyLeagueGroup[];
            }

        } catch (err) {
            console.log("Error fetching user's fantasy league groups ", err);
        }

        return [];
    },

    getJoinedLeagues: async (): Promise<FantasyLeagueGroup[]> => {
        try {

            const uri = getUri(`/api/v1/fantasy-league-groups/joined`);
            const res = await fetch(uri, {
                headers: getAuthHeader()
            });

            if (res.ok) {
                return (await res.json()) as FantasyLeagueGroup[];
            }

        } catch (err) {
            console.log("Error fetching user's fantasy league groups ", err);
        }

        return [];
    },

    getGroupById: async (leagueId: string) => {
        try {
            const uri = getUri(`/api/v1/fantasy-league-groups/${leagueId}`);
            const res = await fetch(uri, {
                headers: getAuthHeader()
            });

            if (res.ok) {
                return (await res.json()) as FantasyLeagueGroup;
            }
        } catch (err) {
            console.log("Error fetching fantasy league group ", err);
        }

        return undefined;
    },

    getGroupMembers: async (leagueId: string): Promise<FantasyLeagueGroupMember[]> => {
        try {

            const uri = getUri(`/api/v1/fantasy-league-groups/${leagueId}/members`);

            const res = await fetch(uri, {
                headers: getAuthHeader()
            });

            if (res.ok) {
                return (await res.json()) as FantasyLeagueGroupMember[];
            }

        } catch (err) {
            console.log("Error fetching public fantasy league groups ", err);
        }

        return [];
    },

}