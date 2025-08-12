import { ChevronRight } from "lucide-react"
import { IProAthlete } from "../../types/athletes"
import { IProSeason } from "../../types/season"
import useSWR from "swr"
import { swrFetchKeys } from "../../utils/swrKeys"
import { djangoAthleteService } from "../../services/athletes/djangoAthletesService"
import RoundedCard from "../shared/RoundedCard"
import { getPlayerAggregatedStat } from "../../types/sports_actions"
import SecondaryText from "../shared/SecondaryText"
import { Activity } from "lucide-react"

type Props = {
  player: IProAthlete,
  season: IProSeason
}

/** Renders a Player Season Stats Card  */
export default function PlayerSeasonStatsCard({ player, season }: Props) {

  const key = swrFetchKeys.getAthleteSeasonStats(player.tracking_id, season.id);
  const { data: actions, isLoading } = useSWR(key, () => djangoAthleteService.getAthleteSeasonStats(player.tracking_id, season.id));

  if (isLoading) {
    return (
      <div className="flex flex-col bg-slate-200 w-full p-4 rounded-xl" >
        <div className="flex flex-row items-center justify-between" >
          <p className="text-xs" >{season.name}</p>

          <div>
            <div >
              {/* <ChevronDown /> */}
              {/* <ChevronRight /> */}
            </div>
          </div>
        </div>

        <div className="flex flex-row items-center animate-pulse gap-2 p-2" >
          <RoundedCard className="w-[80px] h-[60px] animate-pulse flex-1 bg-slate-300 border-none" />
          <RoundedCard className="w-[80px] h-[60px] animate-pulse flex-1 bg-slate-300 border-none" />
          <RoundedCard className="w-[80px] h-[60px] animate-pulse flex-1 bg-slate-300 border-none" />
          <RoundedCard className="w-[80px] h-[60px] animate-pulse flex-1 bg-slate-300 border-none" />
        </div>

      </div>
    )
  }

  const tries = getPlayerAggregatedStat("Tries", actions)?.action_count;
  const passes = getPlayerAggregatedStat("Passes", actions)?.action_count;
  const minutesPlayed = getPlayerAggregatedStat('MinutesPlayed', actions)?.action_count;

  return (
    <div className="flex flex-col gap-2" >
      <SecondaryText className="flex flex-rowi items-center gap-2" >
        <Activity className="w-4 h-4" />
        <SecondaryText>Season Stats</SecondaryText>
      </SecondaryText>

      <div className="flex flex-col bg-slate-200 w-full gap-2 p-4 rounded-xl" >
        <div className="flex flex-row items-center justify-between" >
          <p className="text-xs" >{season.name}</p>

          <div>
            <div >
              {/* <ChevronDown /> */}
              <ChevronRight className="w-4 h-4" />
            </div>
          </div>
        </div>

        <div className="flex flex-row items-center" >
          <div className="flex flex-col items-center w-full text-center flex-1 justify-start" >
            <p className="font-bold" >{tries}</p>
            <SecondaryText className="text-center text-wrap text-xs truncate" >Tries</SecondaryText>
          </div>

          <div className="flex flex-col items-center text-center flex-1 justify-start" >
            <p className="font-bold" >{passes}</p>
            <SecondaryText className="text-center text-xs truncate" >Passes</SecondaryText>
          </div>

          {/* <div className="flex flex-col items-center text-center flex-1 justify-start" >
          <p className="font-bold" >{tacklesMade}</p>
          <SecondaryText className="text-center text-xs truncate" >Takles Made</SecondaryText>
        </div> */}

          <div className="flex flex-col items-center text-center flex-1 justify-start" >
            <p className="font-bold" >{minutesPlayed}</p>
            <SecondaryText className="text-center text-xs truncate" >Minutes Played</SecondaryText>
          </div>
        </div>

      </div>
    </div>
  )
}
