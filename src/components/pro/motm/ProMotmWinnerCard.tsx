import { useAtomValue } from "jotai";
import { proGameMotmVotesAtom, proGameMotmCandidatesAtom } from "../../../state/proMotm.atoms";
import { getProAthleteMotmVoteTally } from "../../../utils/proMotmUtils";
import SecondaryText from "../../shared/SecondaryText";
import { Trophy } from "lucide-react";

export default function ProMotmWinnerCard() {
    const allVotes = useAtomValue(proGameMotmVotesAtom);
    const candidates = useAtomValue(proGameMotmCandidatesAtom);

    // If no votes, select first player alphabetically
    if (allVotes.length === 0) {
        if (candidates.length === 0) {
            return (
                <div className="flex flex-col items-center gap-4 p-6 bg-slate-100 dark:bg-slate-800 rounded-xl">
                    <Trophy className="w-12 h-12 text-slate-400" />
                    <div className="text-center">
                        <h3 className="font-semibold text-lg">No Players Available</h3>
                        <SecondaryText>No players available for Top Dawg selection</SecondaryText>
                    </div>
                </div>
            );
        }

        // Sort candidates alphabetically by full name and pick the first one
        const sortedCandidates = [...candidates].sort((a, b) => {
            const nameA = `${a.athstat_firstname} ${a.athstat_lastname}`.toLowerCase();
            const nameB = `${b.athstat_firstname} ${b.athstat_lastname}`.toLowerCase();
            return nameA.localeCompare(nameB);
        });

        const defaultWinner = sortedCandidates[0];

        return (
            <div className="flex flex-col gap-4 p-6 bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 border border-yellow-200 dark:border-yellow-700 rounded-xl">
                <div className="flex flex-row items-center gap-3">
                    <div className="bg-yellow-500 p-2 rounded-full">
                        <Trophy className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h3 className="font-bold text-lg text-yellow-800 dark:text-yellow-200">
                            Top Dawg Of The Match
                        </h3>
                        <SecondaryText className="text-yellow-700 dark:text-yellow-300">
                            Default selection (no votes cast)
                        </SecondaryText>
                    </div>
                </div>

                <div className="flex flex-row items-center gap-4 p-4 bg-white dark:bg-slate-800 rounded-lg">
                    {defaultWinner.image_url && (
                        <img 
                            src={defaultWinner.image_url} 
                            alt={`${defaultWinner.athstat_firstname} ${defaultWinner.athstat_lastname}`}
                            className="w-16 h-16 rounded-full object-cover"
                        />
                    )}
                    
                    <div className="flex-1">
                        <h4 className="font-semibold text-lg">
                            {defaultWinner.athstat_firstname} {defaultWinner.athstat_lastname}
                        </h4>
                        <SecondaryText className="text-sm">
                            {defaultWinner.position} • {defaultWinner.team_name}
                        </SecondaryText>
                        {defaultWinner.nationality && (
                            <SecondaryText className="text-xs">
                                {defaultWinner.nationality}
                            </SecondaryText>
                        )}
                    </div>

                    <div className="text-right">
                        <div className="bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                            #{defaultWinner.player_number || "?"}
                        </div>
                    </div>
                </div>

                <div className="text-center">
                    <SecondaryText className="text-sm">
                        Selected alphabetically (first by name) as no votes were cast
                    </SecondaryText>
                </div>
            </div>
        );
    }

    // Find the winner (player with most votes)
    const voteCounts = new Map<string, { count: number; vote: any }>();
    
    allVotes.forEach(vote => {
        const current = voteCounts.get(vote.athlete_id);
        if (current) {
            current.count += 1;
        } else {
            voteCounts.set(vote.athlete_id, { count: 1, vote });
        }
    });

    // Get the winner (highest vote count)
    let winner = null;
    let maxVotes = 0;
    
    for (const [athleteId, data] of voteCounts) {
        if (data.count > maxVotes) {
            maxVotes = data.count;
            winner = data.vote;
        }
    }

    if (!winner) {
        return (
            <div className="flex flex-col items-center gap-4 p-6 bg-slate-100 dark:bg-slate-800 rounded-xl">
                <Trophy className="w-12 h-12 text-slate-400" />
                <div className="text-center">
                    <h3 className="font-semibold text-lg">No Winner</h3>
                    <SecondaryText>Unable to determine Top Dawg of the Match</SecondaryText>
                </div>
            </div>
        );
    }

    const totalVotes = allVotes.length;
    const winnerVotes = getProAthleteMotmVoteTally(allVotes, winner.athlete_id);
    const percentage = Math.round((winnerVotes / totalVotes) * 100);

    return (
        <div className="flex flex-col gap-4 p-6 bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 border border-yellow-200 dark:border-yellow-700 rounded-xl">
            <div className="flex flex-row items-center gap-3">
                <div className="bg-yellow-500 p-2 rounded-full">
                    <Trophy className="w-6 h-6 text-white" />
                </div>
                <div>
                    <h3 className="font-bold text-lg text-yellow-800 dark:text-yellow-200">
                        Top Dawg Of The Match
                    </h3>
                    <SecondaryText className="text-yellow-700 dark:text-yellow-300">
                        {winnerVotes} votes ({percentage}%)
                    </SecondaryText>
                </div>
            </div>

            <div className="flex flex-row items-center gap-4 p-4 bg-white dark:bg-slate-800 rounded-lg">
                {winner.image_url && (
                    <img 
                        src={winner.image_url} 
                        alt={`${winner.athstat_firstname} ${winner.athstat_lastname}`}
                        className="w-16 h-16 rounded-full object-cover"
                    />
                )}
                
                <div className="flex-1">
                    <h4 className="font-semibold text-lg">
                        {winner.athstat_firstname} {winner.athstat_lastname}
                    </h4>
                    <SecondaryText className="text-sm">
                        {winner.position} • {winner.team_name}
                    </SecondaryText>
                    {winner.nationality && (
                        <SecondaryText className="text-xs">
                            {winner.nationality}
                        </SecondaryText>
                    )}
                </div>

                <div className="text-right">
                    <div className="bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                        #{winner.player_number || "?"}
                    </div>
                </div>
            </div>

            <div className="text-center">
                <SecondaryText className="text-sm">
                    Based on {totalVotes} {totalVotes === 1 ? "vote" : "votes"} from fans
                </SecondaryText>
            </div>
        </div>
    );
}
