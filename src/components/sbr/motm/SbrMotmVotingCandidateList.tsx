import { useAtom, useAtomValue } from "jotai"
import { ISbrFixtureRosterItem } from "../../../types/sbr"
import SecondaryText from "../../shared/SecondaryText"
import { hasUserSubmittedSbrMotmAtom, isSendingSbrMotmVoteAtom, userSbrMotmVoteAtom } from "../../../state/sbrMotm.atoms"
import { sbrMotmService } from "../../../services/sbrMotmService"
import { mutate } from "swr"
import { swrFetchKeys } from "../../../utils/swrKeys"
import { useState } from "react"
import { Loader } from "lucide-react"

type Props = {
    roster: ISbrFixtureRosterItem[]
}

/** Renders list of possible man of the match voting candidates */
export function SbrMotmVotingCandidateList({ roster }: Props) {
    return (
        <div>
            {roster
                .sort((a, b) => {
                    return (a.jersey_number ?? 0) - (b.jersey_number ?? 0)
                })
                .map((r) => {
                    return <SbrMotmVotingCandidateListItem
                        candidate={r}
                        key={r.athlete_id}
                    />
                })}
        </div>
    )
}

type ItemProps = {
    candidate: ISbrFixtureRosterItem
}

export function SbrMotmVotingCandidateListItem({ candidate }: ItemProps) {

    const userVote = useAtomValue(userSbrMotmVoteAtom);
    const [, setIsSendingVote] = useAtom(isSendingSbrMotmVoteAtom);
    const [isLoading, setIsLoading] = useState(false);

    const hasUserVoted = useAtomValue(hasUserSubmittedSbrMotmAtom);
    const hasUserVotedForCandidated = userVote && userVote.athlete_id === candidate.athlete_id;

    const onVote = async () => {
        setIsSendingVote(true);
        setIsLoading(true);

        console.log("Has the user voted??? ", userVote);

        if (hasUserVoted) {
            await sbrMotmService.changeMotmVote(
                candidate.fixture_id,
                candidate.athlete_id,
                candidate.team_id
            );
        } else {
            await sbrMotmService.postMotmVote(
                candidate.fixture_id,
                candidate.athlete_id,
                candidate.team_id
            );
        }

        // Revalidate user vote cache
        
        const fetchKey = swrFetchKeys.getSbrUserMotmVoteKey(candidate.fixture_id);
        await mutate(fetchKey);

        setIsSendingVote(false);
        setIsLoading(false);
    }

    return (

        <div className="flex gap-3 p-2 flex-row items-center" >

            <div className="w-[10%]" >
                <p>{candidate.jersey_number || "-"}</p>
            </div>

            <div className="flex  w-[50%] flex-col items-start" >
                <p>{candidate.athlete_first_name}</p>
                <SecondaryText className="text-xs md:text-sm" >{candidate.position ?? ""}</SecondaryText>
            </div>

            <div className="w-[40%] flex flex-row items-center justify-end" >

                {!hasUserVotedForCandidated && <button onClick={onVote} className="border hover:bg-slate-100 hover:dark:bg-slate-800 border-slate-300 dark:border-slate-600 rounded-xl w-10 h-10 items-center flex flex-col justify-center" >
                    {isLoading && <Loader className="text-slate-700 dark:text-slate-400 w-4 h-4 animate-spin" />}
                </button>}

                {hasUserVotedForCandidated && <div className="border bg-gradient-to-br text-white from-primary-500 to-primary-700 border-slate-300 dark:border-primary-600 rounded-xl w-10 h-10 items-center flex flex-col justify-center" >
                    ✓
                </div>}

            </div>
        </div>

    )
}