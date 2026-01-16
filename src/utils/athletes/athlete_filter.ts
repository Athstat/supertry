import { IProAthlete } from "../../types/athletes";
import { SortDirection, SortField } from "../../types/playerSorting";
import { athleteSearchPredicate } from "./athleteUtils";

export class AthleteFilterBuilder {
    public constructor(private athletes: IProAthlete[]) {
    }

    public realPositition(position: string) {
        this.athletes = this.athletes.filter(a => {
            return a.position?.toLowerCase() === position.toLowerCase();
        });

        return this;
    }

    public positionClass(positionClass?: string) {
        this.athletes = this.athletes.filter(a => {
            if (positionClass === "super-sub") {
                return true
            }

            return a.position_class?.toLowerCase() === positionClass?.toLowerCase()
        })

        return this;
    }

    public teamIds(targetTeamIds: string[]) {

        if (targetTeamIds.length > 0) {   
            this.athletes = this.athletes.filter((a) => {
                const foundMatch = a.athlete_teams?.find((t) => targetTeamIds.includes(t.team_id));
                return Boolean(foundMatch)
            });
        }

        return this;
    }

    public search(searchQuery?: string) {
        this.athletes = this.athletes.filter((a) => {
            if (searchQuery) {
                return athleteSearchPredicate(a, searchQuery)
            }

            return true;
        })

        return this;
    }

    public excludeIds(excludeIds: string[]) {
        this.athletes = this.athletes.filter((a) => {
            const foundMatchOnExcludeIds = excludeIds.find((id) => a.tracking_id === id);
            return Boolean(foundMatchOnExcludeIds) === false;
        })

        return this;
    }

    public sort(sortField: SortField | null | undefined, sortDirection: SortDirection | null | undefined) {

        if (sortField && sortDirection) {

            this.athletes = this.athletes.sort((a, b) => {
                let aValue = 0;
                let bValue = 0;

                if (sortField === 'power_rank_rating') {
                    aValue = a.power_rank_rating ?? 0;
                    bValue = b.power_rank_rating ?? 0;
                } else if (sortField === 'price') {
                    aValue = a.price ?? 0;
                    bValue = b.price ?? 0;
                }

                if (sortDirection === 'asc') {
                    return aValue - bValue;
                } else {
                    return bValue - aValue;
                }
            });
        }

        return this;

    }

    public affordabilitySort(remainingBudget: number) {
        this.athletes = this.athletes.sort((a, b) => {
            const isA_Affordable = (a?.price ?? 0) <= remainingBudget;
            const isB_Affordable = (b?.price ?? 0) <= remainingBudget;

            const aBias = isA_Affordable ? 0 : 1;
            const bBias = isB_Affordable ? 0 : 1;

            return (aBias - bBias);
        })

        return this;
    }

    public build() {
        return this.athletes;
    }
}