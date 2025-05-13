import { ReactNode } from "react";
import { ChevronLeft, Lock } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { IFantasyLeague } from "../../types/fantasyLeague";
import { isLeagueLocked } from "../../utils/leaguesUtils";
import { LeagueInfo } from "../../types/league";
import LeagueLiveIndicator, { LeagueLiveIndicatorSolid } from "../leagues/LeagueLiveIndicator";


interface LeagueHeaderProps {
  leagueInfo: LeagueInfo;
  onOpenSettings: () => void;
  isLoading?: boolean;
  league?: IFantasyLeague;
  children?: ReactNode;
}

export function LeagueHeader({
  leagueInfo,
  isLoading = false,
  children,
  league
}: LeagueHeaderProps) {
  const navigate = useNavigate();
  const location = useLocation();

  // Check if coming from welcome screen
  const isFromWelcome = location.state?.from === "welcome";
  const isLocked = isLeagueLocked(league?.join_deadline);

  console.log("leagueInfo", leagueInfo);


  const handleBackClick = () => {
    if (isFromWelcome) {
      navigate("/welcome");
    } else {
      navigate(-1);
    }
  };

  return (
    <div className="bg-gradient-to-br from-primary-700 to-primary-800 dark:to-primary-950 text-white">
      <div className="container mx-auto px-4 py-6 max-w-3xl">
        <div className="flex items-center justify-between mb-4">
          <div>
            <button
              onClick={handleBackClick}
              className="flex items-center text-primary-100 hover:text-white mb-2 transition-colors"
              aria-label={isFromWelcome ? "Back to welcome" : "Go Back"}
            >
              <ChevronLeft size={20} />
              <span>
                {isFromWelcome ? "Back to welcome screen" : "Go Back"}
              </span>
            </button>
            <h1 className="text-2xl flex flex-row items-center gap-2 md:text-3xl font-bold">
              {isLocked && <Lock className="" />}
              {leagueInfo.name}
            </h1>

            {league &&
              <LeagueLiveIndicatorSolid
                league={league}
                className="mt-2"
              />
            }

          </div>
          {children}
        </div>


        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white/10 rounded-lg p-4">
            <div className="text-sm text-primary-100">Total Teams</div>
            <div className="text-xl font-bold">
              {isLoading ? "..." : leagueInfo.totalTeams}
            </div>
          </div>

          <div className="bg-white/10 rounded-lg p-4">
            <div className="text-sm text-primary-100">Your Rank</div>
            <div className="text-xl font-bold">
              {isLoading
                ? "..."
                : leagueInfo.userRank
                  ? `#${leagueInfo.userRank}`
                  : "N/A"}
            </div>
          </div>

          {/* <div className="bg-white/10 rounded-lg p-4">
            <div className="text-sm text-primary-100">Join Deadline</div>
            <div className="text-md font-bold flex mt-1 flex-col ">
              <p>{league.join_deadline ? format(league.join_deadline, "EEEE dd MMMM yyyy") : "-"}</p>
              <p>{league.join_deadline ? format(league.join_deadline, "h:mm a") : "-"}</p>
            </div>
          </div> */}
        </div>
      </div>
    </div>
  );
}
