import { Trophy } from "lucide-react"
import { FantasyLeagueGroup } from "../../../../types/fantasyLeagueGroups"
import { LeagueGroupCardSmall } from "../../league_card_small/LeagueGroupCardSmall"
import PrimaryButton from "../../../shared/buttons/PrimaryButton"
import { useState } from "react"
import CreateLeagueModal from "../../CreateLeagueModal"
import { useNavigate } from "react-router-dom"
import NoContentCard from "../../../shared/NoContentMessage"
import { IFantasySeason } from "../../../../types/fantasy/fantasySeason"
import RoundedCard from "../../../shared/RoundedCard"
import SecondaryText from "../../../shared/SecondaryText"
import { useUserJoinedLeagues } from "../../../../hooks/leagues/useUserJoinedLeagues"

type Props = {
    fantasySeason: IFantasySeason
}

/** Renders users league groups section */
export default function LeagueAndStandingsSection({ fantasySeason }: Props) {

    const navigate = useNavigate();
    const {leagues, isLoading} = useUserJoinedLeagues(fantasySeason.id);

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

    const handleClickLeagueCard = (league: FantasyLeagueGroup) => {
        navigate(`/league/${league.id}/standings`);
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
                    <p className="text-md font-medium" >Leagues & Standings</p>
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

            <div className="flex flex-col gap-2" >
                <div className="flex font-medium flex-row items-center justify-between" >
                    <SecondaryText className="text-xs" >League</SecondaryText>
                    <SecondaryText className="text-xs" >Ranking</SecondaryText>
                </div>

                {leagues.map((l) => {
                    return (
                        <LeagueGroupCardSmall
                            leagueGroup={l}
                            key={l.id}
                            onClick={handleClickLeagueCard}
                        />
                    )
                })}
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