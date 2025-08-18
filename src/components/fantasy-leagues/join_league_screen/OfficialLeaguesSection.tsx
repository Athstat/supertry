import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import NoContentCard from '../../shared/NoContentMessage';
import { FantasyLeagueGroup } from '../../../types/fantasyLeagueGroups';
import { FantasyLeagueGroupCard } from '../league_card_small/FantasyLeagueGroupCard';

type Props = {
    leagues: FantasyLeagueGroup[];
};

/** Renders active leagues on the join league screen */
export default function OfficialLeaguesSection({
    leagues
}: Props) {

    const officialLeagues = leagues.filter((l) => {
        return l.type === 'official_league';
    })
    const navigate = useNavigate();

    // Container animation
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                when: 'beforeChildren',
                staggerChildren: 0.1,
            },
        },
    };

    const handleLeagueClick = (league: FantasyLeagueGroup) => {
        navigate(`/league/${league.id}`, {
            state: { league },
        });
    };


    if (officialLeagues.length === 0) return;

    return (
        <div className="mb-8 mt-8">
            <h2 className="text-lg font-semibold flex items-center gap-2 mb-4 text-gray-900 dark:text-gray-100">
                Official SCRUMMY Leagues
            </h2>

            {officialLeagues.length === 0 && (
                <NoContentCard className="my-6" message="There are no new leagues" />
            )}

            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="space-y-3"
            >
                {officialLeagues.map((league) => (
                    <FantasyLeagueGroupCard
                        leagueGroup={league}
                        key={league.id}
                        onClick={handleLeagueClick}
                    />
                ))}
            </motion.div>
        </div>
    );
}
