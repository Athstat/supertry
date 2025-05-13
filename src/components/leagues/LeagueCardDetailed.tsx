import { Shield, Pencil, Trophy, Users, Star, ArrowRight, ChevronRight } from "lucide-react"
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
import PrimaryButton from "../shared/buttons/PrimaryButton"
import { analytics } from "../../services/anayticsService"
import { NoMyTeamPlaceholder } from "./league_dashboard_ui/NoMyTeamPlaceholder"
import MyTeamSection from "./league_dashboard_ui/MyTeamSection"
import FixturesSection from "./league_dashboard_ui/FxituresSection"

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
        <div className="bg-white dark:text-white dark:bg-slate-800/30 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm transition-all hover:shadow-md">
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
                </div>
            </div>

            <div className="px-6 pb-6">

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 lg:gap-5">
                    {/* My Team Section */}
                    {teamForLeague && (
                        <MyTeamSection rank={teamRank} team={teamForLeague} />
                    )}

                    {!teamForLeague && (
                        <NoMyTeamPlaceholder league={league} />
                    )}

                    {/* Fixtures Section */}
                    <div >
                        <div className="">
                            <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Fixtures</h2>
                            <FixturesSection league={league} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}