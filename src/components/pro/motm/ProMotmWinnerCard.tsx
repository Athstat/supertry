import { useAtomValue } from "jotai";
import { proGameMotmVotesAtom, proGameMotmCandidatesAtom } from "../../../state/proMotm.atoms";
import { getProAthleteMotmVoteTally } from "../../../utils/proMotmUtils";
import SecondaryText from "../../shared/SecondaryText";
import { Trophy } from "lucide-react";
import BlueGradientCard from "../../shared/BlueGradientCard";

export default function ProMotmWinnerCard() {
    const allVotes = useAtomValue(proGameMotmVotesAtom);
    const candidates = useAtomValue(proGameMotmCandidatesAtom);

    const getVoteTally = (athleteId: string) => {
        return getProAthleteMotmVoteTally(allVotes, athleteId);
    };

    // Sort votes by tally (descending), then alphabetically by name
    const votesDesc = allVotes.sort((a, b) => {
        const aTally = getVoteTally(a.athlete_id);
        const bTally = getVoteTally(b.athlete_id);

        const aName = (a.athstat_firstname ?? "") + " " + (a.athstat_lastname ?? "");
        const bName = (b.athstat_firstname ?? "") + " " + (b.athstat_lastname ?? "");

        const voteTallyEqual = aTally === bTally;

        return voteTallyEqual ?
            aName.localeCompare(bName ?? "") : bTally - aTally;
    });

    // If no votes, select first player alphabetically
    let winner;
    if (votesDesc.length === 0) {
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

        winner = sortedCandidates[0];
    } else {
        // Find winner from votes
        winner = candidates.find((c) => {
            return votesDesc[0].athlete_id === c.athlete_id;
        });
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

    return (
        <BlueGradientCard className="relative mt-4 w-full from-amber-400 via-amber-500 to-amber-600 dark:from-amber-500 dark:via-amber-600 dark:to-amber-800 max-w-md mx-auto p-6 bg-gradient-to-br rounded-xl border border-amber-400 shadow-xl hover:shadow-amber-500/10 transition-all duration-300">
            {/* Trophy Badge */}
            <div className="absolute -top-4 text-center text-xs left-1/2 -translate-x-1/2 bg-amber-500 text-white px-4 py-1 rounded-full lg:text-sm font-semibold shadow-lg">
                The Fan's Match MVP
            </div>

            {/* Main Content */}
            <div className="mt-2 flex flex-col items-center space-y-2">
                {winner.image_url ? (
                    <>
                        {/* Trophy Icon and Title - Same Row */}
                        <div className="flex items-center gap-2">
                            <div className="relative">
                                <div className="absolute -inset-1 bg-amber-400/30 rounded-full blur"></div>
                                <Trophy className="w-8 h-8 text-amber-100" />
                            </div>
                            <h2 className="text-sm font-bold text-amber-100">Top Dawg Of the Match</h2>
                        </div>

                        {/* Larger Player Image */}
                        <div className="relative">
                            <div className="absolute -inset-1 bg-amber-400/20 rounded-full blur"></div>
                            <img 
                                src={winner.image_url} 
                                alt={`${winner.athstat_firstname} ${winner.athstat_lastname}`}
                                className="relative w-32 h-32 rounded-full object-cover border-4 border-amber-200"
                            />
                        </div>
                    </>
                ) : (
                    <>
                        {/* Trophy Icon */}
                        <div className="relative">
                            <div className="absolute -inset-1 bg-amber-400/30 rounded-full blur"></div>
                            <Trophy className="w-12 h-12 text-amber-100" />
                        </div>

                        {/* Title */}
                        <div className="text-center">
                            <h2 className="text font-bold text-amber-100">Top Dawg Of the Match</h2>
                        </div>
                    </>
                )}

                {/* Winner Info */}
                <div className="text-center space-y-3">
                    <h3 className="text-2xl font-semibold text-white">
                        {winner.athstat_firstname} {winner.athstat_lastname}
                    </h3>
                    <SecondaryText className="text-sm text-amber-100 dark:text-amber-100">
                        {winner.team_name}
                    </SecondaryText>
                </div>
            </div>
        </BlueGradientCard>
    );
}
