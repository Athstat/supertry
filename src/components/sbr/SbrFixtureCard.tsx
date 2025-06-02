import { useNavigate } from "react-router-dom";
import { ISbrFixture } from "../../types/sbr";
import SbrTeamLogo from "./fixtures/SbrTeamLogo";
import { twMerge } from "tailwind-merge";
import { getSbrVotingSummary, sbrFxitureSummary } from "../../utils/sbrUtils";
import { useSbrFixtureVotes } from "../../hooks/useFxitureVotes";
import { Fragment } from "react/jsx-runtime";
import { useState } from "react";
import { mutate } from "swr";
import { sbrService } from "../../services/sbrService";
import { VotingOptionBar } from "../shared/bars/VotingOptionBar";

type Props = {
    fixture: ISbrFixture,
    showLogos?: boolean,
    showCompetition?: boolean,
    className?: string,
    showKickOffTime?: boolean
}

export default function SbrFixtureCard({ fixture, showLogos, showCompetition, className }: Props) {

    const { homeVotes, awayVotes, userVote, isLoading } = useSbrFixtureVotes(fixture);
    const { home_score, away_score, home_team, away_team } = fixture;
    const hasScores = home_score !== null && away_score !== null;

    const navigate = useNavigate();

    const handleClick = () => {
        navigate(`/sbr/fixtures/${fixture.fixture_id}`);
    }

    const [isVoting, setIsVoting] = useState(false);

    const onVote = async (side: "home_team" | "away_team") => {
        // if user has voted before use put request
        // else use post request

        if (hasKickedOff) {
            return;
        }

        setIsVoting(true);

        if (!userVote) {
            await sbrService.postSbrFixtureVote(
                fixture.fixture_id,
                side
            );
        } else {
            await sbrService.putSbrFixtureVote(
                fixture.fixture_id,
                side
            );
        }

        setIsVoting(false);

        await mutate(() => true);
    }

    const handleClickHomeVoteBar = () => {
        onVote("home_team");
    }

    const handleClickAwayVoteBar = () => {
        onVote("away_team");
    }

    const gameCompleted = fixture.status === "completed";

    const { hasKickedOff, homeTeamWon, awayTeamWon } = sbrFxitureSummary(fixture);
    const { homePerc, awayPerc, votedAwayTeam, votedHomeTeam } = getSbrVotingSummary(fixture, userVote)

    const hasUserVoted = votedAwayTeam || votedHomeTeam;

    return (
        <div
            // onClick={handleClick}
            className={twMerge(
                "   dark:bg-slate-800/40 cursor-pointer bg-white rounded-xl border dark:border-slate-800/60 p-4",
                className
            )}
        >

            <div className="text-center w-full flex flex-col items-center justify-center text-xs text-slate-700 dark:text-slate-400" >
                {showCompetition && fixture.season && <p>{fixture.season}</p>}
            </div>

            <div
                onClick={handleClick}
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

            {isLoading && (
                <div className="w-full h-20 bg-slate-200 dark:bg-slate-800/40 animate-pulse rounded-xl" >

                </div>
            )}

            {!isLoading && <div
                className={twMerge(
                    "flex mt-6 flex-col w-full gap-3 items-center justify-center",
                    isVoting && "animate-pulse opacity-60 cursor-progress"
                )}
            >
                {/* Home Team Voting Station */}

               {!hasUserVoted && !hasKickedOff && <div className="flex flex-col w-full gap-2 items-center text-sm justify-center text-slate-700 dark:text-slate-400" >
                    <p>Who you got winning?</p>

                    <button onClick={handleClickHomeVoteBar} className="border dark:border-slate-700 w-full px-2 rounded-xl bg-slate-200 py-2 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700" >
                        {home_team}
                    </button>

                    <button onClick={handleClickAwayVoteBar} className="border dark:border-slate-700 w-full px-2 rounded-xl bg-slate-200 py-2 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700" >
                        {away_team}
                    </button>

                </div>}

                {/* Post Match Voting Results */}

                {(hasUserVoted || hasKickedOff) && <Fragment>
                    <VotingOptionBar
                        hasUserVoted={votedHomeTeam}
                        voteCount={homeVotes.length}
                        votePercentage={homePerc}
                        title={`${home_team} Win`}
                        onClick={handleClickHomeVoteBar}
                        isGreen={votedHomeTeam && gameCompleted && homeTeamWon}
                        isRed={votedHomeTeam && gameCompleted && awayTeamWon}
                        disable={isVoting}
                    />
                    <VotingOptionBar
                        hasUserVoted={votedAwayTeam}
                        voteCount={awayVotes.length}
                        votePercentage={awayPerc}
                        title={`${away_team} Win`}
                        onClick={handleClickAwayVoteBar}
                        isGreen={votedAwayTeam && gameCompleted && awayTeamWon}
                        isRed={votedAwayTeam && gameCompleted && homeTeamWon}
                        disable={isVoting}
                    />
                </Fragment>}

            </div>}
        </div>
    )
}

