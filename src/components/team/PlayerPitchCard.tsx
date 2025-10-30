import { twMerge } from "tailwind-merge";
import { useAthleteRoundScore } from "../../hooks/useAthletePointsBreakdown";
import { IFantasyLeagueRound } from "../../types/fantasyLeague";
import { IFantasyTeamAthlete } from "../../types/fantasyTeamAthlete";
import { formatPosition } from "../../utils/athleteUtils";
import { isLeagueRoundLocked } from "../../utils/leaguesUtils";
import PlayerMugshot from "../shared/PlayerMugshot";
import SecondaryText from "../shared/SecondaryText";
import { Activity } from "react";
import { IFixture } from "../../types/games";

type PlayerPitchCardProps = {
    player: IFantasyTeamAthlete,
    onClick?: (player: IFantasyTeamAthlete) => void,
    round: IFantasyLeagueRound
}

export function PlayerPitchCard({ player, onClick, round }: PlayerPitchCardProps) {

    const { position_class } = player;

    const handleClick = () => {
        if (onClick) {
            onClick(player);
        }
    }

    return (
        <div className='flex flex-col items-center justify-center gap-1' >
            <div
                className={twMerge(
                    'overflow-hidden rounded-xl min-h-[150px] max-h-[150px] bg-gradient-to-br from-green-500/30 to-green-500/60',
                    'min-w-[120px] max-w-[120px] flex flex-col'
                )}
                onClick={handleClick}
            >

                <div className='flex-3 flex overflow-clip flex-col items-center justify-center w-full' >
                    <PlayerMugshot
                        url={player.image_url}
                        className='border-none rounded-none w-[100px] h-[100px] bg-transparent hover:bg-transparent'
                        showPrBackground={false}
                    />

                    {/* <TeamJersey 
          teamId={player.athlete_team_id}
          className='border-none rounded-none w-[100px] h-[100px] bg-transparent hover:bg-transparent'
        /> */}
                </div>

                <div className='flex-1 p-2 w-full items-center justify-center  min-h-[30%] rounded-xl bg-gradient-to-br from-white to-slate-200 dark:from-slate-800 dark:to-dark-900' >

                    <div className='flex flex-col items-center justify-center' >
                        <p className='text-slate-800 dark:text-white text-[11px] font-semibold' >{player.athstat_firstname}</p>
                    </div>

                    <div className='flex flex-col items-center justify-center' >
                        <SecondaryText className=' text-[10px]' >{position_class ? formatPosition(position_class) : ""}</SecondaryText>
                    </div>
                </div>
            </div>

            <PlayerScoreIndicator
                player={player}
                round={round}
            />

        </div>
    )
}

type PlayerPointsScoreProps = {
    round: IFantasyLeagueRound,
    player: IFantasyTeamAthlete,
    nextMatch?: IFixture
}

function PlayerScoreIndicator({ round, player, nextMatch }: PlayerPointsScoreProps) {

    const isLocked = isLeagueRoundLocked(round);
    const { isLoading, score } = useAthleteRoundScore(player.tracking_id, round.season_id, round.start_round ?? 0);


    return (
        <>
            <Activity mode={!isLoading && isLocked ? 'visible' : 'hidden'}  >
                <div>
                    <p className='font-bold' >{score.toFixed(1)}</p>
                </div>
            </Activity>

            <Activity mode={nextMatch ? "visible" : "hidden"} >
                <p>{nextMatch?.game_id}</p>
            </Activity>
        </>
    )
}