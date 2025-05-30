import { ChevronRight, Trophy } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { IFantasyLeague } from "../../types/fantasyLeague";
import {
  calculateJoinDeadline,
  leaguesOnClockFilter,
} from "../../utils/leaguesUtils";
import { useCountdown } from "../../hooks/useCountdown";
import { epochDiff } from "../../utils/dateUtils";
import { useUserFantasyTeam } from "../league/useFantasyLeague";
import { twMerge } from "tailwind-merge";
import { useRouter } from "../../hooks/useRoter";
import Experimental from "../shared/ab_testing/Experimental";

type Props = {
  availableLeagues: IFantasyLeague[];
  onViewLeague: (league: IFantasyLeague) => void;
};

export function HeroSection({ availableLeagues, onViewLeague }: Props) {
  const navigate = useNavigate();
  const { firstLeagueOnClock: leagueOnTheClock } =
    leaguesOnClockFilter(availableLeagues);

  return (
    <div className="bg-gradient-to-br from-primary-700 to-primary-900 via-primary-800  hover:from-primary-600 hover:to-primary-800 rounded-2xl p-4 mb-6 text-white  transition-all ease-in delay-300">
      {!leagueOnTheClock && (
        <div className="space-y-4 p-3">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold">
            Weekly Rugby Fantasy Leagues
          </h1>
          <p className="text-sm sm:text-base md:text-lg opacity-90">
            Create your dream team and compete in weekly leagues
          </p>
          <button
            onClick={() => navigate("/leagues")}
            className="bg-white text-primary-600 px-4 sm:px-6 md:px-8 py-2 sm:py-3 rounded-lg font-semibold hover:bg-opacity-90 transition-all flex items-center gap-2"
          >
            Join Weekly League <ChevronRight size={20} />
          </button>
        </div>
      )}
      {leagueOnTheClock && (
        <JoinDeadlineCountdown
          onViewLeague={onViewLeague}
          league={leagueOnTheClock}
        />
      )}
    </div>
  );
}

type JoinDeadlineCountdownProps = {
  league: IFantasyLeague;
  onViewLeague: (league: IFantasyLeague) => void;
};

function JoinDeadlineCountdown({
  league,
  onViewLeague,
}: JoinDeadlineCountdownProps) {
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

  const handleClickCard = () => {
    navigateToLeagueScreen(league);
  }

  const timeBlocks = [
    { value: days, label: "Days" },
    { value: hours, label: "Hours" },
    { value: minutes, label: "Minutes" },
    { value: seconds, label: "Seconds" },
  ];

  return (
    <div className="flex flex-col p-4 gap-4 sm:gap-6">
      <div onClick={handleClickCard} className="space-y-2 sm:space-y-4 cursor-pointer">
        
        <h1 className="text-xl flex flex-row items-center gap-1 sm:text-2xl md:text-3xl font-bold tracking-tight">
          <Trophy />
          {league.title}
        </h1>

        {/* <p className="text-primary-100 text-sm sm:text-base md:text-lg">
          Don't miss out on the action. {league.title} starts soon, make sure
          your team is in!
        </p> */}

        <p className="text-primary-100 text-sm sm:text-base md:text-lg" >
          Don't miss out on the action. {league.title} starts in <strong>{hours}:{minutes}:{seconds}</strong>
        </p>


      </div>

      {/* <div className="grid grid-cols-4 sm:flex sm:flex-row gap-2 sm:gap-4 items-center justify-start">
        {timeBlocks.map((block) => (
          <div
            key={block.label}
            className="p-2 sm:p-3 md:min-w-[80px] items-center justify-center flex flex-col rounded-xl bg-white/10 backdrop-blur-sm border border-white/10 shadow-xl"
          >
            <p className="font-bold text-lg sm:text-xl md:text-2xl">
              {block.value.toString().padStart(2, "0")}
            </p>
            <p className="text-[10px] sm:text-xs text-primary-100">
              {block.label}
            </p>
          </div>
        ))}
      </div> */}

      <div className="flex items-center gap-4">
        <button
          onClick={handleCallToAction}
          className={twMerge(
            "w-full sm:w-auto bg-gradient-to-r from-white to-gray-200 via-gray-50 text-primary-800 px-4 sm:px-6 md:px-8 py-2 sm:py-3 rounded-lg font-semibold hover:bg-opacity-90 transition-all flex items-center justify-center sm:justify-start gap-2 shadow-lg",
            isLoading && "animate-pulse h-10 opacity-30"
          )}
        >
          {!isLoading && (
            <>
              <p>{userTeam ? "View Your Team" : "Pick Your Team"}</p>
              <ChevronRight size={20} />
            </>
          )}
        </button>
      </div>
    </div>
  );
}
