import { format, parseISO } from "date-fns";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useFetch } from "../../../hooks/useFetch";
import { gamesService } from "../../../services/gamesService";
import { IFantasyLeague } from "../../../types/fantasyLeague";
import { IFixture } from "../../../types/games";
import { fixtureSumary } from "../../../utils/fixtureUtils";
import TeamLogo from "../../team/TeamLogo";
import { LoadingState } from "../../ui/LoadingState";

type FixturesSectionProps = {
  league: IFantasyLeague;
};

export default function LeagueCardFixturesSection({
  league,
}: FixturesSectionProps) {
  const navigate = useNavigate();
  const { data, isLoading } = useFetch(
    "fixtures",
    league.official_league_id,
    gamesService.getGamesByCompetitionId
  );
  const fixtures = data ?? [];

  if (isLoading) return <LoadingState />;

  // Filter fixtures by round and sort by date
  const filteredFixtures = fixtures
    .filter((f) => {
      const start = league.start_round ?? 0;
      const end = league.end_round ?? f.round;
      return f.round >= start && f.round <= end;
    })
    .filter(f => f.game_status !== "completed")
    .sort((a, b) =>
      a.kickoff_time && b.kickoff_time
        ? new Date(a.kickoff_time).valueOf() -
          new Date(b.kickoff_time).valueOf()
        : 0
    )
    .splice(0, 3); // Show up to 5 fixtures instead of 3

  // Group fixtures by day
  const fixturesByDay: Record<string, IFixture[]> = {};

  filteredFixtures.forEach((fixture) => {
    if (fixture.kickoff_time) {
      const dayKey = format(new Date(fixture.kickoff_time), "yyyy-MM-dd");
      if (!fixturesByDay[dayKey]) {
        fixturesByDay[dayKey] = [];
      }
      fixturesByDay[dayKey].push(fixture);
    }
  });

  // Get sorted day keys
  const sortedDays = Object.keys(fixturesByDay).sort();

  if (filteredFixtures.length === 0) return null;

  const handleShowMore = () => {
    navigate(`/league/${league.official_league_id}`, {
      state: { league, initialTab: "fixtures" },
    });
  };

  const handleClickfixture = (fixture: IFixture) => {
    navigate(`/fixtures/${fixture.game_id}`);
  };

  // Animation variants
  const fixtureVariants = {
    initial: { scale: 1 },
    hover: {
      scale: 1.02,
      boxShadow:
        "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
      transition: { type: "spring", stiffness: 400, damping: 10 },
    },
    tap: { scale: 0.98 },
  };

  return (
    <div className="grid gap-4 grid-cols-1">
      {sortedDays.map((dayKey) => (
        <div key={dayKey} className="mb-2">
          {/* Day header */}
          <div className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-2 px-1">
            {format(new Date(dayKey), "EEEE, MMMM d")}
          </div>

          {/* Fixtures for this day */}
          <div className="grid gap-3 grid-cols-1">
            {fixturesByDay[dayKey].map((fixture, index) => {
              const { game_status } = fixtureSumary(fixture);

              return (
                <motion.div
                  onClick={() => handleClickfixture(fixture)}
                  key={index}
                  variants={fixtureVariants}
                  initial="initial"
                  whileHover="hover"
                  whileTap="tap"
                  className="bg-slate-50 cursor-pointer border border-slate-200 dark:border-slate-800 dark:bg-slate-800/40 rounded-xl p-2 py-3 shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    {/* Home team */}
                    <div className="flex items-center space-x-2 flex-shrink-0 w-[40%]">
                      <TeamLogo
                        className="w-8 h-8 md:w-10 md:h-10 flex-shrink-0"
                        url={fixture.team_image_url}
                      />
                      <div className="flex flex-col min-w-0 overflow-hidden">
                        <p
                          className="text-xs md:text-sm font-medium truncate w-full"
                          title={fixture.team_name}
                        >
                          {fixture.team_name}
                        </p>
                        <p className="text-xs md:text-sm font-bold">
                          {fixture.team_score !== null
                            ? fixture.team_score
                            : "-"}
                        </p>
                      </div>
                    </div>

                    {/* Match time/status */}
                    <div className="flex flex-col items-center justify-center flex-shrink-0 w-[20%]">
                      <span className="text-xs text-center font-medium text-gray-600 dark:text-gray-400 whitespace-nowrap">
                        {game_status === "completed"
                          ? "Final"
                          : fixture.kickoff_time
                          ? format(new Date(fixture.kickoff_time), "h:mm a")
                          : ""}
                      </span>
                    </div>

                    {/* Away team */}
                    <div className="flex items-center space-x-2 justify-end flex-shrink-0 w-[40%]">
                      <div className="flex flex-col items-end min-w-0 overflow-hidden">
                        <p
                          className="text-xs md:text-sm font-medium truncate text-right w-full"
                          title={fixture.opposition_team_name}
                        >
                          {fixture.opposition_team_name}
                        </p>
                        <p className="text-xs md:text-sm font-bold">
                          {fixture.opposition_score !== null
                            ? fixture.opposition_score
                            : "-"}
                        </p>
                      </div>
                      <TeamLogo
                        className="w-8 h-8 md:w-10 md:h-10 flex-shrink-0"
                        url={fixture.opposition_image_url}
                      />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      ))}

      {fixtures.length > 3 && (
        <div className="text-primary-800 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 mt-2 w-full text-center items-center justify-center flex flex-col cursor-pointer transition-colors">
          <p onClick={handleShowMore}>Show More</p>
        </div>
      )}
    </div>
  );
}
