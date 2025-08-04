import { useNavigate } from 'react-router-dom';
import { IFantasyLeague } from '../../../types/fantasyLeague';
import { motion } from 'framer-motion';
import { LeagueCard } from '../league_card_small/LeagueCard';
import { upcomingLeaguesFilter } from '../../../utils/leaguesUtils';
import NoContentCard from '../../shared/NoContentMessage';

type Props = {
  leagues: IFantasyLeague[];
  userTeams: Record<string, boolean>;
};

export default function JoinLeagueUpcomingLeaguesSection({ leagues, userTeams }: Props) {
  const navigate = useNavigate();

  const handleLeagueClick = (league: IFantasyLeague) => {
    navigate(`/league/${league.id}`, {
      state: { league },
    });
  };

  const upcomingLeages = upcomingLeaguesFilter(leagues).splice(0, 3);

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

  return (
    <div className="mb-8">
      <h2 className="text-lg font-semibold flex items-center gap-2 mb-4 text-gray-900 dark:text-gray-100">
        Upcoming Leagues
      </h2>

      {upcomingLeages.length === 0 && <NoContentCard message="There are no Upcoming Leagues" />}

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-3"
      >
        {upcomingLeages.map((league, index) => (
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
  );
}
