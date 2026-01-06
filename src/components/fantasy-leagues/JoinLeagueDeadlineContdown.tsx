import { ChevronRight } from 'lucide-react';
import { twMerge } from 'tailwind-merge';
import { useCountdown } from '../../hooks/useCountdown';
import { useRouter } from '../../hooks/useRoter';
import { IFantasyLeagueRound } from '../../types/fantasyLeague';
import { epochDiff } from '../../utils/dateUtils';
import { calculateJoinDeadline } from '../../utils/leaguesUtils';
import { useUserFantasyTeam } from '../fantasy_league/useFantasyLeague';

type Props = {
  league: IFantasyLeagueRound;
  onViewLeague: (league: IFantasyLeagueRound) => void;
};

export default function JoinLeagueDeadlineCountdown({ league, onViewLeague }: Props) {
  const deadline = calculateJoinDeadline(league);

  if (!deadline) return;

  const diff = epochDiff(deadline);

  const { days, hours, seconds, minutes } = useCountdown(diff);
  const { userTeam, isLoading, rankedUserTeam } = useUserFantasyTeam(league);
  const { navigateToMyTeam: navigateToMyTeam, navigateToLeagueScreen } = useRouter();

  const handleCallToAction = () => {
    if (userTeam) {
      navigateToMyTeam(userTeam, rankedUserTeam);
    } else {
      onViewLeague(league);
    }
  };

  const timeBlocks = [
    { value: days, label: 'Days' },
    { value: hours, label: 'Hours' },
    { value: minutes, label: 'Minutes' },
    { value: seconds, label: 'Seconds' },
  ];

  return (
    <div className="flex flex-col text-slate-700 dark:text-white bg-white border border-slate-200 dark:border-slate-800 dark:bg-slate-800/50 rounded-xl p-6 gap-4 sm:gap-6">
      <div
        onClick={() => navigateToLeagueScreen(league)}
        className="space-y-2 sm:space-y-4 cursor-pointer"
      >
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight">{league.title}</h1>
        <p className=" dark:text-primary-100  text-sm sm:text-base md:text-lg">
          Don't miss out on the action. {league.title} starts soon, make sure your team is in!
        </p>
      </div>

      <div className="grid grid-cols-4 sm:flex sm:flex-row gap-2 sm:gap-4 items-center justify-start">
        {timeBlocks.map(block => (
          <div
            key={block.label}
            className="p-2 sm:p-3 md:min-w-[80px] items-center justify-center flex flex-col rounded-xl bg-slate-50/50 dark:bg-white/10 border border-slate-200 dark:border-white/10"
          >
            <p className="font-bold text-lg sm:text-xl md:text-2xl">
              {block.value.toString().padStart(2, '0')}
            </p>
            <p className="text-[10px] sm:text-xs dark:text-primary-100">{block.label}</p>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={handleCallToAction}
          className={twMerge(
            'w-full sm:w-auto bg-primary-500 dark:bg-primary-600 dark:hover:bg-primary-700 text-primary-50 px-4 sm:px-6 md:px-8 py-2 sm:py-3 rounded-lg font-semibold hover:bg-opacity-90 transition-all flex items-center justify-center sm:justify-start gap-2 shadow-lg',
            isLoading && 'animate-pulse h-10 opacity-30'
          )}
        >
          {!isLoading && (
            <>
              <p>{userTeam ? 'View Your Team' : 'Pick Your Team'}</p>
              <ChevronRight size={20} />
            </>
          )}
        </button>
      </div>
    </div>
  );
}
