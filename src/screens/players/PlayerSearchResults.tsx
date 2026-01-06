import { useEffect, useState } from "react"
import { IProAthlete } from "../../types/athletes";
import { useSupportedAthletes } from "../../hooks/athletes/useSupportedAthletes";
import { athleteNameSearchPredicate } from "../../utils/athleteUtils";
import PlayerProfileModal from "../../components/player/PlayerProfileModal";
import { LoadingIndicator } from "../../components/ui/LoadingIndicator";
import SecondaryText from "../../components/ui/typography/SecondaryText";
import { PlayerListTable } from "../../components/players/PlayerListTable";

type Props = {
    searchQuery?: string,
    playerPool?: IProAthlete[]
}

/** Renders a list of player search results for a given search query */
export default function PlayerSearchResults({ searchQuery, playerPool }: Props) {

    const { athletes: allAthletes } = useSupportedAthletes();
    const athletes = playerPool || allAthletes;

    const [results, setResults] = useState<IProAthlete[]>([]);
    const [isLoading, setLoading] = useState<boolean>(false);

    const [selectedPlayer, setSelectedPlayer] = useState<IProAthlete>();
    const [showProfileModal, setShowProfileModal] = useState<boolean>(false);

    const toggle = () => setShowProfileModal(prev => !prev);

    const handlePlayerClick = (player: IProAthlete) => {
        setSelectedPlayer(player);
        setShowProfileModal(true);
    }   

    useEffect(() => {
        const fetcher = () => {
            setLoading(true);

            const filtered = athletes.filter((a) => {
                return athleteNameSearchPredicate(a.player_name, searchQuery ?? "");
            }).sort((a, b) => {
                return (b.power_rank_rating || 0) - (a.power_rank_rating || 0)
            });

            setResults(filtered);
            setLoading(false);
        }

        fetcher();
    }, [athletes, searchQuery]);

    const resultsLen = results.length;

    return (
        <div className="flex flex-col gap-4" >
            {!isLoading && <div>
                <p className="font-semibold text-md" >Results for '{searchQuery}' {resultsLen ? `(${resultsLen})` : ''}</p>
            </div>}

            {isLoading && (
                <div className="flex flex-1 items-center justify-center flex-col" >
                    <LoadingIndicator />
                </div>
            )}

            {!isLoading && (
                <PlayerListTable 
                    players={results}
                    onClick={handlePlayerClick}
                />
            )}

            {resultsLen === 0 && (
                <NoResultsFallback 
                    searchQuery={searchQuery}
                />
            )}


            {selectedPlayer && (
                <PlayerProfileModal 
                    onClose={toggle}
                    isOpen={showProfileModal}
                    player={selectedPlayer}
                />
            )}
        </div>
    )
}

type NoResultsProps = {
    searchQuery?: string
}

function NoResultsFallback({searchQuery} : NoResultsProps) {
    return (
        <div className="flex flex-col items-center justify-center gap-4 flex-1" >
            {/* <SearchX className="w-14 h-14 dark:text-slate-400" /> */}
            <SecondaryText>No matches for '{searchQuery}'</SecondaryText>
        </div>
    )
}