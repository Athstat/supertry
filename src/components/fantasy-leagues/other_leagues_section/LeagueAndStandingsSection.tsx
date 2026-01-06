import { Trophy } from "lucide-react"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import SuggestedLeaguesSections from "./SuggestedLeaguesSection"
import { useUserJoinedLeagues } from "../../../hooks/leagues/useUserJoinedLeagues"
import { IFantasySeason } from "../../../types/fantasy/fantasySeason"
import { FantasyLeagueGroup } from "../../../types/fantasyLeagueGroups"
import PrimaryButton from "../../ui/buttons/PrimaryButton"
import NoContentCard from "../../ui/typography/NoContentMessage"
import SecondaryText from "../../ui/typography/SecondaryText"
import CreateLeagueModal from "../create_league_modal/CreateLeagueModal"
import LeagueGroupsTable from "../LeagueGroupsTable"
import RoundedCard from "../../ui/cards/RoundedCard"

type Props = {
    fantasySeason: IFantasySeason
}


/** Renders users league groups section */
export default function LeagueAndStandingsSection({ fantasySeason }: Props) {

    const navigate = useNavigate();
    const { leagues, isLoading } = useUserJoinedLeagues(fantasySeason.id);

    const [showCreateModal, setShowCreateModal] = useState(false);
    const [initTab, setInitTab] = useState<"join" | "create">("create");
    const toggle = () => setShowCreateModal(prev => !prev);

    const openCreateModal = () => {
        setInitTab("create");
        toggle();
    }

    const openJoinModal = () => {
        setInitTab("join");
        toggle();
    }

    const handleCreateLeague = (league: FantasyLeagueGroup) => {
        navigate(`/league/${league.id}`);
    }

    if (isLoading) {
        return (
            <RoundedCard
                className="w-full border-none h-[280px] animate-pulse"
            />
        )
    }

    return (
        <div className="flex flex-col gap-4 dark:border-none" >
            <div className="flex flex-row items-center justify-between" >

                <div className="flex flex-row items-center gap-2" >
                    <Trophy className="w-4 h-4" />
                    <p className="text-lg font-bold" >My Leagues & Standings</p>
                    {/* <GamePlayHelpButton className="" iconHw="w-4 h-4" /> */}
                </div>
            </div>

            <div className="flex flex-row items-center justify-between gap-2" >
                <PrimaryButton onClick={openCreateModal} className="flex-1" >
                    <p>Create League</p>
                </PrimaryButton>

                <PrimaryButton onClick={openJoinModal} className="flex-1" >
                    <p>Join League</p>
                </PrimaryButton>
            </div>


            <div>
                <SecondaryText>Click on a league to view it's standings</SecondaryText>
            </div>

            <LeagueGroupsTable 
                leagues={leagues}
            />

            <SuggestedLeaguesSections
                fantasySeason={fantasySeason}
            />

            {leagues.length === 0 && (
                <NoContentCard
                    message="You haven't joined any leagues yet 👀!"
                />
            )}

            {showCreateModal && (
                <CreateLeagueModal
                    isOpen={showCreateModal}
                    onLeagueCreated={handleCreateLeague}
                    onClose={toggle}
                    initMode={initTab}
                />
            )}
        </div>
    )
}