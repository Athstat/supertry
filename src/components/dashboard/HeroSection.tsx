import { ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { IFantasyLeague } from "../../types/fantasyLeague";
import { activeLeaguesFilter, isLeagueOnTheClock } from "../../utils/leaguesUtils";
import { useCountdown } from "../../hooks/useCountdown";

type Props = {
  availableLeagues: IFantasyLeague[],
  onViewLeague: (league: IFantasyLeague) => void
}

export function HeroSection({ availableLeagues, onViewLeague }: Props) {

  const navigate = useNavigate();
  const activeLeagues = activeLeaguesFilter(availableLeagues);
  
  let leagueOnTheClock: IFantasyLeague | undefined;
  const twoDays = 1000 * 60 * 60 * 24 * 2;

  const leaguesOnTheClock = activeLeagues.filter((l) => {
    return (isLeagueOnTheClock(l, twoDays));
  });


  console.log(leaguesOnTheClock);

  if (leaguesOnTheClock.length > 0) {
    leagueOnTheClock = leaguesOnTheClock[0];
  }


  return (
    <div className="bg-gradient-to-br from-primary-700 to-primary-900 via-primary-800 rounded-2xl p-4 sm:p-6 md:p-8 mb-8 text-white">
      {!leagueOnTheClock &&
        <div className="space-y-4">
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
      }
      {leagueOnTheClock && <JoinDeadlineCountdown onViewLeague={onViewLeague} league={leagueOnTheClock} />}
    </div>
  );
};

type JoinDeadlineCountdownProps = {
  league: IFantasyLeague,
  onViewLeague: (league: IFantasyLeague) => void
}

function JoinDeadlineCountdown({ league, onViewLeague }: JoinDeadlineCountdownProps) {
  const today = new Date();
  const deadline = new Date(league.join_deadline!);
  const diff = deadline.valueOf() - today.valueOf()

  const { days, hours, seconds, minutes } = useCountdown(diff);

  const timeBlocks = [
    { value: days, label: "Days" },
    { value: hours, label: "Hours" },
    { value: minutes, label: "Minutes" },
    { value: seconds, label: "Seconds" }
  ];

  return (
    <div className="flex flex-col gap-4 sm:gap-6">
      <div className="space-y-2 sm:space-y-4">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight">
          {league.title}
        </h1>
        <p className="text-primary-100 text-sm sm:text-base md:text-lg">
          Don't miss out on the action. {league.title} starts soon, make sure your team is in!
        </p>
      </div>

      <div className="grid grid-cols-4 sm:flex sm:flex-row gap-2 sm:gap-4 items-center justify-start">
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
      </div>

      <div className="flex items-center gap-4">
        <button 
          onClick={() => onViewLeague(league)}
          className="w-full sm:w-auto bg-white text-primary-600 px-4 sm:px-6 md:px-8 py-2 sm:py-3 rounded-lg font-semibold hover:bg-opacity-90 transition-all flex items-center justify-center sm:justify-start gap-2 shadow-lg"
        >
          Pick Your Team <ChevronRight size={20} />
        </button>
      </div>
    </div>
  )
}
