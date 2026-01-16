import { Plus, Trophy } from "lucide-react"
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
import { useAuth } from "../../../contexts/AuthContext"
import LeagueGroupsSection from "../LeagueGroupsSection"

type Props = {
    fantasySeason: IFantasySeason
}


/** Renders users league groups section */
export default function LeagueAndStandingsSection({ fantasySeason }: Props) {

    const navigate = useNavigate();

    const { authUser } = useAuth();
    const { leagues, isLoading } = useJoinedLeagues(fantasySeason.id);

    const [showCreateModal, setShowCreateModal] = useState(false);
    const [initTab, setInitTab] = useState<"join" | "create">("create");
    const toggle = () => setShowCreateModal(prev => !prev);

    const officialLeagues = leagues.filter((l) => {
        return l.type === 'official_league';
    });

    const myLeagues = leagues.filter((l) => {
        return l.creator_id === authUser?.kc_id;
    })

    const joinedLeagues = leagues.filter((l) => {
        const notOfficial = l.type !== 'official_league';
        const notMine = l.creator_id !== authUser?.kc_id;
        return notMine && notOfficial;
    })

    const openCreateModal = () => {
        setInitTab("create");
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

            <div className="flex flex-row items-center justify-between px-4" >

                <div className="flex flex-row items-center gap-2" >
                    <Trophy className="w-4 h-4" />
                    <p className="text-lg font-bold" >Leagues & Standings</p>
                    {/* <GamePlayHelpButton className="" iconHw="w-4 h-4" /> */}
                </div>
            </div>

            <div className="flex flex-row items-center justify-between gap-2 px-4" >
                <PrimaryButton onClick={openCreateModal} className="flex-1" >
                    <Plus className="w-4 h-4" />
                    <p>Join or Create League</p>
                </PrimaryButton>
            </div>


            {/* <div>
                <SecondaryText>Click on a league to view it's standings</SecondaryText>
            </div> */}

            <div className="flex flex-col gap-4 mt-4" >

                <LeagueGroupsSection
                    title="Official Leagues"
                    description="Leagues created by SCRUMMY"
                    leagues={officialLeagues}
                    isVerified
                />

                <LeagueGroupsSection
                    title="My Leagues"
                    description="Leagues created by you"
                    leagues={myLeagues}
                />

                <LeagueGroupsSection
                    title="Joined Leagues"
                    description="Other leagues you are apart of, created by others"
                    leagues={joinedLeagues}
                />

                <SuggestedLeaguesSections
                    fantasySeason={fantasySeason}
                />

            </div>



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