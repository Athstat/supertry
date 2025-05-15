import { useState } from "react"
import { sbrService } from "../../services/sbrService"
import { ISbrFixture, ISbrFixtureVote } from "../../types/sbr"
import { Loader } from "lucide-react"
import { mutate } from "swr"

type Props = {
    userVote?: ISbrFixtureVote,
    fixture: ISbrFixture,
    refresh?: () => void
}

export default function SbrVotingBallotBox({ fixture, userVote, refresh }: Props) {

    const [isVoting, setIsVoting] = useState(false);
    const [isVoitngHome, setIsVotingHome] = useState(false);
    const [reactFixture, setReactFixture] = useState(fixture);

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
        <div className="w-full p-4 " >

            <p>User Vote: {userVote?.vote_for}</p>

            <div className="flex flex-row w-full items-center justify-between" >

                {/* Home Vote Button */}
                {<div className="flex flex-row items-center justify-start" >
                    <button  
                        disabled={hasVotedHome || isVoting}
                        onClick={() => onVote("home_team")}
                        className="bg-red-600 h-10 hover:bg-red-700 rounded-xl px-10 text-lg"
                    >
                        {isVoting && isVoitngHome ? <Loader className="w-4 h-4 animate-spin" /> : <p>Vote</p>}
                    </button>
                </div>}
                {/* Away Vote Buttton */}

                <div className="flex flex-row items-center justify-end" >
                    <button 
                        disabled={hasVotedAway || isVoting}
                        onClick={() => onVote("away_team")}
                        className="bg-blue-600 h-10 hover:bg-blue-700 rounded-xl px-10 text-lg " 
                    >
                        {isVoting && !isVoitngHome ? <Loader className="w-4 h-4 animate-spin" /> : <p>Vote</p>}
                    </button>
                </div>
            </div>
        </div>
    )
}

