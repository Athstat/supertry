import { FantasyLeagueGroup } from "../../types/fantasyLeagueGroups"

type Props = {
    league?: FantasyLeagueGroup
}

export default function LeagueGroupBanner({league} : Props) {

  if (league?.banner) {
    return (
      <div className="w-full h-[240px] overflow-clip" >
        <img 
          src={league.banner}
          alt={`${league.title} Banner`}
          className="w-full h-fit object-fill"
        />
      </div>
    )
  }

  return (
    <div className="w-full h-[240px]  bg-slate-300 dark:bg-slate-700" >
      
    </div>
  )
}
