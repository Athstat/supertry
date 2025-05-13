import { Shield, Pencil, Trophy, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { IFantasyLeagueTeam } from "../../../types/fantasyLeague";

type MyTeamSectionProps = {
    team: IFantasyLeagueTeam,
    rank: number
}

/** Renders a my team card */
export default function LeagueCardMyTeamSection({ team, rank }: MyTeamSectionProps) {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(`/my-team/${team.team_id}`);
    }

    return (

        <div className="cursor-pointer">
            <p>My Team</p>
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

                <div className="grid grid-cols-2 lg:grid-cols-1 gap-4">

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
                        <p className="text-xl font-bold">{Math.floor(team.overall_score ?? 0)}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}