import { useState } from "react"
import { sbrService } from "../../services/sbrService"
import { ISbrFixture, ISbrFixtureVote } from "../../types/sbr"
import { Loader } from "lucide-react"
import { mutate } from "swr"
import { twMerge } from "tailwind-merge"

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
                            "bg-slate-900 dark:bg-slate-800 text-white h-10 hover:bg-slate-950 dark:hover:bg-slate-900 rounded-xl px-10 text-lg font-medium transition-colors",
                            hasVotedHome && "opacity-50 cursor-not-allowed hover:bg-primary-600 dark:hover:bg-primary-700"
                        )}
                    >
                        {isVoting && isVoitngHome ? <Loader className="w-4 h-4 animate-spin" /> : <p>Vote</p>}
                    </button>
                </div>}

                {/* Away Vote Button */}
                <div className="flex flex-row items-center justify-end">
                    <button 
                        disabled={hasVotedAway || isVoting}
                        onClick={() => onVote("away_team")}
                        className={twMerge(
                            "bg-primary-600 dark:bg-primary-700 text-white h-10 hover:bg-primary-700 dark:hover:bg-primary-800 rounded-xl px-10 text-lg font-medium transition-colors",
                            hasVotedAway && "opacity-50 cursor-not-allowed hover:bg-primary-600 dark:hover:bg-primary-700"
                        )}
                    >
                        {isVoting && !isVoitngHome ? <Loader className="w-4 h-4 animate-spin" /> : <p>Vote</p>}
                    </button>
                </div>
            </div>
        </div>
    )
}

