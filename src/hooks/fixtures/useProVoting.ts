import { useState } from "react";
import { gamesService } from "../../services/gamesService";
import { IFixture } from "../../types/games";
import { fixtureSummary, isProGameTBD } from "../../utils/fixtureUtils";
import { useGameVotes } from "../useGameVotes";

export function useProVoting(fixture: IFixture) {

    const { gameKickedOff, homeTeamWon, awayTeamWon } = fixtureSummary(fixture);

    const { homeVotes, awayVotes, userVote, isLoading, mutate } = useGameVotes(fixture, true);
    const [isVoting, setIsVoting] = useState(false);

    // Calculate voting percentages
    const totalVotes = homeVotes.length + awayVotes.length;
    const homePerc = totalVotes === 0 ? 0 : Math.round((homeVotes.length / totalVotes) * 100);
    const awayPerc = totalVotes === 0 ? 0 : Math.round((awayVotes.length / totalVotes) * 100);

    const votedHomeTeam = userVote?.vote_for === 'home_team';
    const votedAwayTeam = userVote?.vote_for === 'away_team';
    const hasUserVoted = votedHomeTeam || votedAwayTeam;

    const wasVoteCorrect = hasUserVoted && ((votedHomeTeam && homeTeamWon) || (votedAwayTeam && awayTeamWon))

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
            await mutate();
        } catch (error) {
            console.error('Error voting:', error);
        } finally {
            setIsVoting(false);
        }
    };

    const isTbdGame = isProGameTBD(fixture);

    return {
        isTbdGame,
        handleVote,
        homeVotes,
        awayPerc,
        awayTeamWon,
        homeTeamWon,
        homePerc,
        isVoting,
        hasUserVoted,
        isLoading,
        awayVotes,
        userVote,
        wasVoteCorrect
    }
}