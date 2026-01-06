import { Shield, ArrowRight } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { twMerge } from "tailwind-merge";
import { useFantasyLeagueGroup } from "../../hooks/leagues/useFantasyLeagueGroup";
import { IProAthlete } from "../../types/athletes";
import { FantasyLeagueTeamWithAthletes } from "../../types/fantasyLeague";
import { isLeagueRoundLocked } from "../../utils/leaguesUtils";
import PointsBreakdownModal from "../points_breakdown/PointsBreakdownModal";
import PlayerMugshot from "../shared/PlayerMugshot";
import RoundedCard from "../shared/RoundedCard";
import { Lock } from "lucide-react";

type OverviewProps = {
    team: FantasyLeagueTeamWithAthletes
}

export function TeamAthletesHorizontalList({ team }: OverviewProps) {

    const { currentRound } = useFantasyLeagueGroup();
    const isLocked = currentRound && isLeagueRoundLocked(currentRound);

    const [showPointsModal, setShowPointsModal] = useState(false);
    // const [showProfileModal, setShowProfileModal] = useState(false);
    const [selectedPlayer, setSelectedPlayer] = useState<IProAthlete>();

    const navigate = useNavigate();
    const goToMyTeam = () => {
        navigate(`/league/${currentRound?.fantasy_league_group_id}?journey=my-team`);
    }

    const handleClickPlayer = (a: IProAthlete) => {
        setSelectedPlayer(a);
        setShowPointsModal(true);
    }

    const handleClosePointsModal = () => {
        setShowPointsModal(false);
        setSelectedPlayer(undefined);
    }

    return (
        <RoundedCard className='bg-transparent hover:bg-transparent bg-none shadow-none dark:bg-none dark:bg-transparent hover:dark:bg-transparent border-none flex flex-col' >
            <div className='flex  flex-row items-center justify-between' >

                <div className='flex flex-row items-center gap-2' >
                    {!isLocked && <Shield className='w-4 h-4' />}
                    {isLocked && <Lock className='w-4 h-4' />}
                    <p className='font-bold' >My Team</p>
                </div>

                <div className='flex flex-row items-center gap-1 cursor-pointer text-blue-500 hover:text-blue-600 dark:hover:text-blue-400' onClick={goToMyTeam}>
                    View <ArrowRight className='w-4 h-4' />
                </div>
            </div>


            <div className='flex flex-row items-center overflow-x-auto no-scrollbar gap-4' >
                {team.athletes?.map((a) => {

                    const onClick = () => {
                        handleClickPlayer(a.athlete);
                    }

                    return (
                        <div
                            className={twMerge(
                                'flex flex-col px-4 w-[150px] h-[150px] rounded-xl',
                                'p-2 gap-2 items-center justify-center'
                            )}

                            onClick={onClick}
                        >
                            <PlayerMugshot
                                url={a.athlete.image_url}
                                className='w-20 h-20'
                                showPrBackground
                                playerPr={95}
                                key={a.athlete.tracking_id}
                                teamId={a.athlete.team_id}
                            />
                            <p className='text-xs text-center truncate text-nowrap' >{a.athlete.player_name}</p>
                            {isLocked && <p className='rounded-xl text-xs flex flex-row items-center justify-center w-[60px]text-white' >{a.score ? a.score.toFixed(0) : '0'}</p>}
                        </div>
                    )
                })}
            </div>

            {showPointsModal && selectedPlayer && currentRound && (
                <PointsBreakdownModal
                    onClose={handleClosePointsModal}
                    isOpen={showPointsModal}
                    athlete={selectedPlayer}
                    team={team}
                    round={currentRound}
                />
            )}

        </RoundedCard>
    )
}