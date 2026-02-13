import { twMerge } from "tailwind-merge";
import { IFantasyTeamAthlete } from "../../../types/fantasyTeamAthlete";
import TeamJersey from "../../player/TeamJersey";
import { usePlayerRoundAvailability } from "../../../hooks/fantasy/usePlayerRoundAvailability";
import { CaptainsArmBand } from "../../player/CaptainsArmBand";
import { usePlayerSeasonTeam } from "../../../hooks/seasons/useSeasonTeams";
import { PitchCardScoreIndicator } from "./PitchCardScoreIndicator";
import { useMyTeam } from "../../../hooks/fantasy/my_team/useMyTeam";
import { useMyTeamSlot } from "../../../hooks/fantasy/my_team/useMyTeamSlot";

type PlayerPitchCardProps = {
    player: IFantasyTeamAthlete;
    onClick?: (player: IFantasyTeamAthlete) => void;
};

export function PlayerPitchCard({ player, onClick }: PlayerPitchCardProps) {
    const { round } = useMyTeam();
    const {isTeamCaptain} = useMyTeamSlot();
    const {seasonTeam} = usePlayerSeasonTeam(player.athlete);

    const { showAvailabilityWarning, homeOrAway, opponent, reportTitle } = usePlayerRoundAvailability(
        player.tracking_id,
        round?.season ?? "",
        round?.round_number ?? 0,
        seasonTeam?.athstat_id
    );

    const handleClick = () => {
        if (onClick) {
            onClick(player);
        }
    }

    return (
        <div
            key={player.tracking_id}
            className='flex flex-col items-center justify-center gap-1 relative'
        >

            {isTeamCaptain && (
                <div className="absolute top-4 md:top-0 right-0 p-1" >
                    <CaptainsArmBand className="font-black bg-yellow-500 dark:bg-yellow-500 text-black dark:text-black"  />
                </div>
            )}

            <div
                className={twMerge(
                    'cursor-pointer',
                    "min-h-[140px] max-h-[140px] min-w-[115px] max-w-[115px]",
                    'md:min-h-[140px] md:max-h-[140px] md:min-w-[110px] md:max-w-[110px] flex flex-col',
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
                            teamId={seasonTeam?.athstat_id}
                            useBaseClasses={false}
                            className="h-[90px] md:h-[100px] object-cover  absolute -bottom-6 drop-shadow-[0_5px_5px_rgba(0,0,0,0.7)] shadow-black"
                            scummyLogoClassName="absolute top-0 left-0 w-[90px] md:w-[100px] h-full"
                            hideFade
                            key={seasonTeam?.athstat_id}
                        />
                    </div>

                    {/* )} */}

                </div>

                <div className={twMerge(
                    'flex-1 w-full items-center justify-between text-slate-800 dark:text-black border-green-900 md:min-h-[40px] md:max-h-[40px] bg-gradient-to-br from-white to-slate-200 dark:from-white dark:to-white',
                    "dark:from-white dark:to-white dark:text-black",
                    'min-h-[40px] max-h-[40px]'
                )} >

                    <div className='flex px-2 h-[22px] md:h-[22px] flex-col items-center justify-center' >
                        <p className=' text-[10px] md:text-[10px] font-semibold text-nowrap max-w-[100px] truncate' >{player.athstat_lastname}</p>
                    </div>

                    <div className={twMerge(
                        'flex flex-row h-[22px] md:h-[22px] items-center bg-gradient-to-r justify-center gap-2 divide-x-1 divide-red-500',
                        showAvailabilityWarning && "from-yellow-500 to-yellow-500 text-black",
                        !showAvailabilityWarning && "from-[#011E5C] to-[#011E5C] dark:text-white text-white",
                    )} >
                            <PitchCardScoreIndicator
                                player={player}
                                showAvailabilityWarning={showAvailabilityWarning}
                                homeOrAway={homeOrAway}
                                opponent={opponent}
                                reportTitle={reportTitle}
                            />
                    </div>
                </div>
            </div>

        </div>

    );
}