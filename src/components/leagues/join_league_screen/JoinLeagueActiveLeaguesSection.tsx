import { motion } from 'framer-motion'
import { Trophy } from 'lucide-react'
import { activeLeaguesFilter } from '../../../utils/leaguesUtils'
import { LeagueCard } from '../league_card_small/LeagueCard'
import { IFantasyLeague } from '../../../types/fantasyLeague'
import { useNavigate } from 'react-router-dom'
import NoContentCard from '../../shared/NoContentMessage'

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


    return (
        <div className="rounded-xl shadow-sm">
            <h2 className="text-md font-semibold flex items-center gap-2 dark:text-gray-100">
                Active Leagues
            </h2>

            {activeLeagues.length === 0 &&
                <NoContentCard className='my-6' message='There are no Active Leagues' />
            }

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