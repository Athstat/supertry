import { useState } from "react"
import { sbrService } from "../../../services/sbrService"
import { ISbrFixture, ISbrFixtureVote } from "../../../types/sbr"
import { Check, CircleCheck, Loader, XIcon } from "lucide-react"
import { mutate } from "swr"
import { twMerge } from "tailwind-merge"
import { sbrFxitureSummary } from "../../../utils/sbrUtils"

type Props = {
    userVote?: ISbrFixtureVote,
    fixture: ISbrFixture
}

export default function SbrVotingBallotBox({ fixture, userVote }: Props) {

    const [isVoting, setIsVoting] = useState(false);
    const [isVoitngHome, setIsVotingHome] = useState(false);

    const onVote = async (side: "home_team" | "away_team") => {
        // if user has voted before use put request
        // else use post request

        setIsVoting(true);

        setIsVotingHome(side === "home_team")

        if (!userVote) {
            await sbrService.postSbrFixtureVote(
                fixture.fixture_id,
                side
            );
        } else {
            await sbrService.putSbrFixtureVote(
                fixture.fixture_id,
                side
            );
        }

        setIsVoting(false);

        await mutate(() => true);
    }

    const hasVotedHome = userVote?.vote_for === "home_team";
    const hasVotedAway = userVote?.vote_for === "away_team";


    return (
        <div className="w-full p-4">
            <div className="flex flex-row w-full items-center justify-between">
                {/* Home Vote Button */}
                {<div className="flex flex-row items-center justify-start">
                    <button
                        disabled={hasVotedHome || isVoting}
                        onClick={() => onVote("home_team")}
                        className={twMerge(
                            "bg-slate-900 dark:bg-slate-800 text-white h-10 hover:bg-slate-950 dark:hover:bg-slate-900 rounded-xl px-6 text-lg font-medium transition-colors flex items-center gap-1",
                            hasVotedHome && ""
                        )}
                    >
                        {isVoting && isVoitngHome ? (
                            <Loader className="w-4 h-4 animate-spin" />
                        ) : (
                            <>
                                {hasVotedHome && <Check className="w-4 h-4" />}
                                <span>{hasVotedHome ? 'Voted' : 'Vote'}</span>
                            </>
                        )}
                    </button>
                </div>}

                {/* Away Vote Button */}
                <div className="flex flex-row items-center justify-end">
                    <button
                        disabled={hasVotedAway || isVoting}
                        onClick={() => onVote("away_team")}
                        className={twMerge(
                            "bg-primary-600 dark:bg-primary-700 text-white h-10 hover:bg-primary-700 dark:hover:bg-primary-800 rounded-xl px-6 text-lg font-medium transition-colors flex items-center gap-1",
                            hasVotedAway && ""
                        )}
                    >
                        {isVoting && !isVoitngHome ? (
                            <Loader className="w-4 h-4 animate-spin" />
                        ) : (
                            <>
                                {hasVotedAway && <Check className="w-4 h-4" />}
                                <span>{hasVotedAway ? 'Voted' : 'Vote'}</span>
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    )
}


export function SbrVotingBallotBoxResults({ fixture, userVote }: Props) {

    const [isVoting, setIsVoting] = useState(false);
    const [isVoitngHome, setIsVotingHome] = useState(false);

    const hasVotedHome = userVote?.vote_for === "home_team";
    const hasVotedAway = userVote?.vote_for === "away_team";

    const { homeTeamWon, awayTeamWon } = sbrFxitureSummary(fixture);


    return (
        <div className="w-full p-4">
            <div className="flex flex-row w-full items-center justify-between">
                {/* Home Vote Button */}
                {<div className="flex flex-row items-center justify-start">
                    {homeTeamWon && hasVotedHome && (
                        <CorrectIndicator />
                    )}

                    {awayTeamWon && hasVotedHome && (
                        <WrongIndicator />
                    )}
                </div>}

                {/* Away Vote Button */}
                <div className="flex flex-row items-center justify-end">
                    {awayTeamWon && hasVotedAway && (
                        <CorrectIndicator />
                    )}

                    {homeTeamWon && hasVotedAway && (
                        <WrongIndicator />
                    )}
                </div>
            </div>
        </div>
    )
}

function CorrectIndicator() {
    return (
        <>
            <div className="flex flex-row items-center px-2 py-1 gap-1 bg-green-500 text-white rounded-xl" >
                <p>Correct</p>
                <CircleCheck className="w-4 h-4" />
            </div>
        </>
    )
}

function WrongIndicator() {
    return (
        <>
            <div className="flex flex-row items-center px-2 py-1 gap-1 bg-red-500 text-white rounded-xl" >
                <p>Wrong</p>
                <XIcon className="w-4 h-4" />
            </div>
        </>
    )
}