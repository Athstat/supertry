import { useEffect, useState } from "react"
import { IProAthlete } from "../../types/athletes";
import { useSupportedAthletes } from "../../hooks/athletes/useSupportedAthletes";
import { athleteNameSearchPredicate } from "../../utils/athleteUtils";
import PlayerProfileModal from "../../components/player/PlayerProfileModal";
import { LoadingState } from "../../components/ui/LoadingState";
import PlayerRowCard from "../../components/player/PlayerRowCard";

type Props = {
    searchQuery?: string
}

/** Renders a list of player search results for a given search query */
export default function PlayerSearchResults({ searchQuery }: Props) {

    const { athletes } = useSupportedAthletes();
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
                <p className="font-semibold text-md" >Results for '{searchQuery}' ({resultsLen})</p>
            </div>}

            {isLoading && (
                <div className="flex flex-1 items-center justify-center flex-col" >
                    <LoadingState />
                </div>
            )}

            {!isLoading && <div className="flex flex-col items-center gap-2" >
                {results.map((r) => {
                    return (
                        <PlayerRowCard
                            player={r}
                            onClick={() => handlePlayerClick(r)}
                            key={r.tracking_id}
                        />
                    )
                })}
            </div>}


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
