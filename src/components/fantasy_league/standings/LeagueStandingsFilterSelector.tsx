import { useLeagueRoundStandingsFilter } from "../../../hooks/fantasy/useLeagueRoundStandingsFilter";
import { Fragment } from "react/jsx-runtime";
import SecondaryText from "../../ui/typography/SecondaryText";
import { DropdownOption } from "../../../types/ui";
import { useFantasyLeagueGroup } from "../../../hooks/leagues/useFantasyLeagueGroup";
import Dropdown from "../../ui/forms/Dropdown";


/** Renders a drop down to select a week for a fantasy league group */
export default function LeagueStandingsFilterSelector() {

  const {
    setRoundFilterId: onChange,
    currentOption
  } = useLeagueRoundStandingsFilter();

  const {sortedRounds} = useFantasyLeagueGroup();

  let dropdownOptions: DropdownOption[] = (sortedRounds ?? []).map((r) => {
    return {
      value: r.id,
      label: r.title
    }
  });

  dropdownOptions = [{value: "overall", label: "Overall"}, ...dropdownOptions];

  return (
    <div>

      <Dropdown 
        options={dropdownOptions}
        onChange={onChange}
        value={currentOption?.id}
        showSearch
        className="w-[140px]"
      />

    </div>
  )
}

export function SelectedWeekIndicator() {

  const { currentOption } = useLeagueRoundStandingsFilter();

  return (
    <Fragment>
      {<div className="" >
        <SecondaryText className="font-medium text-md" >
          {currentOption?.lable} Rankings
        </SecondaryText>
      </div>}
    </Fragment>
  )
}