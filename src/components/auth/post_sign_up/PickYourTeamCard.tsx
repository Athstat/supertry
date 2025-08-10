import { motion } from "framer-motion"
import { Trophy, ChevronRight } from "lucide-react"
import { IFantasyLeagueRound } from "../../../types/fantasyLeague"
import { isLeagueLocked } from "../../../utils/leaguesUtils"
import { LeagueLiveIndicatorDot } from "../../fantasy-leagues/LeagueLiveIndicator"
import { useNavigate } from "react-router-dom"

type Props = {
    league?: IFantasyLeagueRound
}

/** Pick your team card on post sign up screen */
export default function PostSignUpPickYourTeamCard({ league }: Props) {

    if (!league) return;

    const navigate = useNavigate();
    const isLocked = isLeagueLocked(league.join_deadline);


    const handleChoosePlayers = () => {


        /** If deadline has already passed then no need to take to team creation screen take them
         * to the league's page
         */

        if (isLocked) {
            navigate(`/league/${league.official_league_id}`, {
                state: {
                    league: league,
                    from: "welcome"
                }
            });
        }

        // Navigate to team creation with the latest official league ID
        navigate(`/${league.official_league_id}/create-team`, {
            state: {
                league: league,
                from: "welcome",
            },
        });
    };

    return (
        <>
            {!isLocked && <motion.div
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
                            delay: 0.1,
                        },
                    },
                }}
                className={`bg-white dark:bg-dark-800/50 border border-slate-300 dark:border-slate-700 rounded-xl p-4 hover:shadow-md transition-shadow ${league ? "cursor-pointer" : "opacity-60 cursor-not-allowed"
                    }`}
                whileHover={
                    league
                        ? {
                            scale: 1.02,
                            transition: { type: "spring", stiffness: 300 },
                        }
                        : {}
                }
                onClick={league ? handleChoosePlayers : undefined}
            >
                <div className="flex justify-between items-center">
                    <div className="flex items-center">
                        <div className="p-2 bg-primary-100 dark:bg-primary-900/30 rounded-full mr-3">
                            <Trophy
                                size={20}
                                className="text-primary-600 dark:text-primary-400"
                            />
                        </div>

                        <div className="flex flex-col" >
                            <h3 className="font-semibold dark:text-white">
                                Pick Your Team
                            </h3>

                            <p className="dark:text-slate-400 text-sm text-slate-600 flex flex-row items-center justify-start gap-1" >
                                <LeagueLiveIndicatorDot league={league} />
                                {league.title}

                            </p>
                        </div>
                    </div>
                    <ChevronRight size={18} className="text-gray-400" />
                </div>
            </motion.div>}
        </>
    )
}
