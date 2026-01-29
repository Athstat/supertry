import { TriangleAlert } from "lucide-react";
import { Activity, useMemo } from "react";
import { twMerge } from "tailwind-merge";
import { useAthleteRoundScore } from "../../../hooks/fantasy/useAthleteRoundScore";
import { useFantasyTeam } from "../../../hooks/fantasy/useFantasyTeam";
import { usePlayerRoundAvailability } from "../../../hooks/fantasy/usePlayerRoundAvailability";
import { useFantasyLeagueGroup } from "../../../hooks/leagues/useFantasyLeagueGroup";
import { usePlayerSeasonTeam } from "../../../hooks/seasons/useSeasonTeams";
import { IFantasyTeamAthlete } from "../../../types/fantasyTeamAthlete";
import { isSeasonRoundLocked } from "../../../utils/leaguesUtils";
import { sanitizeStat } from "../../../utils/stringUtils";

type PlayerPointsScoreProps = {
    player: IFantasyTeamAthlete,
}

/** Player Pitch Card Score Indicator */
export function PitchCardScoreIndicator({ player }: PlayerPointsScoreProps) {

    const {leagueRound} = useFantasyTeam();

    const isLocked = leagueRound && isSeasonRoundLocked(leagueRound);
    const { isLoading: loadingScore, score } = useAthleteRoundScore(player.tracking_id, leagueRound?.season || '', leagueRound?.round_number ?? 0);
    const { league } = useFantasyLeagueGroup();

    const isLoading = loadingScore;

    const {seasonTeam} = usePlayerSeasonTeam(player.athlete);

    const { isNotAvailable, isTeamNotPlaying, nextMatch, showAvailabilityWarning, isNotInSeasonSquad, isInjured } = usePlayerRoundAvailability(
        player.tracking_id,
        league?.season_id ?? "",
        leagueRound?.round_number ?? 0,
        seasonTeam?.athstat_id
    );

    const [homeOrAway, opponent] = useMemo(() => {

        if (!nextMatch) {
            return [undefined, undefined];
        }

        const playerTeamId = seasonTeam?.athstat_id;

        if (playerTeamId === nextMatch.team?.athstat_id) {
            return ["(H)", nextMatch.opposition_team];
        }

        if (playerTeamId === nextMatch.opposition_team?.athstat_id) {
            return ["(A)", nextMatch.team];
        }

        return [undefined, undefined];

    }, [nextMatch, seasonTeam?.athstat_id]);

    const showScore = !isLoading && isLocked;
    const showNextMatchInfo = !isLoading && !showAvailabilityWarning && homeOrAway && opponent && !showScore;

    return (
        <>
            <div className={twMerge(
                "min-h-[14px] max-h-[14px] w-full overflow-clip items-center justify-center flex flex-row",
                isLoading && "animate-pulse"
            )} >
                
                <Activity mode={isLoading ? "visible" : "hidden"} >
                    <div className="w-[60%] h-[10px] bg-white/40 animate-pulse" >

                    </div>
                </Activity>

                <Activity mode={showNextMatchInfo ? "visible" : "hidden"} >
                    <p className=" text-[8px] md:text-[10px] max-w-[100px] font-medium truncate" >vs {opponent?.athstat_name} {homeOrAway}</p>
                </Activity>

                {/* <Activity mode={showPrice ? "visible" : "hidden"} >
                    <div className=" max-w-[100px] font-medium truncate flex flex-row items-center gap-1" >
                        <p className="text-[10px] md:text-[10px]" >{player.price}</p>
                        <Coins className="text-yellow-500 w-2.5 h-2.5" />
                    </div>
            </Activity> */}

                <Activity mode={showAvailabilityWarning ? "visible" : "hidden"} >
                    <div className="w-full flex flex-row gap-1 text-center items-center justify-center" >
                        {isNotAvailable && <p className="text-[8px] md:text-[10px] font-medium" >Not Playing </p>}
                        {isTeamNotPlaying && <p className="text-[8px] md:text-[10px] font-medium" >Team Not Playing </p>}
                        {isNotInSeasonSquad && <p className="text-[8px] md:text-[10px] font-medium" >Not in Squad Selection</p>}
                        {isInjured && <p className="text-[8px] md:text-[10px] font-medium" >Injured</p>}
                        <TriangleAlert className="w-3 h-3" />
                    </div>
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