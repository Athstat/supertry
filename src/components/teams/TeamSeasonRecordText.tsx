import { twMerge } from "tailwind-merge";
import { useTeamSeasonRecord } from "../../hooks/teams/useTeamRecord"

type Props = {
  className?: string,
  teamId: string,
  seasonId: string
}

/** Renders a p component with a teams season record */
export default function TeamSeasonRecordText({ teamId, seasonId, className }: Props) {

  const { record, isLoading, recordText } = useTeamSeasonRecord(teamId, seasonId);

  if (!record || isLoading) {
    return;
  }

  return (
    <p className={twMerge(
      "dark:text-slate-400 text-slate-500 text-[12px]",
      className

    )} >
      ({recordText})
    </p>
  )
}
