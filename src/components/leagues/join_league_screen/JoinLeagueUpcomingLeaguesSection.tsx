import { useNavigate } from "react-router-dom";
import { IFantasyLeague } from "../../../types/fantasyLeague"
import { motion } from "framer-motion";
import { Trophy } from "lucide-react";
import { LeagueCard } from "../league_card_small/LeagueCard";
import { upcomingLeaguesFilter } from "../../../utils/leaguesUtils";
import NoContentCard from "../../shared/NoContentMessage";

type Props = {
    leagues: IFantasyLeague[],
    userTeams: Record<string, boolean>
}

export default function JoinLeagueUpcomingLeaguesSection({ leagues, userTeams }: Props) {
    const navigate = useNavigate();

    const handleLeagueClick = (league: IFantasyLeague) => {
        navigate(`/league/${league.official_league_id}`, {
            state: { league },
        });
    };

    const upcomingLeages = upcomingLeaguesFilter(leagues).splice(0, 3);

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


    return (
        <div className="rounded-xl shadow-sm">
            <h2 className="text-md font-semibold flex items-center gap-2 mb-6 dark:text-gray-100">
                Upcoming Leagues
            </h2>

            {upcomingLeages.length === 0 &&
                <NoContentCard message="There are no Upcoming Leagues" />
            }

            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="space-y-4"
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
    )

}
