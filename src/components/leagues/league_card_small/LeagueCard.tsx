import { ChevronRight, Calendar, Check, Users } from 'lucide-react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { useCountdown } from '../../../hooks/useCountdown';
import { calculateJoinDeadline, isLeagueLocked } from '../../../utils/leaguesUtils';
import { IFantasyLeague } from '../../../types/fantasyLeague';

type Props = {
  league: IFantasyLeague;
  onLeagueClick: (league: IFantasyLeague) => void;
  custom?: number;
  isJoined?: boolean;
  hideIfNoTeamsJoined?: boolean;
  getGamesByCompetitionId: (competitionId: string) => any[];
};

// Simple Badge component
const Badge = ({ variant, children }: { variant: string; children: React.ReactNode }) => {
  const getVariantClasses = () => {
    switch (variant) {
      case 'success':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'destructive':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      case 'secondary':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
      case 'invite':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  return (
    <span className={`px-2 py-1 text-xs rounded-full font-medium ${getVariantClasses()}`}>
      {children}
    </span>
  );
};

export function LeagueCard({ league, onLeagueClick, custom = 0, isJoined = false }: Props) {
  const isLocked = isLeagueLocked(league.join_deadline);
  const adjustedDeadline = calculateJoinDeadline(league);

  const getStatusBadge = () => {
    const isPrivate = (league as any)?.is_private === true || (league as any)?.is_public === false;
    if (isPrivate) {
      return <Badge variant="invite">Invite Only</Badge>;
    }
    if (league.has_ended) {
      return <Badge variant="secondary">Ended</Badge>;
    } else if (league.is_open) {
      return <Badge variant="success">Public</Badge>;
    } else {
      return <Badge variant="destructive">Locked</Badge>;
    }
  };

  const formatCreatedDate = (dateString: string | Date) => {
    const date = new Date(dateString);
    return format(date, 'MMM d, yyyy');
  };

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
      className="bg-white dark:bg-gray-800 rounded-2xl p-3 shadow-md hover:shadow-lg cursor-pointer transition-all duration-200 space-y-2"
      whileHover={{
        scale: 1.02,
        transition: { type: 'spring', stiffness: 300 },
      }}
    >
      {/* Header Row */}
      <div className="flex justify-between items-start">
        <div className="flex-1 min-w-0">
          <h3 className="text-base font-semibold text-gray-900 dark:text-white truncate">
            {league.title}
          </h3>
          {league.season_name && (
            <p className="text-xs uppercase text-gray-500 dark:text-gray-400 tracking-wide font-medium truncate">
              {league.season_name}
            </p>
          )}
        </div>
        <div className="flex items-center gap-2 ml-2">
          {isJoined && (
            <div className="px-2 py-0.5 text-xs rounded-full bg-blue-600 dark:bg-blue-500 text-white font-semibold flex items-center gap-1">
              <Check size={10} />
              Joined
            </div>
          )}
          {getStatusBadge()}
        </div>
      </div>

      {/* Description - Single line with truncation */}
      {league.disclaimer && (
        <p className="text-sm italic text-gray-600 dark:text-gray-300 truncate">
          {league.disclaimer}
        </p>
      )}

      {/* Metadata Row - Compressed single line */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
          <div className="flex items-center gap-1">
            <Users size={12} />
            <span>{league.participants_count} Teams</span>
          </div>
          <span className="text-gray-400">|</span>
          <div className="flex items-center gap-1">
            <Calendar size={12} />
            <span>Created {formatCreatedDate(league.created_date)}</span>
          </div>
        </div>

        <ChevronRight size={16} className="text-gray-400 dark:text-gray-500" />
      </div>

      {/* Join Deadline Countdown */}
      {!isLocked && adjustedDeadline && (
        <div className="pt-2 border-t border-gray-100 dark:border-gray-700">
          <JoinDeadlineCountdown joinDeadline={adjustedDeadline} />
        </div>
      )}
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
