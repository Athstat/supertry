import { baseUrl } from "./athleteService";

export const athleteSportActionsService = {
    getByAthlete: async (athleteId: string) => {
        const access_token = localStorage.getItem("access_token");

        const res = await fetch(
            `${baseUrl}/api/v1/sports-actions/aggregated/athletes/${athleteId}`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    ...(localStorage.getItem("access_token") && {
                        Authorization: `Bearer ${access_token}`,
                    }),
                },
            }
        );

        return (await res.json()) as any;
    }
}