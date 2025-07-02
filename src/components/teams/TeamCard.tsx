import { twMerge } from "tailwind-merge"
import { ITeam } from "../../types/games"
import RoundedCard from "../shared/RoundedCard"
import TeamLogo from "../team/TeamLogo"

type Props = {
    className?: string,
    team: ITeam
}

export default function ProTeamCard({team, className} : Props) {
  return (
    <RoundedCard className={twMerge(
        "p-4 flex flex-col items-center dark:bg-slate-800/60 justify-center gap-2",
        className
    )} >
        <TeamLogo className="w-12 h-12" url={team.image_url} />
        <p className="text-xs" >{team.athstat_name}</p>
    </RoundedCard>
  )
}
