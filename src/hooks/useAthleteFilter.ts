import { useEffect, useState, useTransition } from "react";
import { IProAthlete } from "../types/athletes";
import { athletePositionFilter, athleteSearchFilter, athleteSorter, athleteTeamFilter } from "../utils/athleteUtils";
import { SortDirection, SortField } from "../types/playerSorting";


type Props = {
    athletes: IProAthlete[],
    selectedPositions?: string[],
    selectedTeamIds?: string[],
    sortField?: SortField,
    sortDirection?: SortDirection,
    searchQuery?: string
}

/** Is a comprehensive filter and sorter that handles
 * position filtering, team filtering and so on */

export default function useAthleteFilter(data: Props) {
    const {
        athletes, selectedPositions, selectedTeamIds,
        sortField, sortDirection, searchQuery
    } = data;

    const [filteredAthletes, setFilteredAthletes] = useState(athletes);
    const [isPending, startTransition] = useTransition();

    useEffect(() => {
        startTransition(() => {

            const buff = [...athletes];

            console.log("Buffer athletes ", buff);
            const byPosition = athletePositionFilter(buff, selectedPositions);
            console.log("By position ", byPosition);
            const byTeams = athleteTeamFilter(byPosition, selectedTeamIds);
            console.log("By Team ", byTeams);

            const bySearch = athleteSearchFilter(byTeams, searchQuery);
            console.log("By Search ", bySearch);
            const bySort = athleteSorter(bySearch, sortField, sortDirection);
            console.log("By sort ", bySort);

            setFilteredAthletes(bySort);
        });
    }, [athletes, selectedPositions, selectedTeamIds,
        sortField, sortDirection, searchQuery
    ]);

    return { filteredAthletes, isFiltering: isPending };
}

