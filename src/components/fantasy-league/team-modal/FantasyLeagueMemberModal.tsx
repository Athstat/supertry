import useSWR from "swr"
import { useFantasyLeagueGroup } from "../../../hooks/leagues/useFantasyLeagueGroup"
import { FantasyLeagueGroupMember } from "../../../types/fantasyLeagueGroups"
import { isLeagueRoundLocked } from "../../../utils/leaguesUtils"
import DialogModal from "../../shared/DialogModal"
import { leagueService } from "../../../services/leagueService"
import { StatCard } from "../../shared/StatCard"
import RoundedCard from "../../shared/RoundedCard"
import NoContentCard from "../../shared/NoContentMessage"
import TeamOverviewView from "./team_overview/TeamOverviewView"
import PlayerPointsBreakdownView from "./points_breakdown/PlayerPointsBreakdownView"
import { useState } from "react"
import { IProAthlete } from "../../../types/athletes"
import { Lock } from "lucide-react"
import SecondaryText from "../../shared/SecondaryText"
import { useAuth } from "../../../contexts/AuthContext"

type Props = {
    isOpen?: boolean,
    member: FantasyLeagueGroupMember,
    onClose?: () => void
}

/** Renders a fantasy league group members team on a modal */
export default function FantasyLeagueMemberModal({ onClose, isOpen, member }: Props) {

    const { currentRound } = useFantasyLeagueGroup();
    const { authUser } = useAuth();
    const isUser = authUser?.kc_id === member.user_id;

    const canPeek = isUser || (currentRound && isLeagueRoundLocked(currentRound));

    const fetchKey = canPeek ? `/fantasy-league-rounds/${currentRound?.id}/user-teams/${member.user_id}` : null;
    const { data: roundTeam, isLoading, error } = useSWR(fetchKey, () => leagueService.getUserRoundTeam(currentRound?.id ?? 0, member.user_id));

    const [selectPlayer, setSelectedPlayer] = useState<IProAthlete>();
    const onClosePointsBreakdown = () => {
        setSelectedPlayer(undefined);
    }

    if (isLoading) {
        return <DialogModal
            open={isOpen}
            onClose={onClose}
            key={member.user_id}
            title={`${member.user.username || member.user.first_name} - ${currentRound?.title}`}
            className="gap-4 flex flex-col p-0 no-scrollbar"
            outerCon="p-4 lg:p-8 no-scrollbar"
            hw="lg:w-[40%] no-scrollbar"
        >

            <div className="grid grid-cols-2 gap-2" >

                <StatCard
                    label=""
                    value={''}
                    className="h-[50px] animate-pulse"
                />

                <StatCard
                    label=""
                    value={''}
                    className="h-[50px] animate-pulse"
                />

                <StatCard
                    label=""
                    value={''}
                    className="h-[50px] animate-pulse"
                />

                <StatCard
                    label=""
                    value={''}
                    className="h-[50px] animate-pulse"
                />
            </div>

            <div>
                <RoundedCard className="border-none h-[500px] animate-pulse bg-gray-200" />
            </div>

        </DialogModal>
    }

    if (!canPeek) {
        return (
            <DialogModal
                open={isOpen}
                onClose={onClose}
                key={member.user_id}
                title={`${member.user.username || member.user.first_name} - ${currentRound?.title}`}
                className="p-4 text-center no-scrollbar flex flex-col items-center justify-center w-full h-full gap-4"
                outerCon="p-4 lg:p-8 no-scrollbar"
                hw="lg:w-[40%] no-scrollbar min-h-[90vh]"
            >   

                <SecondaryText>
                    <Lock className="w-20 h-20" />
                </SecondaryText>

                <SecondaryText>
                    No Peeking! <strong>{member.user.username || member.user.first_name}'s</strong> lineup unlocks after the {currentRound?.title} deadline
                </SecondaryText>

            </DialogModal>
        )
    }

    if (roundTeam === undefined || error || roundTeam?.athletes?.length === undefined) {
        return (
            <DialogModal
                open={isOpen}
                onClose={onClose}
                key={member.user_id}
                title={`${member.user.username || member.user.first_name} - ${currentRound?.title}`}
                className="gap-4 flex flex-col items-center justify-center w-full h-full p-0 no-scrollbar"
                outerCon="p-4 lg:p-8 no-scrollbar"
                hw="lg:w-[40%] no-scrollbar lg:w-[40%] no-scrollbar min-h-[90vh]"
            >
                <NoContentCard
                    message={`${member.user.first_name || member.user.username} doesn't have a team for this round, ${currentRound?.title}`}
                />
            </DialogModal>
        )
    }

    return (
        <DialogModal
            open={isOpen}
            onClose={onClose}
            key={member.user_id}
            title={`${member.user.username || member.user.first_name} - ${currentRound?.title}`}
            className="gap-4 flex flex-col p-0 no-scrollbar min-h-[90vh]"
            outerCon="p-4 lg:p-8 no-scrollbar"
            hw="lg:w-[40%] no-scrollbar"
        >

            {currentRound && !selectPlayer && <TeamOverviewView
                roundTeam={roundTeam}
                currentRound={currentRound}
                onSelectPlayer={setSelectedPlayer}
            />}

            {(selectPlayer && currentRound &&
                <PlayerPointsBreakdownView
                    athlete={selectPlayer}
                    team={roundTeam}
                    round={currentRound}
                    onClose={onClosePointsBreakdown}
                />
            )}

        </DialogModal>
    )
}

