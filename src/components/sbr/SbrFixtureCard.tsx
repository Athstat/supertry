import { useNavigate } from "react-router-dom";
import { ISbrFixture } from "../../types/sbr";
import SbrTeamLogo from "./fixtures/SbrTeamLogo";
import { twMerge } from "tailwind-merge";
import { getSbrVotingSummary, sbrFxitureSummary } from "../../utils/sbrUtils";
import SbrPersonalVotingSummary from "./predictions/SbrPersonalVotingSummary";
import { useFetch } from "../../hooks/useFetch";
import { authService } from "../../services/authService";
import { sbrService } from "../../services/sbrService";
import { useSbrFixtureVotes } from "../../hooks/useFxitureVotes";
import { Check } from "lucide-react";

type Props = {
    fixture: ISbrFixture,
    showLogos?: boolean,
    showCompetition?: boolean,
    className?: string,
    showKickOffTime?: boolean
}

export default function SbrFixtureCard({ fixture, showLogos, showCompetition, className }: Props) {

    const { homeVotes, awayVotes, votes, userVote } = useSbrFixtureVotes(fixture);
    const { home_score, away_score, home_team, away_team } = fixture;
    const hasScores = home_score !== null && away_score !== null;

    const navigate = useNavigate();
    const handleClick = () => {
        navigate(`/sbr/fixtures/${fixture.fixture_id}`);
    }

    const gameCompleted = fixture.status === "completed";

    const { hasKickedOff } = sbrFxitureSummary(fixture);
    const { homePerc, awayPerc, votedAwayTeam, votedHomeTeam } = getSbrVotingSummary(fixture, userVote)

    return (
        <div
            // onClick={handleClick}
            className={twMerge(
                " dark:hover:bg-slate-800/70 hover:bg-slate-200 dark:bg-slate-800/40 bg-white rounded-xl border dark:border-slate-800/60 p-4",
                className
            )}
        >

            <div className="text-center w-full flex flex-col items-center justify-center text-xs text-slate-700 dark:text-slate-400" >
                {showCompetition && fixture.season && <p>{fixture.season}</p>}
            </div>

            <div
                className="flex flex-row"
            >
                {/* Home Team */}
                <div className="flex-1 flex gap-2 flex-col items-center justify-start" >
                    {showLogos && <SbrTeamLogo className="lg:w-14 lg:h-14" teamName={fixture.home_team} />}
                    <p className="text-xs lg-text-sm truncate text-wrap text-center" >{fixture.home_team}</p>
                    <p className="text-slate-700 dark:text-slate-400" >{gameCompleted && home_score ? home_score : "-"}</p>
                </div>
                {/* Kick off information */}
                <div className="flex-1 flex flex-col items-center justify-center dark:text-slate-400 text-slate-700 " >

                    {!hasScores && fixture.status !== "completed" && <p className="text-sm" >VS</p>}
                    {fixture.status === "completed" && (
                        <div className="flex w-full flex-row items-center justify-center gap-1" >
                            <div>Final</div>
                        </div>
                    )}
                </div>
                {/* Away Team */}
                <div className="flex-1 flex w-1/3 gap-2 flex-col items-center justify-end" >
                    {showLogos && <SbrTeamLogo className="lg:w-14 lg:h-14" teamName={fixture.away_team} />}
                    <p className="text-xs lg-text-sm truncate text-wrap text-center" >{fixture.away_team}</p>
                    <p className="text-slate-700 dark:text-slate-400" >{gameCompleted && away_score ? away_score : "-"}</p>
                </div>
            </div>

            <div className="flex flex-col w-full items-center justify-center" >
                {/* Home Team Voting Station */}

                <div className="w-full flex flex-col gap-1" >

                    <div className="w-full flex text-slate-500 dark:text-slate-400 flex-row items-center justify-between" >
                        <p className="text-xs" >{home_team} Win</p>
                        <p className="text-xs " >Vote{homeVotes.length > 0 ? "s" : ""} {homeVotes.length}</p>
                    </div>

                    <div className="flex flex-row gap-1 rounded-xl w-[100%]">
                        {/* Voting Circle */}
                        <div className="w-5 h-5 border rounded-xl border-slate-400 dark:border-slate-500" >
                            {votedHomeTeam && (
                                <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-r text-white bg-primary-500 rounded-xl " >
                                    <Check className="w-3 h-3" />
                                </div>
                            )}
                        </div>

                        <div
                            style={{
                                width: `${homePerc}%`
                            }}
                            className={twMerge(
                                "rounded-xl h-5 text-slate-700 dark:text-slate-400 text-xs text-center flex flex-row items-center justify-center bg-slate-300",
                                votedHomeTeam && "bg-gradient-to-r text-white from-primary-500 to-blue-700"
                            )}
                        >
                            {homeVotes.length} Votes
                        </div>
                    </div>

                    <div className="w-4 h-4" >

                    </div>
                </div>
            </div>
        </div>
    )
}