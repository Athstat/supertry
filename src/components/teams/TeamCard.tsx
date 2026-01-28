import { twMerge } from "tailwind-merge"
import { ITeam } from "../../types/fixtures"
import TeamLogo from "../team/TeamLogo"
import RoundedCard from "../ui/cards/RoundedCard"

type Props = {
    className?: string,
    team: ITeam
}

export default function ProTeamCard({team, className} : Props) {
  
  const onClick = () => {
    navigator.clipboard.writeText(team.athstat_id)
  }
  
  return (
    <RoundedCard onClick={onClick} className={twMerge(
        "p-4 flex flex-col items-center dark:bg-slate-800/60 justify-center gap-2",
        className
    )} >
        <TeamLogo className="w-12 h-12" url={team.image_url} teamName={team.athstat_name} />
        <p className="text-xs" >{team.athstat_name}</p>
    </RoundedCard>
  )
}
