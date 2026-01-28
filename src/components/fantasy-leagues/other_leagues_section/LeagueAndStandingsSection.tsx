import { Plus } from "lucide-react"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import SuggestedLeaguesSections from "./SuggestedLeaguesSection"
import { useJoinedLeagues } from "../../../hooks/leagues/useJoinedLeagues"
import { IFantasySeason } from "../../../types/fantasy/fantasySeason"
import { FantasyLeagueGroup } from "../../../types/fantasyLeagueGroups"
import PrimaryButton from "../../ui/buttons/PrimaryButton"
import NoContentCard from "../../ui/typography/NoContentMessage"
import CreateLeagueModal from "../create_league_modal/CreateLeagueModal"
import RoundedCard from "../../ui/cards/RoundedCard"
import LeagueGroupsSection from "../LeagueGroupsSection"
import StarPodium from "../../ui/icons/StarPodium"
import TextHeading from "../../ui/typography/TextHeading"
import { twMerge } from "tailwind-merge"
import { AppColours } from "../../../types/constants"

type Props = {
    fantasySeason?: IFantasySeason
}


/** Renders users league groups section */
export default function LeagueAndStandingsSection({ fantasySeason }: Props) {

    const navigate = useNavigate();
    const { leagues: myLeagues, isLoading } = useJoinedLeagues(fantasySeason?.id);

    const [showCreateModal, setShowCreateModal] = useState(false);
    const [initTab, setInitTab] = useState<"join" | "create">("create");
    const toggle = () => setShowCreateModal(prev => !prev);

    const openCreateModal = () => {
        setInitTab("create");
        toggle();
    }

    const handleCreateLeague = (league: FantasyLeagueGroup) => {
        navigate(`/league/${league.id}`);
    }

    if (isLoading) {
        return (
            <div>
                <div className='flex flex-col gap-4 px-4' >
                    <RoundedCard className='w-[200px] h-[35px] border-none rounded-xl animate-pulse' />
                    <RoundedCard className='w-full h-[45px] border-none rounded-xl animate-pulse' />
                </div>

                <div className='flex flex-col gap-3' >
                    <RoundedCard className='w-full h-[150px] mt-5 border-none rounded-none animate-pulse' />
                    <RoundedCard className='w-full h-[150px] border-none rounded-none animate-pulse' />
                    <RoundedCard className='w-full h-[150px] border-none rounded-none animate-pulse' />
                    <RoundedCard className='w-full h-[150px] border-none rounded-none animate-pulse' />
                </div>
            </div>
        )
    }

    return (
        <div className={twMerge(
            AppColours.BACKGROUND,
            "flex flex-col gap-4 dark:border-none bg-[#F0F3F7]",
        )} >

            <div className="flex flex-row items-center justify-between p-4 bg-[#E2E8F0] dark:bg-slate-700/60" >
                <div className="flex flex-row items-center gap-2" >
                    <div className="bg-white p-2 rounded-full" >
                        <StarPodium />
                    </div>

                    <TextHeading className="text-2xl font-semibold" blue >Leagues And Standings</TextHeading>
                </div>
            </div>

            <div className="flex flex-row items-center justify-between gap-2 px-4" >
                <PrimaryButton onClick={openCreateModal} className="flex-1" flexRowCN="gap-3" >
                    <Plus className="w-5 h-5" />
                    <p>Join or Create League</p>
                </PrimaryButton>
            </div>

            <div className="flex flex-col gap-4 mt-4 px-2" >

                <LeagueGroupsSection
                    title="My Leagues"
                    description="Leagues you’re a part of or you created"
                    emptyMessage="You are not part of any league, join a league or create your own to get started!"
                    leagues={myLeagues}
                />

                <SuggestedLeaguesSections
                    fantasySeason={fantasySeason}
                />

            </div>



            {myLeagues.length === 0 && (
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