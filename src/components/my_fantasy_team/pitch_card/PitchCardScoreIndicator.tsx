import { TriangleAlert } from "lucide-react";
import { Activity } from "react";
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

    const { showAvailabilityWarning, homeOrAway, opponent, reportTitle } = usePlayerRoundAvailability(
        player.tracking_id,
        league?.season_id ?? "",
        leagueRound?.round_number ?? 0,
        seasonTeam?.athstat_id
    );

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

                <Activity mode={showAvailabilityWarning ? "visible" : "hidden"} >
                    <div className="w-full flex flex-row gap-1 text-center items-center justify-center" >
                        <p className="text-[8px] md:text-[10px] font-medium" >{reportTitle}</p>
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