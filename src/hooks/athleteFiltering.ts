import { useMemo } from "react";
import { IProAthlete } from "../types/athletes";
import { formatPosition, formBias } from "../utils/athleteUtils";
import { SortDirection, SortField } from "../types/playerSorting";


type Props = {
    athletes: IProAthlete[],
    selectedPositions?: string[],
    selectedTeamIds?: string[],
    sortField?: SortField,
    sortDirection?: SortDirection
}

/** Is a comprehensive filter and sorter that handles
 * position filtering, team filtering and so on */

export default function useAthleteFilter(data: Props) {
    const {
        athletes, selectedPositions, selectedTeamIds,
        sortField, sortDirection
    } = data;

    // To avoid mutating main athletes list
    const buff = [...athletes];

    const byPosition = useAthletePositionFilter(buff, selectedPositions);
    const byTeams = useAthleteTeamFilter(byPosition, selectedTeamIds);
    const bySort = useAthleteSorter(byTeams, sortField, sortDirection);

    return {sortedAthletes: bySort};
}

/** Hook that filters athletes by selected positions and postion classes */
export function useAthletePositionFilter(athletes: IProAthlete[], selectedPositions: string[] | undefined) {
    
    const formatted = useMemo(() => {

        if (selectedPositions === undefined) return undefined;

        return selectedPositions.map((p) => {
            return formatPosition(p);
        })
    }, [selectedPositions]);
    
    return useMemo(() => {


        const filtered = [...athletes]

        if (!formatted || filtered.length === 0) {
            return athletes;
        }

        return filtered.filter((a) => {

            const position = a.position;
            const positionClass = a.position_class;
        
            const hasPosition = (position !== undefined) && position !== null;
            const hasPositionClass = (positionClass !== undefined) && positionClass !== null;

            const matchesPosition = hasPosition && formatted.includes(formatPosition(position));
            const matchesPositionClass = hasPositionClass && formatted.includes(formatPosition(positionClass));

            return matchesPosition || matchesPositionClass

        });
    }, [athletes, formatted]);
}

export function useAthleteTeamFilter(athletes: IProAthlete[], selectedTeamIds: string[] | undefined) {
    
    
    return useMemo(() => {
        const filtered = [...athletes];

        if (selectedTeamIds === undefined || selectedTeamIds.length === 0) {
            return filtered;
        }

        return filtered.filter((a) => {
            const matchesTeamsId = selectedTeamIds.includes(a.team_id);
            return matchesTeamsId;
        });

    }, [athletes, selectedTeamIds])
}


export function useAthleteSorter(athletes: IProAthlete[], sortType: SortField | undefined, direction: SortDirection | undefined) {

    
    return useMemo(() => {
        const sorted = [...athletes];

        if (!sortType || !direction) {
            return sorted;
        }

        if (sortType === 'form') {

            return sorted.sort((a, b) => {
                return direction === "asc" ?
                    formBias(a.power_rank_rating ?? 0, a.form) - formBias(b.power_rank_rating ?? 0, b.form)
                : formBias(b.power_rank_rating ?? 0, b.form) - formBias(a.power_rank_rating ?? 0, a.form)
            })

        }

        if (sortType === "power_rank_rating") {
            return sorted.sort((a, b) => {
                return direction === "asc" ? 
                    (a.power_rank_rating ?? 0) - (b.power_rank_rating ?? 0)
                    : (b.power_rank_rating ?? 0) - (a.power_rank_rating ?? 0)
            })
        }

        if (sortType === "player_name") {
            return sorted.sort((a, b) => {
                return direction === "asc" ?
                    (a.player_name.localeCompare(b.player_name))
                    : (b.player_name.localeCompare(a.player_name))
            }); 
        }

        return sorted;

    }, [sortType, direction, athletes]);

}