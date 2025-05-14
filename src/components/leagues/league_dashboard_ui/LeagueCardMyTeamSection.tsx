import { Shield, Pencil, Trophy, Star, Users, Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { IFantasyLeague, IFantasyLeagueTeam } from "../../../types/fantasyLeague";
import { isLeagueLocked } from "../../../utils/leaguesUtils";

type MyTeamSectionProps = {
    team: IFantasyLeagueTeam,
    rank: number,
    league: IFantasyLeague
}

/** Renders a my team card */
export default function LeagueCardMyTeamSection({ team, rank, league }: MyTeamSectionProps) {
    const navigate = useNavigate();
    const isLocked = isLeagueLocked(league.join_deadline);

    const handleClick = () => {
        navigate(`/my-team/${team.team_id}`);
    }

    // const totalTeamValue = team.athletes.reduce((prev, a) => {
    //     return prev += a.purchase_price;
    // }, 0);

    return (

        <div onClick={handleClick}  className="cursor-pointer w-full flex flex-col gap-3 dark:text-white ">
            <p className="text-xl font-bold" >My Team</p>

            <div className="bg-slate-50 border border-slate-200 dark:border-slate-800 dark:bg-slate-800/40 hover:dark:bg-slate-800/60 rounded-xl flex-1 p-4 space-y-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Shield className="w-6 h-6 text-blue-500" />
                        <h3 className="font-semibold text-md trucate lg:text-lg">{team.team_name}</h3>
                    </div>

                    {!isLocked && <button className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
                        <Pencil className="w-5 h-5" />
                    </button>}

                    {isLocked && <button className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
                        <Lock className="w-5 h-5" />
                    </button>}
                </div>

                <div className="text-slate-700 flex flex-row items-center dark:text-slate-400" >
                    <div className="flex flex-row items-center gap-1" >
                        <Users className="w-4 h-4" />
                        <p>Players {team.athletes.length}</p>
                    </div>
                    {/* 
                    <div className="flex flex-row items-center gap-1" >
                        <CircleDollarSign className="w-4 h-4" />
                        <p>Team Value {totalTeamValue}</p>
                    </div> */}
                </div>

                <div className="grid grid-cols-2 flex-1 lg:grid-cols-1 gap-4">

                    <div className=" dark:bg-slate-800 bg-slate-100 p-3 rounded-lg">
                        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mb-1">
                            <Trophy className="w-4 h-4" />
                            <span className="text-sm">Rank</span>
                        </div>
                        <p className="text-xl font-bold">#{rank}</p>
                    </div>

                    <div className="dark:bg-slate-800 bg-slate-100 p-3 rounded-lg">
                        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mb-1">
                            <Star className="w-4 h-4" />
                            <span className="text-sm">Points</span>
                        </div>
                        <p className="text-xl font-bold">{Math.floor(team.score ?? 0)}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}