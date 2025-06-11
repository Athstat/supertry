import { useAtomValue } from "jotai"
import { ISbrFixtureRosterItem } from "../../../types/sbr"
import PrimaryButton from "../../shared/buttons/PrimaryButton"
import SecondaryText from "../../shared/SecondaryText"
import { hasUserSubmittedSbrMotmAtom, userSbrMotmVoteAtom } from "../../../state/sbrMotm.atoms"
import { Check } from "lucide-react"

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

    const hasUserVoted = useAtomValue(hasUserSubmittedSbrMotmAtom);
    const hasUserVotedForCandidated = userVote && userVote.athlete_id === candidate.athlete_id;

    const canVote = !hasUserVotedForCandidated;

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

                {canVote && <div className="border hover:bg-slate-100 hover:dark:bg-slate-800 border-slate-300 dark:border-slate-600 rounded-xl w-10 h-10 items-center flex flex-col justify-center" >
                </div>}

                {hasUserVotedForCandidated && <div className="border bg-gradient-to-br from-primary-500 to-primary-700 border-slate-300 dark:border-primary-600 rounded-xl w-10 h-10 items-center flex flex-col justify-center" >
                    ✓
                </div>}

            </div>
        </div>

    )
}