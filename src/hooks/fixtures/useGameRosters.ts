import useSWR, { preload } from "swr";
import { gamesService } from "../../services/gamesService";
import { IFixture } from "../../types/games";
import { useMemo } from "react";

export function useGameRosters(fixture: IFixture) {
    const fixtureId = fixture.game_id;
    const rostersKey = fixtureId ? `fixtures/${fixtureId}/rosters` : null;
    const { data: fetchedRosters, isLoading } = useSWR(rostersKey, () => gamesService.getGameRostersById(fixtureId ?? ""));

    const rosters = useMemo(() => {
        return fetchedRosters ?? [];
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

export function preloadGameRosters(fixture?: IFixture) {
    const fixtureId = fixture?.game_id;
    const rostersKey = fixtureId ? `fixtures/${fixtureId}/rosters` : null;

    preload(rostersKey, () => gamesService.getGameRostersById(fixtureId ?? ""));
}