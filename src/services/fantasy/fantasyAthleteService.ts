import { FantasyAthletePointsBreakdownItem, SquadReportItem } from "../../types/fantasyTeamAthlete";
import { getAuthHeader, getUri } from "../../utils/backendUtils"

export const fantasyAthleteService = {

    /** Gets points breakdown for a player */
    getRoundPointsBreakdown: async (fantasyAthleteId: string | number, round: number, seasonId: string) : Promise<FantasyAthletePointsBreakdownItem[]> => {

        try {

            const uri = getUri(`/api/v1/fantasy-athletes/${fantasyAthleteId}/points-breakdown?round=${round}&league=${seasonId}`);
            const res = await fetch(uri, {
                headers: getAuthHeader()
            });

            if (res.ok) {
                return (await res.json()) as FantasyAthletePointsBreakdownItem[];
            }

        } catch (err) {
            console.log("Error fetching athlete points breakdown ", err);
        }


        return [];

    },

    getRoundSquadReport: async (teamId: number | string, trackingId: string) : Promise<SquadReportItem | undefined> => {
        try {
            const uri = getUri(`/api/v1/fantasy-teams/${teamId}/squad-report/${trackingId}`);
            console.log("URI ", uri);
            const res = await fetch(uri, {
                headers: getAuthHeader()
            });

            if (res.ok) {
                return (await res.json()) as SquadReportItem;
            }
        } catch (err) {
            console.log("Error fetching athlete squad report ", err);
        }

        return undefined;
    }
}