import { motion } from "framer-motion";
import { Trophy, ChevronRight } from "lucide-react";
import { IFantasyLeague } from "../../../types/fantasyLeague"
import { LeagueLiveIndicatorDot } from "../../leagues/LeagueLiveIndicator";
import { useNavigate } from "react-router-dom";
import { isLeagueLocked } from "../../../utils/leaguesUtils";

type Props = {
    league?: IFantasyLeague
}

export default function PostSignUpViewLeaderBoardCard({ league }: Props) {

    if (!league) return;
    const isLocked = isLeagueLocked(league.join_deadline);

    const navigate = useNavigate();

    const handleViewLeaderboard = () => {

        // Navigate to league screen with league info as state
        // Include "from" parameter to indicate we're coming from welcome screen
        navigate(`/league/${league.official_league_id}`, {
            state: {
                league: league,
                from: "welcome",
            },
        });
    };

    return (
        <>
            {<motion.div
                initial="hidden"
                animate="visible"
                variants={{
                    hidden: { opacity: 0, y: 10 },
                    visible: {
                        opacity: 1,
                        y: 0,
                        transition: {
                            type: "spring",
                            stiffness: 400,
                            damping: 25,
                            delay: 0.2,
                        },
                    },
                }}
                className={`bg-white dark:bg-dark-800/50 border border-gray-300 dark:border-slate-700 rounded-xl p-4 hover:shadow-md transition-shadow ${league ? "cursor-pointer" : "opacity-60 cursor-not-allowed"
                    }`}
                whileHover={
                    league
                        ? {
                            scale: 1.02,
                            transition: { type: "spring", stiffness: 300 },
                        }
                        : {}
                }
                onClick={league ? handleViewLeaderboard : undefined}
            >
                <div className="flex justify-between items-center">
                    <div className="flex items-center">
                        <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-full mr-3">
                            <Trophy
                                size={20}
                                className="text-indigo-600 dark:text-indigo-400"
                            />
                        </div>
                        <div className="flex flex-col" >
                            <h3 className="font-semibold dark:text-white">
                                View Leaderboard
                            </h3>

                            {isLocked && (
                                <div className="text-slate-600 dark:text-slate-400 flex flex-row items-center gap-1" >
                                    <LeagueLiveIndicatorDot league={league} />
                                    {league.title}
                                </div>
                            )}
                        </div>
                    </div>
                    <ChevronRight size={18} className="text-gray-400" />
                </div>
            </motion.div>}
        </>
    )
}
