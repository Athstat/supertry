import { useState } from "react"
import { ISbrFixture } from "../../../types/sbr"
import DialogModal from "../../shared/DialogModal"
import SbrTeamLogo from "../fixtures/SbrTeamLogo"
import { format } from "date-fns"
import { useFixtureVotes } from "../../../hooks/useFxitureVotes"
import VotingProgressBar from "../../shared/VotingProgressBar"
import SbrVotingBallotBox from "./SbrVotingBallotBox"
import { CircleCheck } from "lucide-react"
import PrimaryButton from "../../shared/buttons/PrimaryButton"
import { LoadingState } from "../../ui/LoadingState"
import { getCountryEmojiFlag } from "../../../utils/svrUtils"
import SbrVotingModalNavigator from "./SbrVotingModalNavigator"

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
        <DialogModal onClose={onClose}  className="w-full h-[600px] flex flex-col items-center justify-center" open={open} title="Who you got winning this week?">
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
                <div className="flex flex-col items-center gap-4">
                    <CircleCheck className="text-primary-500 dark:text-primary-400 w-20 h-20" />
                    <p className="text-gray-700 dark:text-gray-300">Thank you for placing your votes! You are good to go!</p>
                    <PrimaryButton onClick={onClose}>Done</PrimaryButton>
                    {fixtures.length > 0 && (
                        <button 
                            onClick={onGoBack} 
                            className="w-full px-4 py-2 rounded-xl font-semibold text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-dark-800/40 hover:bg-gray-200 dark:hover:bg-dark-700 transition-colors"
                        >
                            Go Back
                        </button>
                    )}
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
        <div className="w-[100%] flex flex-col items-center gap-3 justify-center">
            
            <div>
                <p>{fixture.season} {getCountryEmojiFlag(fixture.country ?? "")}</p>
            </div>
            
            <div className="flex flex-row w-full items-center">
                <div className="items-center justify-center text-center flex flex-col flex-1 gap-2">
                    <SbrTeamLogo teamName={fixture.home_team} className="w-20 h-20" />
                    <p className="text-md font-medium text-gray-800 dark:text-gray-200">{fixture.home_team}</p>
                </div>

                <div className="flex-1 flex flex-col items-center justify-center text-gray-500 dark:text-gray-400">
                    {/* <p>{kickoff_time && format(kickoff_time, "hh:mm a")}</p> */}
                    <p className="" >VS</p>
                    <p>{kickoff_time && format(kickoff_time, "EE dd MMM")}</p>
                </div>

                <div className="items-center justify-center text-center flex flex-col flex-1 gap-2">
                    <SbrTeamLogo teamName={fixture.away_team} className="w-20 h-20" />
                    <p className="text-md font-medium text-gray-800 dark:text-gray-200">{fixture.away_team}</p>
                </div>
            </div>

            {isLoading && <LoadingState />}

            {!isLoading && votes && <VotingProgressBar homeVotes={homeVotes.length} awayVotes={awayVotes.length} />}
            {!isLoading && <SbrVotingBallotBox userVote={userVote} fixture={fixture} />}
        </div>
    )
}
