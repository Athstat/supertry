import { Trophy } from "lucide-react"
import { IFantasyLeague } from "../../../types/fantasyLeague"
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { LeagueCard } from "../league_card_small/LeagueCard";
import { pastLeaguesFilter } from "../../../utils/leaguesUtils";

type Props = {
    leagues: IFantasyLeague[],
    userTeams: Record<string, boolean>
}

export default function JoinLeaguePastLeaguesSection({ leagues, userTeams }: Props) {

    const navigate = useNavigate();
    const pastLeagues = pastLeaguesFilter(leagues);

    // Container animation
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                when: "beforeChildren",
                staggerChildren: 0.1,
            },
        },
    };

    const handleLeagueClick = (league: IFantasyLeague) => {
        navigate(`/league/${league.official_league_id}`, {
            state: { league },
        });
    };

    return (
        <div className="bg-white dark:bg-gray-800/40 rounded-xl shadow-sm my-6 p-4 sm:p-6">
            <h2 className="text-xl font-semibold flex items-center gap-2 mb-6 dark:text-gray-100">
                <Trophy size={24} className="text-primary-500" />
                Past Leagues
            </h2>

            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="space-y-4"
            >
                {pastLeagues.map((league, index) => (
                    <LeagueCard
                        key={league.id}
                        league={league}
                        onLeagueClick={handleLeagueClick}
                        custom={index}
                        isJoined={userTeams[league.id]}
                        hideIfNoTeamsJoined
                    />
                ))}
            </motion.div>
        </div>
    )
}
