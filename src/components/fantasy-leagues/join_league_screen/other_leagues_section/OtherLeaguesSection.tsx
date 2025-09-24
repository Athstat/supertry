import { Plus, Trophy } from "lucide-react"
import { FantasyLeagueGroup } from "../../../../types/fantasyLeagueGroups"
import { FantasyLeagueGroupHorizontalCard } from "../../league_card_small/FantasyLeagueGroupHorizontalCard"
import PrimaryButton from "../../../shared/buttons/PrimaryButton"
import { useState } from "react"
import CreateLeagueModal from "../../CreateLeagueModal"
import { useNavigate } from "react-router-dom"
import NoContentCard from "../../../shared/NoContentMessage"

type Props = {
    joinedLeagues: FantasyLeagueGroup[]
}

export default function OtherLeaguesSection({ joinedLeagues }: Props) {

    const navigate = useNavigate();
    const [showCreateModal, setShowCreateModal] = useState(false);
    const toggle = () => setShowCreateModal(prev => !prev);

    const handleCreateLeague = (league: FantasyLeagueGroup) => {
        navigate(`/league/${league.id}`);
    }

    const handleClickLeagueCard = (league: FantasyLeagueGroup) => {
        navigate(`/league/${league.id}`);
    }

    return (
        <div className="flex flex-col gap-4" >
            <div className="flex flex-row items-center justify-between" >

                <div className="flex flex-row items-center gap-2" >
                    <Trophy className="" />
                    <p className="text-lg font-semibold" >Joined Leagues</p>
                    {/* <GamePlayHelpButton className="" iconHw="w-4 h-4" /> */}
                </div>

                <div className="flex flex-row items-center gap-1" >
                    <PrimaryButton onClick={toggle} className="w-fit text-sm bg-primary-500 dark:bg-primary-600" >
                        <p>Create/Join</p> 
                        <Plus className="w-4 h-4" />
                    </PrimaryButton>
                </div>
            </div>

            <div className="flex flex-col gap-2" >
                {joinedLeagues.map((l) => {
                    return (
                        <FantasyLeagueGroupHorizontalCard
                            leagueGroup={l}
                            key={l.id}
                            onClick={handleClickLeagueCard}
                        />
                    )
                })}
            </div>

            {joinedLeagues.length === 0 && (
                <NoContentCard 
                    message="You haven't joined any leagues yet 👀!"
                />
            )}

            {showCreateModal && (
                <CreateLeagueModal 
                    isOpen={showCreateModal}
                    onLeagueCreated={handleCreateLeague}
                    onClose={toggle}
                />
            )}
        </div>
    )
}
