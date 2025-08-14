import { ChevronRight } from "lucide-react"
import { IProAthlete } from "../../types/athletes"
import { IProSeason } from "../../types/season"
import useSWR from "swr"
import { swrFetchKeys } from "../../utils/swrKeys"
import { djangoAthleteService } from "../../services/athletes/djangoAthletesService"
import RoundedCard from "../shared/RoundedCard"
import { getPlayerAggregatedStat, SportAction } from "../../types/sports_actions"
import SecondaryText from "../shared/SecondaryText"
import { Activity } from "lucide-react"
import { useMemo, useState } from "react"
import { useInView } from "react-intersection-observer"
import NoContentCard from "../shared/NoContentMessage"
import { AnimatePresence, motion } from "framer-motion"
import SportActionCategoryList from "../stats/SportActionCategoryList"

type Props = {
  player: IProAthlete,
  season: IProSeason,
  hideTitle?: boolean
}

/** Renders a Player Season Stats Card  */
export default function PlayerSeasonStatsCard({ player, season, hideTitle = false }: Props) {

  const { ref, inView } = useInView({ triggerOnce: true });

  const key = inView ? swrFetchKeys.getAthleteSeasonStats(player.tracking_id, season.id) : null;
  const { data: actions, isLoading } = useSWR(key, () => djangoAthleteService.getAthleteSeasonStats(player.tracking_id, season.id));

  const [isExpanded, setExpanded] = useState(false);

  if (isLoading) {
    return (
      <div ref={ref} className="flex flex-col bg-slate-200 dark:bg-slate-700/80 w-full p-4 rounded-xl" >

        {!hideTitle && <div className="flex flex-row items-center justify-between" >
          <p className="text-xs" >{season.name}</p>

          <div>
            <div >
              {/* <ChevronDown /> */}
              {/* <ChevronRight /> */}
            </div>
          </div>
        </div>}

        <div className="flex flex-row items-center animate-pulse gap-2 p-2" >
          <RoundedCard className="w-[80px] h-[60px] animate-pulse flex-1 bg-slate-300 dark:bg-slate-600/40 border-none" />
          <RoundedCard className="w-[80px] h-[60px] animate-pulse flex-1 bg-slate-300 dark:bg-slate-600/40 border-none" />
          <RoundedCard className="w-[80px] h-[60px] animate-pulse flex-1 bg-slate-300 dark:bg-slate-600/40 border-none" />
          <RoundedCard className="w-[80px] h-[60px] animate-pulse flex-1 bg-slate-300 dark:bg-slate-600/40 border-none" />
        </div>

      </div>
    )
  }

  const toggleExpand = () => {
    setExpanded(prev => !prev);
  }

  const tries = getPlayerAggregatedStat("Tries", actions)?.action_count;
  const minutesPlayed = getPlayerAggregatedStat('MinutesPlayed', actions)?.action_count || getPlayerAggregatedStat('minutes_played_total', actions)?.action_count;
  const points = getPlayerAggregatedStat('Points', actions)?.action_count;

  return (
    <motion.div ref={ref} className="flex flex-col gap-2"

    >

      {!hideTitle && <SecondaryText className="flex flex-rowi items-center gap-2" >
        <Activity className="w-4 h-4" />
        <SecondaryText>Season Stats</SecondaryText>
      </SecondaryText>}

      <div
        className="flex flex-col bg-slate-50 border border-slate-300 dark:bg-slate-700/80 w-full gap-4 p-4 rounded-xl"
      >
        <div className="flex flex-row items-center justify-between" >
          <p className="text-xs" >{season.name}</p>

          <div>
            <motion.button
              className="w-6 h-6 bg-slate-300 dark:bg-slate-600 rounded-full items-center justify-center flex flex-col"
              animate={{ rotate: isExpanded ? 90 : 0 }}
              transition={{ duration: 0.25 }}
              onClick={toggleExpand}
            >
              <ChevronRight className="w-4 h-4" />
            </motion.button>
          </div>
        </div>

        <div className="flex flex-row items-center divide-x divide-slate-100 dark:divide-slate-600/60" >
          <div className="flex flex-col items-center w-full text-center flex-1 justify-start" >
            <p className="font-bold" >{tries ?? "0"}</p>
            <SecondaryText className="text-center text-wrap text-xs truncate" >Tries</SecondaryText>
          </div>

          <div className="flex flex-col items-center text-center flex-1 justify-start" >
            <p className="font-bold" >{points ?? "0"}</p>
            <SecondaryText className="text-center text-xs truncate" >Points</SecondaryText>
          </div>

          {/* <div className="flex flex-col items-center text-center flex-1 justify-start" >
          <p className="font-bold" >{tacklesMade}</p>
          <SecondaryText className="text-center text-xs truncate" >Takles Made</SecondaryText>
        </div> */}

          <div className="flex flex-col items-center text-center flex-1 justify-start" >
            <p className="font-bold" >{minutesPlayed ?? "0"}</p>
            <SecondaryText className="text-center text-xs truncate" >Minutes Played</SecondaryText>
          </div>
        </div>

        <AnimatePresence initial={false}>
          {isExpanded && actions && (
            <motion.div
              key="statsTray"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <StatsTray player={player} stats={actions} season={season} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}

type StatsTrayProps = {
  player: IProAthlete,
  stats: SportAction[],
  season: IProSeason
}

function StatsTray({ player, season, stats }: StatsTrayProps) {

  const categories: string[] = useMemo(() => {
    const seen: Set<string> = new Set();

    stats.forEach((s) => {
      const { definition } = s;
      if (definition?.category && !seen.has(definition.category)) {
        seen.add(definition.category);
      }
    });

    return [...seen];
  }, [stats]);

  if (stats.length === 0) {
    return (
      <NoContentCard
        messageClassName="w-full"
        message={`${player.player_name}'s stats for ${season.name} are not available`}
      />
    )
  }

  return (
    <div className="flex flex-col gap-2" >
      <div  className="flex flex-col gap-2" >
        {categories.map((c, index) => {
          return <SportActionCategoryList 
            categoryName={c}
            stats={stats}
            key={index}
          />
        })}
      </div>
    </div>
  )
}