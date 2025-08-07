import { ChevronRight, Calendar, Check } from 'lucide-react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { useCountdown } from '../../../hooks/useCountdown';
import LeagueLockStatus from './LeagueLockStatus';
import { calculateJoinDeadline, isLeagueLocked } from '../../../utils/leaguesUtils';
import LeagueLiveIndicator from '../LeagueLiveIndicator';
import LeagueTeamsCount from './LeagueTeamsCount';
import { IFantasyLeague } from '../../../types/fantasyLeague';
import { useFetch } from '../../../hooks/useFetch';
import { leagueService } from '../../../services/leagueService';

type Props = {
  league: IFantasyLeague;
  onLeagueClick: (league: IFantasyLeague) => void;
  custom?: number;
  isJoined?: boolean;
  hideIfNoTeamsJoined?: boolean;
  getGamesByCompetitionId: (competitionId: string) => any[];
};

export function LeagueCard({ league, onLeagueClick, custom = 0, isJoined = false, getGamesByCompetitionId }: Props) {
  const isLocked = isLeagueLocked(league.join_deadline);
  const adjustedDeadline = calculateJoinDeadline(league);

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0, y: 10 },
        visible: {
          opacity: 1,
          y: 0,
          transition: {
            type: 'spring',
            stiffness: 400,
            damping: 25,
            delay: custom * 0.1,
          },
        },
      }}
      onClick={() => onLeagueClick(league)}
      className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-slate-800 dark:bg-slate-800/50 cursor-pointer hover:shadow-md transition-shadow"
      whileHover={{
        scale: 1.02,
        transition: { type: 'spring', stiffness: 300 },
      }}
    >
      <div className="flex justify-between items-start mb-3 relative">
        <h3 className="font-semibold text-gray-900 dark:text-white text-base">{league.title}</h3>
        <div className="flex items-center gap-2">
          {isJoined && (
            <div className="px-2 py-0.5 text-xs rounded-full bg-blue-600 dark:bg-blue-500 text-white font-semibold flex items-center gap-1">
              <Check size={12} />
              Joined
            </div>
          )}
          <LeagueLockStatus league={league} />
        </div>
      </div>
      <div className="flex justify-between items-center">
        <div className="flex flex-col gap-2">
          <div className="flex flex-row items-center gap-3">
            <LeagueTeamsCount league={league} />
            <LeagueLiveIndicator league={league} getGamesByCompetitionId={getGamesByCompetitionId} />
          </div>

          {!isLocked && adjustedDeadline && (
            <JoinDeadlineCountdown joinDeadline={adjustedDeadline} />
          )}
        </div>

        <ChevronRight size={18} className="text-gray-400 dark:text-gray-500" />
      </div>
    </motion.div>
  );
}

type JoinDeadlineCountdownProps = {
  joinDeadline: Date;
};

function JoinDeadlineCountdown({ joinDeadline }: JoinDeadlineCountdownProps) {
  // Countdown should start two days before the join deadline
  const today = new Date();
  const deadline = new Date(joinDeadline);

  const oneDay = 1000 * 60 * 60 * 24 * 1;
  const diff = deadline.valueOf() - today.valueOf();
  const deadlinePassed = diff < 0;

  const showCountDown = !deadlinePassed && diff <= oneDay;

  const { hours, seconds, minutes } = useCountdown(showCountDown ? diff : 0);

  return (
    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
      <Calendar size={16} />
      <span>
        {showCountDown ? 'Starts in ' : 'Deadline '}
        {!showCountDown && <strong>{format(joinDeadline, 'EE dd MMM h:mm a')}</strong>}

        {showCountDown && (
          <strong>
            {`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`}
          </strong>
        )}
      </span>
    </div>
  );
}
