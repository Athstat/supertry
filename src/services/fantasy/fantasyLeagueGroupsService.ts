import { RestPromise } from "../../types/auth";
import { IFantasyLeagueRound } from "../../types/fantasyLeague";
import { EditFantasyLeagueGroupReq, FantasyLeagueGroup, FantasyLeagueGroupMember, FantasyLeagueGroupStanding, MemberRankingDetail, NewFantasyLeagueGroupReq } from "../../types/fantasyLeagueGroups";
import { IFixture } from "../../types/games";
import { getAuthHeader, getUri } from "../../utils/backendUtils"
import { authService } from "../authService";
import { logger } from "../logger";

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

    getAllPublicLeaguesNotMember: async (): Promise<FantasyLeagueGroup[]> => {
        try {

            const authUser = authService.getUserInfoSync();
            const uri = getUri(`/api/v1/fantasy-league-groups/public?not_member=${authUser?.kc_id}`);
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

    getDiscoverLeagues: async (): Promise<FantasyLeagueGroup[]> => {
        try {

            const uri = getUri(`/api/v1/fantasy-league-groups/discover`);
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

    getLeagueByEntryCode: async (entry_code: string): Promise<FantasyLeagueGroup[]> => {
        try {

            const uri = getUri(`/api/v1/fantasy-league-groups/by-entry-code/${entry_code}`);
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

    getMyCreatedLeagues: async (seasonId?: string): Promise<FantasyLeagueGroup[]> => {
        try {

            const queryParams = seasonId ? `?season_id=${seasonId}` : '';
            const uri = getUri(`/api/v1/fantasy-league-groups/mine${queryParams}`);
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

    getJoinedLeagues: async (seasonId?: string): Promise<FantasyLeagueGroup[]> => {
        try {

            const queryParams = seasonId ? `?season_id=${seasonId}` : '';
            const uri = getUri(`/api/v1/fantasy-league-groups/joined${queryParams}`);
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

    /** API to create a league group */
    createGroup: async (data: NewFantasyLeagueGroupReq): RestPromise<FantasyLeagueGroup> => {

        try {

            const uri = getUri(`/api/v1/fantasy-league-groups/`);
            const res = await fetch(uri, {
                headers: getAuthHeader(),
                method: 'POST',
                body: JSON.stringify(data)
            });

            if (res.ok) {
                const json = (await res.json()) as FantasyLeagueGroup;
                return { data: json }
            }

        } catch (err) {
            console.log("Error creating fantasy league group");
        }

        return {
            error: {
                message: "Something wen't wrong creating your fantasy league, please try again"
            }
        }
    },

    editGroupInfo: async (leagueId: string, data: EditFantasyLeagueGroupReq): RestPromise<FantasyLeagueGroup> => {

        try {

            const uri = getUri(`/api/v1/fantasy-league-groups/${leagueId}`);
            const res = await fetch(uri, {
                headers: getAuthHeader(),
                method: 'PUT',
                body: JSON.stringify(data)
            });

            if (res.ok) {
                const json = (await res.json()) as FantasyLeagueGroup;
                return { data: json }
            }

        } catch (err) {
            console.log("Error creating fantasy league group");
        }

        return {
            error: {
                message: "Something wen't wrong creating your fantasy league, please try again"
            }
        }
    },


    getGroupRounds: async (leagueId: string): Promise<IFantasyLeagueRound[]> => {
        try {

            const uri = getUri(`/api/v1/fantasy-league-groups/${leagueId}/rounds`);

            const res = await fetch(uri, {
                headers: getAuthHeader()
            });

            if (res.ok) {
                return (await res.json()) as IFantasyLeagueRound[];
            }

        } catch (err) {
            console.log("Error fetching public fantasy league groups ", err);
        }

        return [];
    },

    joinLeague: async (leagueId: string, entry_code: string): RestPromise<FantasyLeagueGroupMember> => {
        try {
            const uri = getUri(`/api/v1/fantasy-league-groups/${leagueId}/join/${entry_code}`);

            const res = await fetch(uri, {
                headers: getAuthHeader(),
                method: 'POST'
            });

            if (res.ok) {
                const json = (await res.json()) as FantasyLeagueGroupMember;
                return { data: json };
            }

            if (res.status === 404) {
                return {
                    error: {
                        message: "Incorrect Entry Code"
                    }
                }
            }

        } catch (err) {
            console.log("Error joining league");
        }

        return {
            error: {
                message: "Something wen't wrong"
            }
        }
    },

    getGroupRoundGames: async (leagueId: string, roundId: string | number): Promise<IFixture[]> => {
        try {

            const uri = getUri(`/api/v1/fantasy-league-groups/${leagueId}/rounds/${roundId}/games`);

            const res = await fetch(uri, {
                headers: getAuthHeader()
            });

            if (res.ok) {
                return (await res.json()) as IFixture[];
            }

        } catch (err) {
            console.log("Error fetching public fantasy league groups ", err);
        }

        return [];
    },

    /** Fetches the standings for a league */
    getGroupStandings: async (leagueId: string): Promise<FantasyLeagueGroupStanding[]> => {
        try {

            const uri = getUri(`/api/v1/fantasy-league-groups/${leagueId}/standings`);

            const res = await fetch(uri, {
                headers: getAuthHeader()
            });

            if (res.ok) {
                return (await res.json()) as FantasyLeagueGroupStanding[];
            }

        } catch (err) {
            console.log("Error getting league standings");
        }

        return [];
    },

    getMemberRanking: async (id: string, userId: string) : Promise<MemberRankingDetail | undefined> => {
        try {
            const uri = getUri(`/api/v1/fantasy-league-groups/${id}/members/${userId}/ranking`);
            const res = await fetch(uri, {
                headers: getAuthHeader()
            });

            if (res.ok) {
                return (await res.json()) as MemberRankingDetail
            }
        } catch (err) {
            logger.error("Error fetching member standing ", err);
        }

        return undefined;
    }

}