import { useAtom, useAtomValue } from "jotai";
import { IRosterItem } from "../../../types/games";
import SecondaryText from "../../shared/SecondaryText";
import { 
    hasUserSubmittedProMotmAtom, 
    isSendingProMotmVoteAtom, 
    proGameMotmVotesAtom, 
    userProMotmVoteAtom,
    currentProGameAtom
} from "../../../state/proMotm.atoms";
import { proMotmService } from "../../../services/proMotmService";
import { mutate } from "swr";
import { useState } from "react";
import { Loader } from "lucide-react";
import { getProAthleteMotmVoteTally } from "../../../utils/proMotmUtils";
import { useAuth } from "../../../contexts/AuthContext";
import PlayerMugshot from "../../shared/PlayerMugshot";
import { formatPosition } from "../../../utils/athleteUtils";
import { fixtureAnalytics } from "../../../services/analytics/fixtureAnalytics";

type Props = {
    roster: IRosterItem[];
}

/** Renders list of possible man of the match voting candidates */
export function ProMotmVotingCandidateList({ roster }: Props) {
    return (
        <div>
            {roster
                .sort((a, b) => {
                    return (a.player_number ?? 0) - (b.player_number ?? 0);
                })
                .map((r) => {
                    return <ProMotmVotingCandidateListItem
                        candidate={r}
                        key={r.athlete.tracking_id}
                    />;
                })}
        </div>
    );
}

type ItemProps = {
    candidate: IRosterItem;
}

export function ProMotmVotingCandidateListItem({ candidate }: ItemProps) {
    const userVote = useAtomValue(userProMotmVoteAtom);
    const [, setIsSendingVote] = useAtom(isSendingProMotmVoteAtom);
    const [isLoading, setIsLoading] = useState(false);
    const gameId = useAtomValue(currentProGameAtom);

    const allVotes = useAtomValue(proGameMotmVotesAtom);

    const candidateVoteTally = getProAthleteMotmVoteTally(allVotes, candidate.athlete.tracking_id);

    const hasUserVoted = useAtomValue(hasUserSubmittedProMotmAtom);
    const hasUserVotedForCandidate = userVote && userVote.athlete_id === candidate.athlete.tracking_id;

    const {authUser} = useAuth();

    const onVote = async () => {
        if (!gameId) return;
        

        setIsSendingVote(true);
        setIsLoading(true);

        const userId = authUser?.kc_id ?? "fallback-id";

        try {
            if (hasUserVoted) {
                await proMotmService.editUserGameVote(gameId, userId, {
                    athlete_id: candidate.athlete.tracking_id,
                    team_id: candidate.team_id
                });
            } else {
                await proMotmService.createVote({
                    game_id: gameId,
                    user_id: userId,
                    athlete_id: candidate.athlete.tracking_id,
                    team_id: candidate.team_id
                });
            }

            fixtureAnalytics.trackPlacedMotmVote(candidate.game_id, candidate.athlete.tracking_id);

            // Revalidate vote cache
            const fetchKey = `pro-game-motm-votes/${gameId}`;
            await mutate(fetchKey);
        } catch (error) {
            console.error("Error voting:", error);
        } finally {
            setIsSendingVote(false);
            setIsLoading(false);
        }
    };

    return (
        <div onClick={onVote} className="flex cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl gap-3 p-2 flex-row items-center">
            <div className="border dark:border-slate-700 bg-slate-100 dark:bg-slate-800 w-10 h-10 items-center justify-center flex flex-col rounded-xl">
                <p>{candidate.player_number || "-"}</p>
            </div>

            <div>
                <PlayerMugshot 
                    playerPr={candidate.athlete.power_rank_rating}
                    url={candidate.athlete.image_url}
                    showPrBackground
                />
            </div>

            <div className="flex w-[50%] flex-col items-start">
                <p>{candidate.athlete.athstat_firstname} {candidate.athlete.athstat_lastname}</p>
                <SecondaryText className="text-xs md:text-sm flex flex-col gap-1">
                    {!hasUserVoted ? (candidate.athlete.position_class ? formatPosition(candidate.athlete.position_class) : "")  : null}
                    {hasUserVoted && (
                        <p className="">
                            {candidateVoteTally} {candidateVoteTally === 1 ? "Vote" : "Votes"}
                        </p>
                    )}
                </SecondaryText>
            </div>

            <div className="w-[40%] flex flex-row items-center justify-end">
                {!hasUserVotedForCandidate && (
                    <div
                        onClick={onVote} 
                        className="border-2 hover:bg-slate-100 hover:dark:bg-slate-800 border-slate-400 dark:border-slate-500 rounded-xl w-10 h-10 items-center flex flex-col justify-center"
                    >
                        {isLoading && <Loader className="text-slate-700 dark:text-slate-400 w-4 h-4 animate-spin" />}
                    </div>
                )}

                {hasUserVotedForCandidate && (
                    <div className="border bg-gradient-to-br text-white from-primary-500 to-primary-700 border-slate-300 dark:border-primary-600 rounded-xl w-10 h-10 items-center flex flex-col justify-center">
                        ✓
                    </div>
                )}
            </div>
        </div>
    );
}
