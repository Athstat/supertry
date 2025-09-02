import { useMemo } from "react";
import { useFantasyLeagueGroup } from "../../../hooks/leagues/useFantasyLeagueGroup"
import { getLeagueStandingsFilterItems } from "../../../utils/standingsUtils";
import { twMerge } from "tailwind-merge";

type Props = {
  value?: string,
  onChange: (v?: string) => void
}

export default function LeagueStandingsFilterSelector({ value, onChange }: Props) {

  const { rounds } = useFantasyLeagueGroup();

  const options = useMemo(() => {
    return getLeagueStandingsFilterItems(rounds);
  }, [rounds]);

  const currentOption = options.find((p) => p.id === value);

  const otherOptions = options.filter((p) => {
    return p.id !== value;
  });

  return (
    <div>

      <select
        className={twMerge(
          'dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 bg-slate-100 px-6 py-2 rounded-xl'
        )}
        value={value}
        onChange={(v) => onChange(v.target.value)}
      >
        {currentOption && <option value={currentOption.id} key={currentOption.id} >{currentOption.lable}</option>}

        {otherOptions.map((o) => {
          return <option value={o.id} key={o.id} >{o.lable}</option>
        })}
      </select>

    </div>
  )
}

type SelectedWeekIndicatorProps = {
  value?: string
}

export function SelectedWeekIndicator({ value }: SelectedWeekIndicatorProps) {

  const { rounds } = useFantasyLeagueGroup();

  const options = useMemo(() => {
    return getLeagueStandingsFilterItems(rounds);
  }, [rounds]);

  const currentOption = options.find((p) => p.id === value);

  return (
    <div className="text-white" >
      {currentOption?.lable}
    </div>
  )
}