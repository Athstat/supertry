import { useState } from "react"
import { FantasyLeagueGroup } from "../../types/fantasyLeagueGroups"

type Props = {
    league?: FantasyLeagueGroup
}

export default function LeagueGroupBanner({league} : Props) {

  const [error,setError] = useState(false);

  if (league?.banner && !error) {
    return (
      <div className="w-full max-h-[240px] overflow-clip" >
        <img 
          onError={() => setError(true)}
          src={league.banner}
          alt={`${league.title} Banner`}
          className="w-full h-fit object-fill"
        />
      </div>
    )
  }

  return (
    <div className="w-full h-[150px]  bg-slate-300 dark:bg-slate-700" >
      
    </div>
  )
}
