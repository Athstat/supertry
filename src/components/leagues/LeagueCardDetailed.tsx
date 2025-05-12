import { Shield, Pencil, Trophy, Users, Star, ArrowRight } from "lucide-react"
import { useFetch } from "../../hooks/useAsync"
import { useAuthUser } from "../../hooks/useAuthUser"
import { IFantasyLeague, IFantasyLeagueTeam } from "../../types/fantasyLeague"
import { LoadingState } from "../ui/LoadingState"
import { useNavigate } from "react-router-dom"
import { leagueService } from "../../services/leagueService"
import { gamesService } from "../../services/gamesService"
import TeamLogo from "../team/TeamLogo"
import { fixtureSumary } from "../../utils/fixtureUtils"
import { format } from "date-fns"
import { IFixture } from "../../types/games"

type Props = {
    league: IFantasyLeague
}

export default function LeagueCardDetailed({ league }: Props) {
    const user = useAuthUser();
    const navigate = useNavigate();
    const { data, isLoading } = useFetch("user-teams", league.id, leagueService.fetchParticipatingTeams);

    if (isLoading) return <LoadingState />

    const leagueTeams = data ?? [];
    let teamForLeague: IFantasyLeagueTeam | undefined;
    let teamRank = 0;

    leagueTeams.forEach((t, index) => {
        if (t.kc_id === user.id) {
            teamForLeague = t;
            teamRank = index + 1;
        }
    });

    const handleLeagueClick = () => {
        navigate(`/league/${league.official_league_id}`, { state: { league } });
    };

    return (
        <div className="bg-white dark:text-white dark:bg-slate-800/50 rounded-2xl shadow-sm transition-all hover:shadow-md">
            {/* Header Section */}

            <div className="p-6 border-gray-100 dark:border-gray-700/50">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="space-y-2">
                        <h1 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">{league.title}</h1>
                        <div className="flex flex-wrap items-center gap-4 text-gray-600 dark:text-gray-300">
                            <div className="flex items-center gap-2">
                                <Users className="w-4 h-4" />
                                <span>{leagueTeams.length} Teams</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-3 self-stretch md:self-auto">
                        <button
                            onClick={handleLeagueClick}
                            className="flex-1 md:flex-none px-6 py-2.5 text-md lg:text-base rounded-xl bg-primary-700 hover:bg-primary-800 text-white font-bold transition-colors flex flex-row items-center justify-center gap-2"
                        >
                            {teamForLeague ? "View League" : "Join League"}
                            <ArrowRight />
                        </button>
                    </div>
                </div>
            </div>

            <div className="px-6 pb-6">

                <div className="grid grid-cols-1 gap-3">
                    {/* My Team Section */}
                    {teamForLeague && (
                        <MyTeamSection rank={teamRank} team={teamForLeague} />
                    )}

                    {/* Fixtures Section */}
                    {/* <div >
                        <div className="">
                            <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Fixtures</h2>
                            <FixturesSection league={league} />
                        </div>
                    </div> */}
                </div>
            </div>
        </div>
    )
}

type MyTeamSectionProps = {
    team: IFantasyLeagueTeam,
    rank: number
}

function MyTeamSection({ team, rank }: MyTeamSectionProps) {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(`/my-team/${team.team_id}`);
    }

    return (

        <div className="cursor-pointer">

            <div className="bg-slate-50 border border-slate-200 dark:border-slate-800 dark:bg-slate-800/40 hover:dark:bg-slate-800/60 rounded-xl p-4 space-y-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Shield className="w-6 h-6 text-blue-500" />
                        <h3 className="font-semibold text-md trucate lg:text-lg">{team.name}</h3>
                    </div>
                    <button onClick={handleClick} className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
                        <Pencil className="w-5 h-5" />
                    </button>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    
                    <div className=" dark:bg-slate-800 p-3 rounded-lg">
                        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mb-1">
                            <Trophy className="w-4 h-4" />
                            <span className="text-sm">Rank</span>
                        </div>
                        <p className="text-xl font-bold">#{rank}</p>
                    </div>
                    
                    <div className="dark:bg-slate-800 p-3 rounded-lg">
                        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mb-1">
                            <Star className="w-4 h-4" />
                            <span className="text-sm">Points</span>
                        </div>
                        <p className="text-xl font-bold">{team.overall_score || 0}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

type FixturesSectionProps = {
    league: IFantasyLeague
}

function FixturesSection({ league }: FixturesSectionProps) {
    
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
        navigate(`/league/${league.id}`);
    }

    const handleClickfixture = (fixture: IFixture) => {
        navigate(`/fixtures/${fixture.game_id}`);
    }

    return (
        <div className="grid gap-4 grid-cols-1">
            {shortList.map((fixture, index) => {
                const { game_status } = fixtureSumary(fixture);

                return (
                    <div onClick={() => handleClickfixture(fixture)} key={index} className="bg-slate-50 border border-slate-200 dark:border-slate-800 dark:bg-slate-800/40 hover:dark:bg-slate-800/60 rounded-xl p-4 hover:shadow-md transition-all">
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
