import { twMerge } from "tailwind-merge";
import { VotingOptionsResults, VotingOptionBar } from "../../shared/bars/VotingOptionBar";
import { useState } from "react";
import { mutate } from "swr";
import { useGameVotes } from "../../../hooks/useGameVotes";
import { gamesService } from "../../../services/gamesService";
import { fixtureSumary } from "../../../utils/fixtureUtils";
import { IFixture } from "../../../types/games";

type Props = {
    fixture: IFixture
}

export default function ProFixtureVotingBox({fixture} : Props) {

    const {
        team_score,
        game_status,
        opposition_score,
        team_name,
        opposition_team_name,
    } = fixture;

    const matchFinal = game_status === 'completed' && team_score && opposition_score;

    const homeTeamWon = matchFinal ? team_score > opposition_score : false;
    const awayTeamWon = matchFinal ? team_score < opposition_score : false;

    const { gameKickedOff } = fixtureSumary(fixture);

    // Voting functionality
    const { homeVotes, awayVotes, userVote } = useGameVotes(fixture);
    const [isVoting, setIsVoting] = useState(false);

    // Calculate voting percentages
    const totalVotes = homeVotes.length + awayVotes.length;
    const homePerc = totalVotes === 0 ? 0 : Math.round((homeVotes.length / totalVotes) * 100);
    const awayPerc = totalVotes === 0 ? 0 : Math.round((awayVotes.length / totalVotes) * 100);

    const votedHomeTeam = userVote?.vote_for === 'home_team';
    const votedAwayTeam = userVote?.vote_for === 'away_team';
    const hasUserVoted = votedHomeTeam || votedAwayTeam;

    const handleVote = async (voteFor: 'home_team' | 'away_team') => {
        if (gameKickedOff) return;

        setIsVoting(true);

        try {
            if (!userVote) {
                await gamesService.postGameVote(fixture.game_id, voteFor);
            } else {
                await gamesService.putGameVote(fixture.game_id, voteFor);
            }

            // Refresh the votes data
            await mutate(`game-votes-${fixture.game_id}`);
        } catch (error) {
            console.error('Error voting:', error);
        } finally {
            setIsVoting(false);
        }
    };

    const isTbdGame = fixture.team_name === 'TBD' || fixture.opposition_team_name === 'TBD';

    if (isTbdGame) return;

    return (
        <div
            className={twMerge(
                'flex mt-4 flex-col w-full gap-1 items-center justify-center',
                isVoting && 'animate-pulse opacity-60 cursor-progress'
            )}
            onClick={e => e.stopPropagation()} // Prevent modal from opening when voting
        >
            {/* Voting UI - Before kickoff and before voting */}
            {!hasUserVoted && !gameKickedOff && (
                <div className="flex flex-col w-full gap-2 items-center text-sm justify-center text-slate-700 dark:text-slate-400">
                    <p className="text-xs">Who you got winning?</p>
                    <div className="flex flex-col gap-2 w-full">
                        <button
                            onClick={() => handleVote('home_team')}
                            className="border dark:border-slate-700 flex-1 px-2 rounded-lg bg-slate-200 py-1.5 text-xs hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700"
                            disabled={isVoting}
                        >
                            {team_name}
                        </button>
                        <button
                            onClick={() => handleVote('away_team')}
                            className="border dark:border-slate-700 flex-1 px-2 rounded-lg bg-slate-200 py-1.5 text-xs hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700"
                            disabled={isVoting}
                        >
                            {opposition_team_name}
                        </button>
                    </div>
                </div>
            )}

            {gameKickedOff && (
                <VotingOptionsResults
                    homeTeam={fixture.team_name}
                    awayTeam={fixture.opposition_team_name}
                    hasScores={fixture.game_status === 'completed'}
                    homeTeamWon={homeTeamWon}
                    awayTeamWon={awayTeamWon}
                    homeScore={fixture.team_score}
                    awayScore={fixture.opposition_score}
                    votedAwayTeam={votedAwayTeam}
                    votedHomeTeam={votedHomeTeam}
                    homeVotes={homeVotes.length}
                    awayVotes={awayVotes.length}
                />
            )}

            {/* Show voting bars after user has voted or after kickoff */}
            {(hasUserVoted && !gameKickedOff) && (
                <>
                    <VotingOptionBar
                        hasUserVoted={votedHomeTeam}
                        voteCount={homeVotes.length}
                        votePercentage={homePerc}
                        title={`${team_name}`}
                        onClick={() => handleVote('home_team')}
                        isGreen={!!(votedHomeTeam && matchFinal && homeTeamWon)}
                        isRed={!!(votedHomeTeam && matchFinal && awayTeamWon)}
                        disable={isVoting || gameKickedOff}
                    />
                    <VotingOptionBar
                        hasUserVoted={votedAwayTeam}
                        voteCount={awayVotes.length}
                        votePercentage={awayPerc}
                        title={`${opposition_team_name}`}
                        onClick={() => handleVote('away_team')}
                        isGreen={!!(votedAwayTeam && matchFinal && awayTeamWon)}
                        isRed={!!(votedAwayTeam && matchFinal && homeTeamWon)}
                        disable={isVoting || gameKickedOff}
                    />
                </>
            )}
        </div>
    )
}
