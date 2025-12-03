 import { twMerge } from "tailwind-merge";
import { useAthleteRoundScore } from "../../hooks/useAthletePointsBreakdown";
import { IFantasyLeagueRound } from "../../types/fantasyLeague";
import { IFantasyTeamAthlete } from "../../types/fantasyTeamAthlete";
import { formatPosition } from "../../utils/athleteUtils";
import { isLeagueRoundLocked } from "../../utils/leaguesUtils";
import SecondaryText from "../shared/SecondaryText";
import { Activity, useMemo } from "react";
import { useMyTeamView } from "../fantasy-leagues/my-team/MyTeamStateProvider";
import { IFantasyLeagueTeamSlot } from "../../types/fantasyLeagueTeam";
import { useFantasyLeagueTeam } from "../fantasy-leagues/my-team/FantasyLeagueTeamProvider";
import { CirclePlus, Coins, TriangleAlert } from "lucide-react";
import TeamJersey from "../player/TeamJersey";
import { usePlayerRoundAvailability } from "../../hooks/fantasy/usePlayerRoundAvailability";
import { useFantasyLeagueGroup } from "../../hooks/leagues/useFantasyLeagueGroup";
import { CaptainsArmBand } from "../player/CaptainsArmBand";

type PlayerPitchCardProps = {
    player: IFantasyTeamAthlete;
    onClick?: (player: IFantasyTeamAthlete) => void;
    round: IFantasyLeagueRound;
};

export function PlayerPitchCard({ player, onClick, round }: PlayerPitchCardProps) {
    const { position_class } = player;
    const { viewMode } = useMyTeamView();
    const { league } = useFantasyLeagueGroup();
    const { teamCaptain } = useFantasyLeagueTeam();

    const { isNotAvailable, isTeamNotPlaying } = usePlayerRoundAvailability(
        player.tracking_id,
        league?.season_id ?? "",
        round?.start_round ?? 0,
    );

    const showAvailabilityWarning = isNotAvailable || isTeamNotPlaying;

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
                <div className="absolute top-0 right-0 p-1" >
                    <CaptainsArmBand className="font-black" />
                </div>
            )}

            {showAvailabilityWarning && (
                <div className="absolute top-0 left-0 p-1" >
                    <div className={twMerge(
                        " dark:bg-yellow-300 bg-yellow-400 hover:bg-yellow-400  border-yellow-500 dark:border-yellow-500 w-6 h-6 rounded-md flex flex-col items-center justify-center",
                    )} >
                        <TriangleAlert className={twMerge(
                            "w-3.5  text-yellow-600 dark:text-yellow-700 h-4",
                        )} />
                    </div>
                </div>
            )}

            <div
                className={twMerge(
                    'overflow-hidden cursor-pointer rounded-xl min-h-[150px] max-h-[150px]',
                    'min-w-[120px] max-w-[120px] flex flex-col',
                    player.image_url && "bg-gradient-to-br from-white/20 to-white/40 ",
                    !player.image_url && "bg-gradient-to-br from-green-500/20 to-green-500/20",
                    showAvailabilityWarning && "bg-gradient-to-r dark:from-yellow-500/30 dark:to-yellow-500/30 from-yellow-500/40 to-yellow-600/40"
                )}
                onClick={handleClick}
            >

                <div className='flex-3 flex overflow-clip flex-col items-center justify-center w-full' >
                    {/* {player.image_url && <PlayerMugshot
                        url={player.image_url}
                        className='border-none rounded-none w-[100px] h-[100px] bg-transparent hover:bg-transparent'
                        scrummyLogoClassName="dark:bg-transparent bg-transparent"
                        showPrBackground={false}
                        key={player.tracking_id}
                    />} */}

                    {/* {!player.image_url && ( */}
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
                    {/* )} */}

                </div>

                <div className={twMerge(
                    'flex-1 p-2 w-full items-center justify-center text-slate-800 dark:text-white  min-h-[30%] rounded-xl bg-gradient-to-br from-white to-slate-200 dark:from-slate-800 dark:to-dark-900',
                    // showAvailabilityWarning && "dark:from-yellow-400 dark:to-yellow-500 dark:text-black"
                )} >

                    <div className='flex flex-col items-center justify-center' >
                        <p className=' text-[11px] font-semibold' >{player.athstat_firstname}</p>
                    </div>

                    <div className='flex flex-row items-center justify-center gap-2 divide-x-1 divide-red-500' >
                        <SecondaryText className={twMerge(
                            ' text-[10px]',
                            // showAvailabilityWarning && "dark:text-black"
                        )} >{position_class ? formatPosition(position_class) : ""}</SecondaryText>
                        <div className="flex flex-row items-center gap-0.5" >
                            <p className="text-[10px]" >{player.purchase_price}</p>
                            <Coins className="w-2.5 h-2.5 text-yellow-500" />
                        </div>
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

    );
}

type PlayerPointsScoreProps = {
    round: IFantasyLeagueRound,
    player: IFantasyTeamAthlete,
}

function PlayerScoreIndicator({ round, player }: PlayerPointsScoreProps) {

    const isLocked = isLeagueRoundLocked(round);
    const { isLoading, score } = useAthleteRoundScore(player.tracking_id, round.season_id, round?.start_round ?? 0);
    const { league } = useFantasyLeagueGroup();

    const { isNotAvailable, isTeamNotPlaying, nextMatch } = usePlayerRoundAvailability(
        player.tracking_id,
        league?.season_id ?? "",
        round?.start_round ?? 0,
    );

    const [homeOrAway, opponent] = useMemo(() => {
        if (!nextMatch) {
            return [undefined, undefined];
        }

        const playerTeamId = player.athlete_team_id;

        if (playerTeamId === nextMatch.team?.athstat_id) {
            return ["(H)", nextMatch.opposition_team];
        }

        if (playerTeamId === nextMatch.opposition_team?.athstat_id) {
            return ["(A)", nextMatch.team];
        }

        return [undefined, undefined];

    }, [nextMatch, player.athlete_team_id]);

    const showScore = !isLoading && isLocked;

    const showAvailabilityWarning = (isNotAvailable || isTeamNotPlaying) && !showScore;
    const showNextMatchInfo = !showAvailabilityWarning && homeOrAway && opponent && !showScore;

    return (
        <>

            <div className="min-h-[14px] max-h-[14px] w-full overflow-clip items-center justify-center flex flex-row" >
                <Activity mode={showNextMatchInfo ? "visible" : "hidden"} >
                    <p className="text-white text-[10px] max-w-[100px] font-medium truncate" >{opponent?.athstat_name} {homeOrAway} </p>
                </Activity>

                <Activity mode={showAvailabilityWarning ? "visible" : "hidden"} >
                    <p className="dark:text-yellow-200 text-[10px] font-medium text-yellow-300" >Not Playing ⚠️</p>
                </Activity>

                <Activity mode={showScore ? 'visible' : 'hidden'}  >
                    <div>
                        <p className='text-[10px] font-medium text-white' >{score.toFixed(1)}</p>
                    </div>
                </Activity>
            </div>
        </>
    )
}

type EmptySlotProps = {
    slot: IFantasyLeagueTeamSlot;
};

/** Renders an empty slot card */
export function EmptySlotPitchCard({ slot }: EmptySlotProps) {
    const { initateSwapOnEmptySlot } = useFantasyLeagueTeam();

    const { position } = slot;
    const { position_class } = position;

    const handleClick = () => {
        initateSwapOnEmptySlot(slot);
    };

    return (
        <div className="flex flex-col items-center justify-center gap-1 relative">
            <div
                className={twMerge(
                    'overflow-hidden cursor-pointer rounded-xl min-h-[150px] max-h-[150px] bg-gradient-to-br from-green-500/30 to-green-500/60',
                    'min-w-[120px] max-w-[120px] flex flex-col'
                )}
                onClick={handleClick}
            >
                <div className="flex-1 h-full flex overflow-clip flex-col items-center justify-center w-full gap-2">
                    <div>
                        <CirclePlus className="w-10 text-white/50 h-10" />
                    </div>

                    <div>
                        <p className="text-sm text-white/50">
                            {position_class ? formatPosition(position_class) : ''}
                        </p>
                    </div>
                </div>
            </div>

            <div className="min-h-[14px] max-h-[14px] w-full" >
                
            </div>
        </div>
    );
}
