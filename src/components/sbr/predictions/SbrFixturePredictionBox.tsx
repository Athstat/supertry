import { Fragment } from 'react/jsx-runtime';
import { twMerge } from 'tailwind-merge';
import { useSbrFixtureVotes } from '../../../hooks/useFxitureVotes';
import { ISbrFixture } from '../../../types/sbr'
import { VotingOptionBar } from '../../shared/bars/VotingOptionBar';
import { useState } from 'react';
import { mutate } from 'swr';
import { sbrService } from '../../../services/sbrService';
import { sbrFixtureSummary, getSbrVotingSummary } from '../../../utils/sbrUtils';

type Props = {
    fixture: ISbrFixture,
    hide?: boolean,
    preVotingCols?: "two" | "one"
}

/** Renders a box that can be used to predict and view an sbr fixtures predictions */
export default function SbrFixturePredictionBox({ fixture, hide, preVotingCols = "one" }: Props) {

    const { homeVotes, awayVotes, userVote, isLoading } = useSbrFixtureVotes(fixture);
    const { home_score, away_score, home_team, away_team } = fixture;
    const hasScores = home_score !== null && away_score !== null;

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

    const { hasKickedOff, homeTeamWon, awayTeamWon } = sbrFixtureSummary(fixture);
    const { homePerc, awayPerc, votedAwayTeam, votedHomeTeam } = getSbrVotingSummary(fixture, userVote)

    const hasUserVoted = votedAwayTeam || votedHomeTeam;

    return (
        <div>

            {isLoading && (
                <div className="w-full h-20 bg-slate-200 dark:bg-slate-800/40 animate-pulse rounded-xl" >

                </div>
            )}


            {!isLoading && !hide && <div
                className={twMerge(
                    "flex mt-6 flex-col w-full gap-0 items-center justify-center",
                    isVoting && "animate-pulse opacity-60 cursor-progress"
                )}
            >
                {/* Home Team Voting Station */}

                {!hasUserVoted && !hasKickedOff && <div className="flex flex-col w-full gap-2 items-center text-xs lg:text-sm justify-center text-slate-700 dark:text-slate-400" >
                    <p>Who you got winning?</p>

                    <div className={twMerge(
                        'grid grid-cols-2 gap-2 w-full',
                        preVotingCols === "one" && "grid grid-cols-1"
                    )} >
                        <button onClick={handleClickHomeVoteBar} className="border dark:border-slate-700 w-full px-2 rounded-xl bg-slate-200 py-2 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700" >
                            {home_team}
                        </button>

                        <button onClick={handleClickAwayVoteBar} className="border dark:border-slate-700 w-full px-2 rounded-xl bg-slate-200 py-2 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700" >
                            {away_team}
                        </button>
                    </div>

                </div>}

                {hasKickedOff && <div className="flex flex-col w-full text-xs md:text-sm  gap-2 items-center justify-center text-slate-700 dark:text-slate-200" >
                    <p>{hasScores ? 'Results' : 'Predictions'}</p>

                    <button className={twMerge(
                        "border dark:border-slate-700 w-full px-4 rounded-xl py-2 flex items-center justify-between",
                        hasScores ? (
                            homeTeamWon ? "bg-green-200 dark:bg-green-900/40 dark:border-green-900" :
                                awayTeamWon ? "bg-red-200 dark:bg-red-900/40 dark:border-red-900/60" :
                                    "bg-slate-200 dark:bg-slate-800"
                        ) : "bg-slate-200 dark:bg-slate-800"
                    )} >
                        <span className="flex-1 text-left">{home_team} Win - {homeVotes.length} Votes</span>
                        <span className="flex items-center gap-1">
                            {votedHomeTeam && <span className="text-xs bg-blue-500 text-white px-2 py-0.5 rounded-full">Your Pick</span>}
                            {hasScores && homeTeamWon && '✓'}
                        </span>
                    </button>

                    <button className={twMerge(
                        "border dark:border-slate-700 w-full px-4 rounded-xl py-2 flex items-center justify-between",
                        hasScores ? (
                            awayTeamWon ? "bg-green-200 dark:bg-green-900/40 dark:border-green-900" :
                                homeTeamWon ? "bg-red-200 dark:bg-red-900/40 dark:border-red-900/60" :
                                    "bg-slate-200 dark:bg-slate-800"
                        ) : "bg-slate-200 dark:bg-slate-800"
                    )} >
                        <span className="flex-1 text-left">{away_team} Win - {awayVotes.length} Votes</span>
                        <span className="flex items-center gap-1">
                            {votedAwayTeam && <span className="text-xs bg-blue-500 text-white px-2 py-0.5 rounded-full">Your Pick</span>}
                            {hasScores && awayTeamWon && '✓'}
                        </span>
                    </button>

                    {hasScores && (
                        <p className="text-xs mt-1">
                            {homeTeamWon ? `${home_team} won ${home_score}-${away_score}` :
                                awayTeamWon ? `${away_team} won ${away_score}-${home_score}` :
                                    `Match drawn ${home_score}-${away_score}`}
                        </p>
                    )}
                </div>}

                {/* Post Match Voting Results */}

                {(hasUserVoted && !hasKickedOff) && <Fragment>
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
