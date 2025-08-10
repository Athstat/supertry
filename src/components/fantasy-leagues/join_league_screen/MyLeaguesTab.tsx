import useSWR from 'swr';
import { fantasyLeagueGroupsService } from '../../../services/fantasy/fantasyLeagueGroupsService';
import { Loader } from 'lucide-react';
import NoContentCard from '../../shared/NoContentMessage';
import UserCreatedLeaguesSection from '../UserCreatedLeaguesSection';
import { FantasyLeagueGroupCard } from '../league_card_small/FantasyLeagueGroupCard';
import { swrFetchKeys } from '../../../utils/swrKeys';
import { FantasyLeagueGroup } from '../../../types/fantasyLeagueGroups';
import { useNavigate } from 'react-router-dom';

export default function MyLeaguesTab() {

    return (
        <div className="space-y-6">

            <div className="mt-2">
                <UserCreatedLeaguesSection />
            </div>

            <JoinedLeaguesList />

        </div>
    )
}

type JoinedProps = {

}

function JoinedLeaguesList({ }: JoinedProps) {

    const key = swrFetchKeys.getJoinedFantasyLeagueGroups();
    const { data: joinedLeagues, isLoading: loadingJoined, error: joinedError } = useSWR(key, () =>
        fantasyLeagueGroupsService.getJoinedLeagues()
    );

    const navigate = useNavigate();

    const handleClickLeague = (league: FantasyLeagueGroup) => {
        navigate(`/league/${league.id}`);
    }

    return (
        <>
            {loadingJoined ? (
                <div className="flex justify-center items-center py-12">
                    <Loader className="w-8 h-8 text-primary-500 animate-spin" />
                    <span className="ml-3 text-gray-600 dark:text-gray-400">
                        Loading your leagues...
                    </span>
                </div>
            ) : joinedError ? (
                <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-6 rounded-lg text-center">
                    <p className="mb-4">{joinedError}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="px-4 py-2 bg-red-100 dark:bg-red-800/30 rounded-md hover:bg-red-200"
                    >
                        Try Again
                    </button>
                </div>
            ) : (
                <div className="mb-8">
                    <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">
                        Joined Leagues
                    </h2>
                    {joinedLeagues?.length === 0 ? (
                        <NoContentCard className="my-6" message="You haven't joined any leagues yet" />
                    ) : (
                        <div className="space-y-3">
                            {joinedLeagues?.map((league ) => (
                                <FantasyLeagueGroupCard 
                                    leagueGroup={league}
                                    key={league.id}
                                    onClick={() => handleClickLeague(league)}
                                />
                            ))}
                        </div>
                    )}
                </div>
            )}
        </>
    )
}