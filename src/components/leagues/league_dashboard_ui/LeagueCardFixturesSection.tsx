import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import { useFetch } from "../../../hooks/useFetch";
import { gamesService } from "../../../services/gamesService";
import { IFantasyLeague } from "../../../types/fantasyLeague";
import { IFixture } from "../../../types/games";
import { fixtureSumary } from "../../../utils/fixtureUtils";
import TeamLogo from "../../team/TeamLogo";
import { LoadingState } from "../../ui/LoadingState";

type FixturesSectionProps = {
    league: IFantasyLeague
}

export default function LeagueCardFixturesSection({ league }: FixturesSectionProps) {

    const navigate = useNavigate();
    const { data, isLoading } = useFetch("fixtures", league.official_league_id, gamesService.getGamesByCompetitionId);
    const fixtures = data ?? [];

    if (isLoading) return <LoadingState />

    const shortList = fixtures
        .filter((f) => {
            const start = league.start_round ?? 0;
            const end = league.end_round ?? f.round;
            return f.round >= start && f.round <= end;
        })
        .splice(0, 3);

    if (shortList.length === 0) return null;


    const handleShowMore = () => {
        navigate(`/league/${league.official_league_id}`, { 
            state: { league, initialTab: "fixtures" } 
        });
    }

    const handleClickfixture = (fixture: IFixture) => {
        navigate(`/fixtures/${fixture.game_id}`);
    }

    return (
        <div className="grid gap-4 grid-cols-1">
            {shortList.map((fixture, index) => {
                const { game_status } = fixtureSumary(fixture);

                return (
                    <div onClick={() => handleClickfixture(fixture)} key={index} className="bg-slate-50 cursor-pointer border border-slate-200 dark:border-slate-800 dark:bg-slate-800/40 hover:dark:bg-slate-800/60 rounded-xl p-4 hover:shadow-md transition-all">
                        <div className="flex flex-col gap-4">

                            <div className="flex items-center justify-between gap-4">
                                <div className="flex items-center gap-4 flex-1">
                                    <TeamLogo className="w-12 h-12" url={fixture.team_image_url} />
                                    <div className="min-w-0">
                                        <p className="">{fixture.team_score}</p>
                                    </div>
                                </div>

                                <div className="flex flex-col items-center justify-center px-4">
                                    <span className="text font-medium text-gray-600 dark:text-gray-400">
                                        {game_status === "completed" ? "Final" :
                                            fixture.kickoff_time ? format(fixture.kickoff_time, "HH:mm a") : ""}
                                    </span>
                                </div>

                                <div className="flex items-center gap-4 flex-1 justify-end">
                                    <div className="min-w-0 text-right">
                                        <p className="">{fixture.opposition_score}</p>
                                    </div>

                                    <TeamLogo className="w-12 h-12" url={fixture.opposition_image_url} />
                                </div>
                            </div>
                        </div>
                    </div>
                )
            })}

            {fixtures.length > 3 &&
                <div onClick={handleShowMore} className="text-blue-500 dark:hover:text-blue-400 mt-2 w-ful text-center items-center justify-center flex flex-col cursor-pointer" >
                    <p>Show More</p>
                </div>
            }
        </div >
    )
}
