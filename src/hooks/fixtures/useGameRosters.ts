import useSWR from "swr";
import { gamesService } from "../../services/gamesService";
import { IFixture } from "../../types/games";
import { useMemo } from "react";

export function useGameRosters(fixture: IFixture) {
    const fixtureId = fixture.game_id;
    const rostersKey = fixtureId ? `fixtures/${fixtureId}/game-rosters` : null;
    
    const { data: fetchedRosters, isLoading } = useSWR(rostersKey, () => gamesService.getGameRostersById(fixtureId ?? ""), {
        revalidateOnFocus: false
    });

    const rosters = useMemo(() => {
        return (fetchedRosters ?? []);
    }, [fetchedRosters]);

    const awayRoster = rosters.filter((r) => {
        return r.team_id === fixture?.opposition_team?.athstat_id;
    });

    const homeRoster = rosters.filter((r) => {
        return r.team_id === fixture?.team?.athstat_id;
    })


    return {
        rosters,
        isLoading,
        awayRoster,
        homeRoster
    }
}