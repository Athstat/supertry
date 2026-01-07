/* eslint-disable react-refresh/only-export-components */
import useSWR from "swr";
import { IProAthlete } from "../../types/athletes"
import { IProSeason } from "../../types/season"
import { swrFetchKeys } from "../../utils/swrKeys";
import { djangoAthleteService } from "../../services/athletes/djangoAthletesService";
import { ReactNode, useContext, useMemo } from "react";
import PlayerSeasonStatsProvider, { PlayerSeasonStatsContext } from "../../contexts/PlayerSeasonStatsContext";
import { StatCard2 } from "../ui/cards/StatCard";
import { Target, Trophy } from "lucide-react";
import { ClockFading } from "lucide-react";
import RoundedCard from "../ui/cards/RoundedCard";

type Props = {
  season: IProSeason,
  player: IProAthlete,
  children?: ReactNode
}

// Renders a sheet view with a player season stats
function Root({ season, player, children }: Props) {

  const shouldFetch = Boolean(season?.id) || Boolean(player?.tracking_id);
  const key = shouldFetch ? swrFetchKeys.getAthleteSeasonStats(player.tracking_id, season.id) : null;
  const { data, isLoading } = useSWR(key, () => djangoAthleteService.getAthleteSeasonStats(player.tracking_id, season.id));

  const stats = useMemo(() => {
    return data || [];
  }, [data]);

  return (
    <PlayerSeasonStatsProvider
      seasonStats={stats}
      isLoading={isLoading}
    >
      {children}
    </PlayerSeasonStatsProvider>
  )
}

function Header() {

  const context = useContext(PlayerSeasonStatsContext);

  const minutesPlayed = useMemo(() => {

    if (context) {
      return context.seasonStats.find((s) => s.definition?.action_name === 'minutes_played_total')
    }

  }, [context]);

  const triesScored = useMemo(() => {

    if (context) {
      return context.seasonStats.find((s) => s.definition?.action_name === 'tries')
    }

  }, [context]);

  const gamePointsScored = useMemo(() => {

    if (context) {
      return context.seasonStats.find((s) => s.definition?.action_name === 'points')
    }

  }, [context]);

  if (!context) {
    return null;
  }

  const { isLoading } = context;

  if (isLoading) {
    return (
      <div className="flex flex-row items-center justify-between gap-2" >

        <RoundedCard
          className="flex-1 h-[110px] border-none bg-slate-200 animate-pulse"
        />

        <RoundedCard
          className="flex-1 h-[110px] border-none bg-slate-200 animate-pulse"
        />

        <RoundedCard
          className="flex-1 h-[110px] border-none bg-slate-200 animate-pulse"
        />
      </div>
    )
  }

  return (
    <div className="flex flex-row items-center justify-between gap-2" >

      <StatCard2
        value={triesScored?.action_count || 0}
        label="Tries Scored"
        className="flex-1 bg-white border border-slate-200"
        icon={<Trophy className="text-yellow-500" />}
      />

      <StatCard2
        value={gamePointsScored?.action_count || 0}
        label="Game Points Scored"
        className="flex-1 bg-white border border-slate-200"
        icon={<Target className="text-blue-500" />}
      />


      <StatCard2
        value={minutesPlayed?.action_count || 0}
        label="Total Minutes Played"
        className="flex-1 bg-white border border-slate-200"
        icon={<ClockFading className="text-green-500" />}
      />
    </div>
  )
}


export const PlayerSeasonStats = {
  Root,
  Header
}