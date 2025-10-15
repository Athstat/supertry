import { ChevronRight, Target, Trophy, Activity } from 'lucide-react';
import { IProAthlete } from '../../types/athletes';
import { IProSeason } from '../../types/season';
import useSWR from 'swr';
import { swrFetchKeys } from '../../utils/swrKeys';
import { djangoAthleteService } from '../../services/athletes/djangoAthletesService';
import RoundedCard from '../shared/RoundedCard';
import { getPlayerAggregatedStat } from '../../types/sports_actions';
import SecondaryText from '../shared/SecondaryText';
import { useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { AnimatePresence, motion } from 'framer-motion';
import PlayerSeasonStatsTray from '../stats/PlayerSeasonStatsTray';

type Props = {
  player: IProAthlete;
  season: IProSeason;
  hideTitle?: boolean;
};

/** Renders a Player Season Stats Card  */
export default function PlayerSeasonStatsCard({ player, season, hideTitle = false }: Props) {
  const { ref, inView } = useInView({ triggerOnce: true });

  const key = inView ? swrFetchKeys.getAthleteSeasonStats(player.tracking_id, season.id) : null;
  const { data: actions, isLoading } = useSWR(key, () =>
    djangoAthleteService.getAthleteSeasonStats(player.tracking_id, season.id)
  );

  const [isExpanded, setExpanded] = useState(false);

  if (isLoading) {
    return (
      <div
        ref={ref}
        className="flex flex-col bg-slate-200/50 dark:bg-slate-800/50 backdrop-blur-md w-full p-4 rounded-2xl ring-1 ring-white/10 shadow-lg"
      >
        {!hideTitle && (
          <div className="flex flex-row items-center justify-between">
            <p className="text-xs">{season.name}</p>
          </div>
        )}

        <div className="flex flex-row items-center animate-pulse gap-3 p-2">
          <RoundedCard className="w-[80px] h-[60px] animate-pulse flex-1 bg-slate-300/50 dark:bg-slate-600/40 border-none" />
          <RoundedCard className="w-[80px] h-[60px] animate-pulse flex-1 bg-slate-300/50 dark:bg-slate-600/40 border-none" />
          <RoundedCard className="w-[80px] h-[60px] animate-pulse flex-1 bg-slate-300/50 dark:bg-slate-600/40 border-none" />
        </div>
      </div>
    );
  }

  const toggleExpand = () => {
    setExpanded(prev => !prev);
  };

  const tries = getPlayerAggregatedStat('Tries', actions)?.action_count;
  const minutesPlayed =
    getPlayerAggregatedStat('MinutesPlayed', actions)?.action_count ||
    getPlayerAggregatedStat('minutes_played_total', actions)?.action_count;
  const points = getPlayerAggregatedStat('Points', actions)?.action_count;

  return (
    <motion.div ref={ref} className="flex flex-col gap-2">
      <div className="relative flex flex-col bg-slate-200/50 dark:bg-slate-800/50 backdrop-blur-md w-full gap-4 p-4 rounded-2xl ring-1 ring-white/10 shadow-lg transition-all duration-200 hover:shadow-xl">
        {/* Header */}
        <div className="flex flex-row items-center justify-between">
          <p className="text-sm font-semibold dark:text-white">{season.name}</p>

          <motion.button
            className="w-7 h-7 bg-slate-300/50 dark:bg-slate-600/50 backdrop-blur-sm rounded-full items-center justify-center flex hover:bg-slate-300/70 dark:hover:bg-slate-600/70 transition-colors"
            animate={{ rotate: isExpanded ? 90 : 0 }}
            transition={{ duration: 0.25 }}
            onClick={toggleExpand}
          >
            <ChevronRight className="w-4 h-4" />
          </motion.button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-4">
          {/* Tries */}
          <div className="flex flex-col items-center gap-2 p-3 rounded-xl bg-white/5 backdrop-blur-sm">
            <Trophy className="w-5 h-5 text-amber-400" />
            <p className="font-bold text-lg dark:text-white">{tries ?? '0'}</p>
            <SecondaryText className="text-center text-xs">Tries</SecondaryText>
          </div>

          {/* Points */}
          <div className="flex flex-col items-center gap-2 p-3 rounded-xl bg-white/5 backdrop-blur-sm">
            <Target className="w-5 h-5 text-blue-400" />
            <p className="font-bold text-lg dark:text-white">{points ?? '0'}</p>
            <SecondaryText className="text-center text-xs">Points</SecondaryText>
          </div>

          {/* Minutes Played */}
          <div className="flex flex-col items-center gap-2 p-3 rounded-xl bg-white/5 backdrop-blur-sm">
            <Activity className="w-5 h-5 text-green-400" />
            <p className="font-bold text-lg dark:text-white">{minutesPlayed ?? '0'}</p>
            <SecondaryText className="text-center text-xs">Minutes</SecondaryText>
          </div>
        </div>

        {/* Expandable Stats Tray */}
        <AnimatePresence initial={false}>
          {isExpanded && actions && (
            <motion.div
              key="statsTray"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.4, ease: 'easeInOut' }}
              className="overflow-hidden"
            >
              <PlayerSeasonStatsTray player={player} stats={actions} season={season} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
