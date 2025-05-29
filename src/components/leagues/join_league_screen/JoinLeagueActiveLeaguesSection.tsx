import { motion } from 'framer-motion'
import { Trophy } from 'lucide-react'
import { activeLeaguesFilter } from '../../../utils/leaguesUtils'
import { LeagueCard } from '../league_card_small/LeagueCard'
import { IFantasyLeague } from '../../../types/fantasyLeague'
import { useNavigate } from 'react-router-dom'

type Props = {
    leagues: IFantasyLeague[],
    userTeams: Record<string, boolean>
}

/** Renders active leagues on the join league screen */
export default function JoinLeagueActiveLeaguesSection({ leagues, userTeams }: Props) {

    const activeLeagues = activeLeaguesFilter(leagues);
    const navigate = useNavigate();

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

    if (activeLeagues.length === 0) {
        return;
    }


    return (
        <div className="bg-white dark:bg-gray-800/40 rounded-xl shadow-sm my-6 p-4 sm:p-6">
            <h2 className="text-xl font-semibold flex items-center gap-2 mb-6 dark:text-gray-100">
                <Trophy size={24} className="text-primary-500" />
                Active Leagues
            </h2>

            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="space-y-4"
            >
                {activeLeagues.map((league, index) => (
                    <LeagueCard
                        key={league.id}
                        league={league}
                        onLeagueClick={handleLeagueClick}
                        custom={index}
                        isJoined={userTeams[league.id]}
                    />
                ))}
            </motion.div>
        </div>
    )
}