import { twMerge } from "tailwind-merge";
import { useAthleteRoundScore } from "../../hooks/useAthletePointsBreakdown";
import { IFantasyLeagueRound } from "../../types/fantasyLeague";
import { IFantasyTeamAthlete } from "../../types/fantasyTeamAthlete";
import { formatPosition } from "../../utils/athleteUtils";
import { isLeagueRoundLocked } from "../../utils/leaguesUtils";
import { Activity, useMemo } from "react";
import { useMyTeamView } from "../fantasy-leagues/my-team/MyTeamStateProvider";
import { IFantasyLeagueTeamSlot } from "../../types/fantasyLeagueTeam";
import { useFantasyLeagueTeam } from "../fantasy-leagues/my-team/FantasyLeagueTeamProvider";
import { CirclePlus, TriangleAlert } from "lucide-react";
import TeamJersey from "../player/TeamJersey";
import { usePlayerRoundAvailability } from "../../hooks/fantasy/usePlayerRoundAvailability";
import { useFantasyLeagueGroup } from "../../hooks/leagues/useFantasyLeagueGroup";
import { CaptainsArmBand } from "../player/CaptainsArmBand";
import { sanitizeStat } from "../../utils/stringUtils";

type PlayerPitchCardProps = {
    player: IFantasyTeamAthlete;
    onClick?: (player: IFantasyTeamAthlete) => void;
    round: IFantasyLeagueRound;
};

export function PlayerPitchCard({ player, onClick, round }: PlayerPitchCardProps) {
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
                    'cursor-pointer rounded-lg ',
                    "min-h-[150px] max-h-[150px] min-w-[115px] max-w-[115px]",
                    'md:min-h-[150px] md:max-h-[150px] md:min-w-[120px] md:max-w-[120px] flex flex-col',
                    player.image_url && "bg-gradient-to-br from-green-800 to-green-900/60 border border-green-600",
                    !player.image_url && "bg-gradient-to-br from-green-500 to-green-500",
                    showAvailabilityWarning && "bg-gradient-to-r dark:from-yellow-500/30 dark:to-yellow-500/30 from-yellow-500/40 to-yellow-600/40"
                )}
                onClick={handleClick}
            >

                <div className={twMerge(
                    'flex-3 flex md:min-h-[100px] md:max-h-[100px] overflow-clip flex-col items-center justify-center w-full',
                    "min-h-[100px] max-h-[100px]"
                )} >

                    {/* {!player.image_url && ( */}
                    <div className=" relative overflow-clip object-contain h-[100px] w-[100px] flex flex-col items-center " >
                        <TeamJersey
                            teamId={player.athlete_team_id}
                            useBaseClasses={false}
                            className="h-[90px] md:h-[100px] object-cover  absolute -bottom-6 drop-shadow-[0_5px_5px_rgba(0,0,0,0.7)] shadow-black"
                            scummyLogoClassName="absolute top-0 left-0 w-[90px] md:w-[100px] h-full"
                            hideFade
                            key={player.tracking_id}
                        />
                    </div>
                    {/* )} */}

                </div>

                <div className={twMerge(
                    'flex-1 w-full items-center justify-between text-slate-800 dark:text-black border-green-900 md:min-h-[40px] md:max-h-[40px] rounded-lg bg-gradient-to-br from-white to-slate-200 dark:from-white dark:to-white',
                    "dark:from-slate-700 dark:to-slate-800 dark:text-white",
                    'min-h-[50px] max-h-[50px]'
                )} >

                    <div className='flex px-2 h-[25px] md:h-[25px] flex-col items-center justify-center' >
                        <p className=' text-[10px] md:text-[11px] font-semibold' >{player.athstat_firstname}</p>
                    </div>

                    <div className={twMerge(
                        'flex rounded-b-lg flex-row h-[25px] md:h-[25px] items-center bg-gradient-to-r justify-center gap-2 divide-x-1 divide-red-500',
                        "from-slate-200 to-slate-300",
                        "dark:from-slate-600 dark:to-slate-700 dark:text-white",
                    )} >

                        <Activity mode={viewMode === "pitch" ? "visible" : "hidden"} >
                            <PlayerScoreIndicator
                                player={player}
                                round={round}
                            />
                        </Activity>
                    </div>
                </div>
            </div>



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
                    <p className=" text-[8px] md:text-[10px] max-w-[100px] font-medium truncate" >{opponent?.athstat_name} {homeOrAway}</p>
                </Activity>

                <Activity mode={showAvailabilityWarning ? "visible" : "hidden"} >
                    <p className="dark:text-yellow-200 text-[8px] md:text-[10px] font-medium text-yellow-300" >Not Playing ⚠️</p>
                </Activity>

                <Activity mode={showScore ? 'visible' : 'hidden'}  >
                    <div>
                        <p className='text-[10px] md:text-[10px] font-bold' >{sanitizeStat(score)}</p>
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
                    'overflow-hidden cursor-pointer rounded-lg min-h-[150px] max-h-[150px] min-w-[115px] max-w-[115px] bg-gradient-to-br from-green-900 to-green-900/60',
                    'md:min-h-[150px] md:max-h-[150px] md:min-w-[120px] md:max-w-[120px] flex flex-col'
                )}
                onClick={handleClick}
            >
                <div className="flex-1 h-full flex overflow-clip flex-col items-center justify-center w-full gap-2">
                    <div>
                        <CirclePlus className="w-10 text-white/90 h-10" />
                    </div>

                    <div>
                        <p className="text-sm text-white/90">
                            {position_class ? formatPosition(position_class) : ''}
                        </p>
                    </div>
                </div>
            </div>

            {/* <div className="min-h-[14px] max-h-[14px] w-full" >

            </div> */}
        </div>
    );
}
