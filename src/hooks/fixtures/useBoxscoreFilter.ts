import { useMemo } from "react";
import { IFixture } from "../../types/games";
import { useQueryState } from "../useQueryState";
import { IProTeam } from "../../types/team";

/** Hook thats provides functionality for filtering athletes in a boxscore */
export function useBoxscoreFilter(fixture: IFixture) {
    const [selectedTeamId, setSelectedTeamId] = useQueryState<string>(`bstid`, {init: fixture?.team?.athstat_id});

    const selectedTeam: IProTeam | undefined = useMemo(() => {

        if (selectedTeamId === fixture?.team?.athstat_id) {
            return fixture.team;
        } else if (selectedTeamId === fixture?.opposition_team?.athstat_id) {
            return fixture.opposition_team;
        }

        return fixture.team ?? undefined;

    }, [selectedTeamId, fixture]);

    return {
        selectedTeamId,
        setSelectedTeamId,
        selectedTeam
    }
}