import { Fragment } from 'react/jsx-runtime';
import { twMerge } from 'tailwind-merge';
import { useSbrFixtureVotes } from '../../../hooks/useFxitureVotes';
import { ISbrFixture } from '../../../types/sbr'
import { VotingOptionBar, VotingOptionsResults } from '../../shared/bars/VotingOptionBar';
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

    const { homeVotes, awayVotes, userVote, isLoading, votes } = useSbrFixtureVotes(fixture);
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
    const { homePerc, awayPerc, votedAwayTeam, votedHomeTeam } = getSbrVotingSummary(fixture, votes, userVote)

    const hasUserVoted = votedAwayTeam || votedHomeTeam;

    return (
        <div className='' >

            {isLoading && (
                <div className="w-full h-20 bg-slate-200 dark:bg-slate-800/40 animate-pulse rounded-xl" >

                </div>
            )}


            {!isLoading && !hide && <div
                className={twMerge(
                    "flex flex-col w-full gap-0 items-center justify-center",
                    isVoting && "animate-pulse opacity-60 cursor-progress"
                )}
            >
                {/* Home Team Voting Station */}

                {!hasUserVoted && !hasKickedOff && <div className="flex flex-col w-full gap-2 items-center text-xs lg:text-sm justify-center text-slate-700 dark:text-slate-400" >
                    <p className='text-[10px]' >Who you got winning?</p>

                    <div className={twMerge(
                        'grid grid-cols-2 gap-2 w-full',
                        preVotingCols === "one" && "grid grid-cols-1"
                    )} >
                        <button onClick={handleClickHomeVoteBar} className="border dark:border-slate-700 text-[10px] w-full px-2 rounded-xl bg-slate-200 py-1 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700" >
                            {home_team.team_name}
                        </button>

                        <button onClick={handleClickAwayVoteBar} className="border dark:border-slate-700 text-[10px] w-full px-2 rounded-xl bg-slate-200 py-1 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700" >
                            {away_team.team_name}
                        </button>
                    </div>

                </div>}

                {hasKickedOff && (
                    <VotingOptionsResults 
                        homeTeam={home_team}
                        awayTeam={away_team}
                        homeTeamWon={homeTeamWon}
                        awayTeamWon={awayTeamWon}
                        homeScore={home_score}
                        awayScore={away_score}
                        votedHomeTeam={votedHomeTeam}
                        votedAwayTeam={votedAwayTeam}
                        homeVotes={homeVotes.length}
                        awayVotes={awayVotes.length}
                        hasScores={hasScores}
                    />
                )}

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
