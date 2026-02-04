import useSWR from "swr";
import { IProAthlete } from "../../types/athletes"
import { IProSeason } from "../../types/season"
import { swrFetchKeys } from "../../utils/swrKeys";
import { athleteService } from "../../services/athletes/athletesService";
import { ReactNode, useContext, useMemo, useState } from "react";

import { StatCard2 } from "../ui/cards/StatCard";
import { Target } from "lucide-react";
import { ClockFading } from "lucide-react";
import RoundedCard from "../ui/cards/RoundedCard";
import Collapsable from "../ui/containers/Collapsable";
import SportActionCard from "./SportActionCard";
import { useSportActions } from "../../hooks/useSportActions";
import { MdSportsRugby } from "react-icons/md";
import PlayerSeasonStatsProvider, { PlayerSeasonStatsContext } from "../../contexts/ui/PlayerSeasonStatsContext";

type Props = {
  season: IProSeason,
  player: IProAthlete,
  children?: ReactNode
}

// Renders a sheet view with a player season stats
function Root({ season, player, children }: Props) {

  const shouldFetch = Boolean(season?.id) || Boolean(player?.tracking_id);
  const key = shouldFetch ? swrFetchKeys.getAthleteSeasonStats(player.tracking_id, season.id) : null;
  const { data, isLoading } = useSWR(key, () => athleteService.getAthleteSeasonStats(player.tracking_id, season.id));

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
    <div className="grid grid-cols-3 gap-2" >

      <StatCard2
        value={triesScored?.action_count || 0}
        label="Tries Scored"
        className="flex-1 bg-white border border-slate-200"
        icon={<MdSportsRugby className="text-yellow-500 w-7 h-7" />}
        definition={triesScored?.definition}
        actionName={'tries'}
      />

      <StatCard2
        value={gamePointsScored?.action_count || 0}
        label="Game Points "
        className="flex-1 bg-white border border-slate-200"
        icon={<Target className="text-blue-500" />}
        definition={gamePointsScored?.definition}
        actionName={'points'}
      />


      <StatCard2
        value={minutesPlayed?.action_count || 0}
        label="Total Minutes Played"
        className="flex-1 bg-white border border-slate-200"
        icon={<ClockFading className="text-green-500" />}
        definition={minutesPlayed?.definition}
        actionName={'minutes_played_total'}
      />
    </div>
  )
}

type CategoryProps = {
  categoryName?: string,
  label?: string,
  initiallyOpened?: boolean,
  skeletonItemCount?: number
}

function Category({ categoryName, label, initiallyOpened = true, skeletonItemCount = 5 }: CategoryProps) {

  const skeletonCards = Array(skeletonItemCount).fill(0);
  const [isOpen, setOpen] = useState(initiallyOpened);
  const toggle = () => setOpen(prev => !prev);
  const context = useContext(PlayerSeasonStatsContext);

  if (!context) {
    return null;
  }

  const { seasonStats, isLoading } = context;
  const catStats = seasonStats.filter((s) => {
    const nameMatches = (s.definition?.category || '').toLowerCase() === (categoryName || '').toLowerCase();
    const showOnUI = s.definition?.show_on_ui;
    return nameMatches && showOnUI;
  });


  if (isLoading) {

    return (
      <Collapsable
        label={label || categoryName}
        open={isOpen}
        toggle={toggle}
      >
        <div className="flex px-2 pb-4 flex-col gap-2" >
          {skeletonCards.map((s, index) => {
            return (
              <RoundedCard key={s + index} className="h-[40px] rounded-lg bg-slate-200 animate-pulse border-none w-full" />
            )
          })}
        </div>
      </Collapsable>
    )
  }

  return (
    <div>
      <Collapsable
        label={label || categoryName}
        open={isOpen}
        toggle={toggle}
      >
        <div className="" >
          {catStats.map((s) => {
            return (
              <SportActionCard
                sportAction={s}
                className="py-2 px-4 rounded-lg cursor-pointer"
                labelClassName="text-sm text-slate-700 dark:text-slate-200"
              />
            )
          })}
        </div>
      </Collapsable>
    </div>
  )
}

type SpecificActionProps = {
  actionName?: string,
  defaultValue?: number
}

function SpecificAction({ actionName, defaultValue }: SpecificActionProps) {

  const context = useContext(PlayerSeasonStatsContext);
  const { getDefinition } = useSportActions();
  const definition = getDefinition(actionName);

  const sportAction = useMemo(() => {
    if (context) {
      const { seasonStats } = context;
      return seasonStats.find((s) => {
        return s.definition?.action_name === definition?.action_name
      });
    }
  }, [context, definition?.action_name]);

  if (!context) {
    return null;
  }

  const {isLoading} = context;

  if (isLoading) {
    return (
      <RoundedCard className="h-[15px] border-none animate-pulse" >

      </RoundedCard>
    )
  }

  return (
    <>
      <SportActionCard
        sportAction={sportAction}
        fallbackLabel={definition?.display_name}
        fallbackValue={defaultValue}
        labelClassName="text-xs"
        valueClassName="text-xs"
        hideInfoIcon
        disableTooltip
        className="cursor-pointer"
      />
    </>
  )
}


export const PlayerSeasonStatsList = {
  Root,
  Header,
  Category,
  SpecificAction
}