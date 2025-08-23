import useSWR from "swr"
import { useFantasyLeagueGroup } from "../../../hooks/leagues/useFantasyLeagueGroup"
import { FantasyLeagueGroupMember } from "../../../types/fantasyLeagueGroups"
import { isLeagueRoundLocked } from "../../../utils/leaguesUtils"
import DialogModal from "../../shared/DialogModal"
import { leagueService } from "../../../services/leagueService"
import { StatCard } from "../../shared/StatCard"
import { PlayerGameCard } from "../../player/PlayerGameCard"
import RugbyPitch from "../../shared/RugbyPitch"
import { FantasyLeagueTeamWithAthletes } from "../../../types/fantasyLeague"
import PlayerMugshot from "../../shared/PlayerMugshot"
import { formatPosition } from "../../../utils/athleteUtils"
import SecondaryText from "../../shared/SecondaryText"
import RoundedCard from "../../shared/RoundedCard"
import NoContentCard from "../../shared/NoContentMessage"

type Props = {
    isOpen?: boolean,
    member: FantasyLeagueGroupMember,
    onClose?: () => void
}

/** Renders a fantasy league group members team on a modal */
export default function FantasyLeagueMemberModal({ onClose, isOpen, member }: Props) {

    const { currentRound } = useFantasyLeagueGroup();
    const canPeek = currentRound && isLeagueRoundLocked(currentRound);

    const fetchKey = canPeek ? `/fantasy-league-rounds/${currentRound.id}/user-teams/${member.user_id}` : null;
    const { data: roundTeam, isLoading, error } = useSWR(fetchKey, () => leagueService.getUserRoundTeam(currentRound?.id ?? 0, member.user_id));

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

    if (roundTeam === undefined || error || roundTeam?.athletes?.length === undefined) {
        return (
            <DialogModal
                open={isOpen}
                onClose={onClose}
                key={member.user_id}
                title={`${member.user.username || member.user.first_name} - ${currentRound?.title}`}
                className="gap-4 flex flex-col p-0 no-scrollbar"
                outerCon="p-4 lg:p-8 no-scrollbar"
                hw="lg:w-[40%] no-scrollbar"
            >
                <NoContentCard
                    message={`${member.user.first_name || member.user.username} doesn't have a team for this round, ${currentRound?.title}`}  
                />
            </DialogModal>
        )
    }

    const overallScore = roundTeam ? roundTeam?.overall_score : 0;
    const teamValue = roundTeam ? roundTeam?.athletes?.reduce((sum, a) => {
        return sum + (a.purchase_price ?? 0);
    }, 0) : 0;

    return (
        <DialogModal
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
                    label="Round"
                    value={currentRound?.title}
                // icon={<Trophy className="w-4 h-4" />}
                />

                <StatCard
                    label="Rank"
                    value={roundTeam?.rank}
                // icon={<ChartBarIncreasing className="w-4 h-4" />}
                />

                <StatCard
                    label="Points"
                    value={overallScore ? Math.floor(overallScore) : 0}
                />

                <StatCard
                    label="Team Value"
                    value={teamValue ? Math.floor(teamValue) : 0}
                // icon={<CircleDollarSignIcon className="w-4 h-4" />}
                />
            </div>

            {/* <TeamFormation 
                players={}
            /> */}

            {roundTeam && <TeamAthletesGridView
                roundTeam={roundTeam}
            />}


            {/* {roundTeam && <TeamAthletesListView
                roundTeam={roundTeam}
            />} */}


        </DialogModal>
    )
}

type TeamAthletesViewProps = {
    roundTeam: FantasyLeagueTeamWithAthletes
}

function TeamAthletesGridView({ roundTeam }: TeamAthletesViewProps) {
    return (
        <div className="bg-green-600 overflow-clip min-h-[920px] max-h-[920px] relative rounded-xl" >
            <RugbyPitch count={6} />

            <div className="flex flex-row  min-h-[920px] max-h-[920px] items-center justify-center flex-wrap absolute top-0 left-0" >

                {roundTeam?.athletes?.map((a) => {
                    return (
                        <div className="flex flex-col gap-2 items-center justify-center" >
                            <PlayerGameCard
                                player={a.athlete}
                            />

                            <p className="font-bold text-white" >{Math.floor(a.score ?? 0)}</p>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}


function TeamAthletesListView({ roundTeam }: TeamAthletesViewProps) {
    return (
        <div className="overflow-clip relative rounded-xl gap-2" >

            <div className="flex flex-col gap-2" >

                {roundTeam?.athletes.map((a) => {
                    return (
                        <div className="flex flex-row gap-2 items-center justify-between" >
                            <div className="flex flex-row items-center gap-2" >
                                <PlayerMugshot
                                    url={a.athlete.image_url}
                                />

                                <div>
                                    <p className="font-bold truncate text-xs" >{a.athlete.player_name}</p>
                                    <SecondaryText className="text-xs" >{a.athlete.position_class ? formatPosition(a.athlete.position_class) : '-'}</SecondaryText>
                                </div>
                            </div>

                            <p className="font-bold" >{Math.floor(a.score ?? 0)}</p>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}