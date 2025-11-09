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
import { useMyTeamView } from "../fantasy-leagues/my-team/MyTeamStateProvider";
import { IFantasyLeagueTeamSlot } from "../../types/fantasyLeagueTeam";
import { useFantasyLeagueTeam } from "../fantasy-leagues/my-team/FantasyLeagueTeamProvider";
import { CirclePlus } from "lucide-react";
import { CaptainsArmBand } from "../fixtures/FixtureRosterList";
import TeamJersey from "../player/TeamJersey";

type PlayerPitchCardProps = {
    player: IFantasyTeamAthlete,
    onClick?: (player: IFantasyTeamAthlete) => void,
    round: IFantasyLeagueRound
}

export function PlayerPitchCard({ player, onClick, round }: PlayerPitchCardProps) {

    const { position_class } = player;
    const { viewMode } = useMyTeamView();
    const { teamCaptain } = useFantasyLeagueTeam();

    const handleClick = () => {
        if (onClick) {
            onClick(player);
        }
    }

    const isTeamCaptain = teamCaptain?.tracking_id === player.tracking_id;

    return (
        <div 
            key={player.tracking_id}
            className='flex flex-col items-center justify-center gap-1 relative' 
        >

            {isTeamCaptain && (
                <div className="absolute top-0 right-0" >
                    <CaptainsArmBand className="font-black" />
                </div>
            )}

            <div
                className={twMerge(
                    'overflow-hidden cursor-pointer rounded-xl min-h-[150px] max-h-[150px]',
                    'min-w-[120px] max-w-[120px] flex flex-col',
                    player.image_url && "bg-gradient-to-br from-green-500/30 to-green-500/60",
                    !player.image_url && "bg-gradient-to-br from-green-500/20 to-green-500/20"
                )}
                onClick={handleClick}
            >

                <div className='flex-3 flex overflow-clip flex-col items-center justify-center w-full' >
                    {player.image_url && <PlayerMugshot
                        url={player.image_url}
                        className='border-none rounded-none w-[100px] h-[100px] bg-transparent hover:bg-transparent'
                        scrummyLogoClassName="dark:bg-transparent bg-transparent"
                        showPrBackground={false}
                        key={player.tracking_id}
                    />}

                    {!player.image_url && (
                        <div className=" relative overflow-clip object-contain h-[100px] w-[100px] flex flex-col items-center " >
                            <TeamJersey 
                                teamId={player.athlete_team_id}
                                useBaseClasses={false}
                                className="h-[100px] object-cover  absolute -bottom-6 drop-shadow-[0_5px_5px_rgba(0,0,0,0.7)] shadow-black"
                                scummyLogoClassName="absolute top-0 left-0 w-[100px] h-full"
                                hideFade
                                key={player.tracking_id}
                            />
                        </div>
                    )}

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

            <Activity mode={viewMode === "pitch" ? "visible" : "hidden"} >
                <PlayerScoreIndicator
                    player={player}
                    round={round}
                />
            </Activity>

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
                    <p className='font-bold text-white' >{score.toFixed(1)}</p>
                </div>
            </Activity>

            <Activity mode={nextMatch ? "visible" : "hidden"} >
                <p className="text-white" >{ }</p>
            </Activity>
        </>
    )
}



type EmptySlotProps = {
    slot: IFantasyLeagueTeamSlot
}

/** Renders an empty slot card */
export function EmptySlotPitchCard({ slot }: EmptySlotProps) {

    const { initateSwapOnEmptySlot } = useFantasyLeagueTeam();

    const { position } = slot;
    const { position_class } = position;

    const handleClick = () => {
        initateSwapOnEmptySlot(slot);
    }

    return (
        <div className='flex flex-col items-center justify-center gap-1 relative' >


            <div
                className={twMerge(
                    'overflow-hidden cursor-pointer rounded-xl min-h-[150px] max-h-[150px] bg-gradient-to-br from-green-500/30 to-green-500/60',
                    'min-w-[120px] max-w-[120px] flex flex-col'
                )}
                onClick={handleClick}
            >

                <div className='flex-1 h-full flex overflow-clip flex-col items-center justify-center w-full gap-2' >
                    <div>
                        <CirclePlus className="w-10 text-white/50 h-10" />
                    </div>

                    <div>
                        <p className="text-sm text-white/50" >{position_class ? formatPosition(position_class) : ''}</p>
                    </div>
                </div>
            </div>

        </div>
    )
}