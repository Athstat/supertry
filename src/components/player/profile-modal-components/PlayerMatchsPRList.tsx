import useSWR from "swr"
import { powerRankingsService } from "../../../services/powerRankingsService"
import { LoadingState } from "../../ui/LoadingState"
import { SingleMatchPowerRanking } from "../../../types/powerRankings"
import RoundedCard from "../../shared/RoundedCard"
import { Calendar } from "lucide-react"
import TeamLogo from "../../team/TeamLogo"
import { twMerge } from "tailwind-merge"
import { format } from "date-fns"
import PillTag from "../../shared/PillTap"
import SecondaryText from "../../shared/SecondaryText"
import { IProAthlete } from "../../../types/athletes"
import { useNavigate } from "react-router-dom"

type Props = {
    player: IProAthlete
}

export default function PlayerMatchsPRList({ player }: Props) {

    const { data, isLoading } = useSWR(`player-matches-pr/${player.tracking_id}`,
        () => powerRankingsService.getPastMatchsPowerRankings(player.tracking_id ?? "", 10)
    );

    const matchesPR: any[] = data ?? [];

    if (isLoading) return <LoadingState />

    if (matchesPR.length === 0 && !matchesPR) {
        return <></>
    }

    if (matchesPR.length === 0) {
        return;
    }

    const matchesWon = matchesPR.reduce((sum, m) => {
        const { athleteTeamWon } = didAthleteTeamWin(m);
        return sum + (athleteTeamWon ? 1 : 0);
    }, 0);

    const matchesLost = matchesPR.reduce((sum, m) => {
        const { athleteTeamWon } = didAthleteTeamWin(m);
        return sum + (athleteTeamWon ? 0 : 1);
    }, 0);

    const matchesDrawn = matchesPR.reduce((sum, m) => {
        const { wasDraw } = didAthleteTeamWin(m);
        return sum + (wasDraw ? 1 : 0);
    }, 0);

    return (
        <div className="flex flex-col gap-4 py-6" >

            <SecondaryText className="text-lg font-medium flex flex-row items-center gap-1" >
                <Calendar />
                Last {matchesPR.length} Matches
            </SecondaryText>

            <div className="flex flex-row items-center gap-1" >
                <PillTag className="py-0.5 px-3 text-sm text-slate-700 dark:text-slate-400" >Won {matchesWon}</PillTag>
                <PillTag className="py-0.5 px-3 text-sm text-slate-700 dark:text-slate-400" >Lost {matchesLost}</PillTag>
                {matchesDrawn ?  <PillTag>Draw {matchesDrawn}</PillTag> : null}
            </div>
            {matchesPR.map((matchPr) => {
                return <PlayerSingleMatchPrCard singleMatchPr={matchPr} />
            })}
        </div>
    )
}

type CardProps = {
    singleMatchPr: SingleMatchPowerRanking,
}

function PlayerSingleMatchPrCard({ singleMatchPr }: CardProps) {

    const { opposition_score, team_score, game_status, kickoff_time, competition_name: season_name } = singleMatchPr.game;

    if (opposition_score === undefined || team_score === undefined || game_status !== "completed") {
        return;
    }

    const wasHomePlayer = singleMatchPr.team_id === singleMatchPr.game.team.athstat_id;

    const { wasDraw, athleteTeamWon } = didAthleteTeamWin(singleMatchPr);

    const oppositionTeamName = wasHomePlayer ? 
        singleMatchPr.game.opposition_team.athstat_name : 
        singleMatchPr.game.team.athstat_name;

    const oppositionImageUrl = wasHomePlayer ? 
        singleMatchPr.game.opposition_team.image_url : 
        singleMatchPr.game.team.image_url;

    const navigate = useNavigate();

    const goToMatchPage = () => {
        navigate(`/fixtures/${singleMatchPr.game.game_id}`);
    }


    return (
        <RoundedCard className="p-4 flex flex-col gap-2 bg-slate-50 dark:bg-slate-800 dark:border-slate-700" >

            <div className="flex flex-row items-center justify-between" >
                <div className="flex flex-row items-center gap-2" >
                    
                    <TeamLogo className="w-10 h-10" url={oppositionImageUrl} />
                    <div>
                        <p className="" >vs {oppositionTeamName}</p>
                        {wasDraw ?
                            (<p className="dark:text-slate-400 text-sm text-slate-700" >D {team_score} - {opposition_score}</p>) :
                            <p className={twMerge(
                                "text-sm",
                                athleteTeamWon ? "font-bold dark:text-primary-500 text-primary-600" : "dark:text-slate-300 text-slate-700"
                            )} >{athleteTeamWon ? "W" : "L"} {team_score} - {opposition_score}</p>
                        }
                    </div>
                </div>
                <div className="flex flex-col items-center justify-center gap-0.5" >
                    <p className=" dark:text-primary-400 text-primary-500 text-lg font-bold" >{singleMatchPr.updated_power_ranking}</p>
                    <p className="text-xs dark:text-slate-400 text-slate-800" >PR</p>
                </div>
            </div>

            <div className="dark:text-slate-400 text-wrap text-xs text-slate-700" >
                {kickoff_time ? format(kickoff_time, "EE dd MMMM yyy") : ""}, {season_name}
            </div>

            <div className="flex flex-row items-center" >
                <button 
                    onClick={goToMatchPage}
                    className="text-sm text-primary-500 hover:underline dark:text-primary-400" >
                        View Match Details
                    </button>
            </div>
        </RoundedCard>
    )
}

function didAthleteTeamWin(singleMatchPr: SingleMatchPowerRanking) {

    const { opposition_score, team_score } = singleMatchPr.game;
    const wasHomePlayer = singleMatchPr.team_id === singleMatchPr.game.team.athstat_id;

    const homeTeamWon = (team_score || 0) > (opposition_score || 0);
    const awayTeamWon = (opposition_score || 0) > (team_score || 0);
    const wasDraw = opposition_score === team_score;
    const athleteTeamWon = (wasHomePlayer && homeTeamWon) || (!wasHomePlayer && awayTeamWon);

    return { athleteTeamWon, wasDraw };
}