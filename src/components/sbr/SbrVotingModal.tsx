import { useState } from "react"
import { ISbrFixture } from "../../types/sbr"
import DialogModal from "../shared/DialogModal"
import SbrTeamLogo from "./SbrTeamLogo"
import { format } from "date-fns"
import { useFixtureVotes } from "../../hooks/useFxitureVotes"
import VotingProgressBar from "../shared/VotingProgressBar"
import SbrVotingBallotBox from "./SbrVotingBallotBox"
import SbrVotingModalNavigator from "./SbrVotingModalNavigator"
import { CircleCheck } from "lucide-react"
import PrimaryButton from "../shared/buttons/PrimaryButton"
import { LoadingState } from "../ui/LoadingState"

type Props = {
    className?: string,
    fixtures: ISbrFixture[],
    open?: boolean,
    onClose?: () => void
}

export default function SbrVotingModal({ fixtures, open, onClose }: Props) {

    const [currIndex, setCurrIndex] = useState<number | undefined>(fixtures.length === 0 ? undefined : 0 );
    const [currentFixture, setCurrentFixture] = useState<ISbrFixture | undefined>(() => {
        if (fixtures.length !== 0) return fixtures[0]
        else return undefined
    });

    const onChangeFixture = (newCurrent: ISbrFixture) => {
        setCurrentFixture(newCurrent);
        setCurrIndex(fixtures.findIndex((f) => f.fixture_id ===newCurrent.fixture_id));
    }

    const onNext = () => {
        
        if (currIndex !== undefined) {
            if (currIndex < fixtures.length) {
                setCurrIndex(currIndex + 1);
                setCurrentFixture(fixtures[currIndex + 1]);
            } else {
                setCurrIndex(undefined);
                setCurrentFixture(undefined);
            }
        }

        console.log("Clicked next");
    }

    const onGoBack = () => {
        if (fixtures.length > 0) {
            const newIndex = fixtures.length - 1;
            setCurrIndex(newIndex);
            setCurrentFixture(fixtures[newIndex]);
        }
    }

    return (
        <DialogModal onClose={onClose}  className="w-full h-[600px] flex flex-col items-center justify-center" open={open} title="Who you got this week?">
            {currentFixture !== undefined && 
            <FixtureVotingCard 
                fixture={currentFixture} 
            />}
            {currentFixture !== undefined && 
                <SbrVotingModalNavigator
                    currentFixture={currentFixture}
                    onClickNext={onNext}
                    fixtures={fixtures}
                    onChange={onChangeFixture}
                />
            }

            {currentFixture === undefined && (
                <div className="flex flex-col items-center gap-4" >
                    <CircleCheck className="text-green-600 w-20 h-20" />
                    <p>Thank you for placing your votes in You are good to go!</p>
                    <PrimaryButton onClick={onClose} >Done 🗸</PrimaryButton>
                    {fixtures.length > 0 && <PrimaryButton onClick={onGoBack} className="dark:bg-slate-800 dark:hover:bg-slate-800/40" >Go Back</PrimaryButton>}
                </div>
            )}

        </DialogModal>
    )
}

type FixtureVotingCardProps = {
    fixture: ISbrFixture
}

function FixtureVotingCard({ fixture }: FixtureVotingCardProps) {

    const { kickoff_time } = fixture;
    const { userVote, votes, homeVotes, awayVotes, isLoading } = useFixtureVotes(fixture);

    console.log("Votes ", votes);

    return (
        <div className="w-[100%] flex flex-col items-center gap-3 justify-center" >

            <div className="flex flex-row w-full items-center" >
                <div className="items-center justify-center text-center flex flex-col flex-1 gap-2" >
                    <SbrTeamLogo className="w-20 h-20" />
                    <p className="text-md" >{fixture.home_team}</p>
                </div>

                <div className="flex-1 flex flex-col items-center justify-center text-slate-400" >
                    <p>{kickoff_time && format(kickoff_time, "hh:mm a")}</p>
                    <p>{kickoff_time && format(kickoff_time, "EE dd MMM")}</p>
                </div>

                <div className="items-center  justify-center text-center flex flex-col flex-1 gap-2" >
                    <SbrTeamLogo className="w-20 h-20" />
                    <p className="text-md" >{fixture.away_team}</p>
                </div>
            </div>

            {isLoading && <LoadingState />}

            {!isLoading && votes && <VotingProgressBar homeVotes={homeVotes.length} awayVotes={awayVotes.length} />}
            {!isLoading && <SbrVotingBallotBox userVote={userVote} fixture={fixture}  />}
        </div>
    )
}
