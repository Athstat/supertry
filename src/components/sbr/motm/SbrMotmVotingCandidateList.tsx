import { ISbrFixtureRosterItem } from "../../../types/sbr"
import PrimaryButton from "../../shared/buttons/PrimaryButton"
import SecondaryText from "../../shared/SecondaryText"

type Props = {
    roster: ISbrFixtureRosterItem[]
}

/** Renders list of possible man of the match voting candidates */
export function SbrMotmVotingCandidateList({ roster }: Props) {
    return (
        <div>
            {roster.map((r) => {
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
                <PrimaryButton className="text-xs w-fit py-1 px-2.5" >
                    Vote
                </PrimaryButton>
            </div>
        </div>

    )
}