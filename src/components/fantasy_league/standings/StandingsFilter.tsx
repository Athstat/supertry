import { IFantasyLeagueRound } from "../../../types/fantasyLeague";
import { StandingsFilterItem } from "../../../types/standings";
import { DropdownOption } from "../../../types/ui";
import Dropdown from "../../ui/forms/Dropdown";

type Props = {
    currentRound?: StandingsFilterItem,
    onChange?: (newVal?: string | undefined) => void,
    leagueRounds: IFantasyLeagueRound[]
}

/** Renders component responsible for filtering the league standings */
export default function LeagueStandingsFilter({ currentRound, onChange, leagueRounds }: Props) {

    const sortedRounds = leagueRounds;

    let dropdownOptions: DropdownOption[] = (sortedRounds ?? []).map((r) => {
        return {
            value: r.id,
            label: r.title
        }
    });

    dropdownOptions = [{ value: "overall", label: "Overall" }, ...dropdownOptions];

    return (
        <div className="flex flex-row items-center px-4 justify-between">
            <div>
                <p className="font-medium text-lg" >
                    {currentRound?.lable} Rankings
                </p>
            </div>

            <div>

                <Dropdown
                    options={dropdownOptions}
                    onChange={onChange}
                    value={currentRound?.id}
                    showSearch
                    className="w-[140px]"
                />

            </div>
        </div>
    )

}
