import { twMerge } from "tailwind-merge";
import { IFixture, IGameVote } from "../../../types/games";
import { IProTeam } from "../../../types/team";
import SecondaryText from "../../ui/typography/SecondaryText";
import TeamLogo from "../../team/TeamLogo";
import { useProVoting } from "../../../hooks/fixtures/useProVoting";
import { Activity } from "react";
import { fixtureSummary } from "../../../utils/fixtureUtils";
import { CircleCheck, XCircle } from "lucide-react";
import RoundedCard from "../../ui/cards/RoundedCard";

type Props = {
    fixture: IFixture;
    className?: string;
};

/** Renders  Standalone Voting */
export function FixtureVotingCard({ fixture }: Props) {

    const { team, opposition_team } = fixture;

    const {
        isLoading, homeVotes, awayVotes,
        isVoting, handleVote,
        homePerc, awayPerc, userVote, 
        isTbdGame, wasVoteCorrect
    } = useProVoting(fixture);

    const { gameKickedOff } = fixtureSummary(fixture);

    const homeVotesCount = homeVotes.length;
    const awayVotesCount = awayVotes.length;

    const totalVotes = homeVotesCount + awayVotesCount;

    if (!team || !opposition_team || isTbdGame) {
        return;
    }

    if (isLoading) {
        return (
            <RoundedCard className={twMerge(
                "w-full h-[140px] border-none animate-pulse"
            )} >

            </RoundedCard>
        )
    }

    if (totalVotes === 0 && gameKickedOff) {
        return null;
    }

    return (
        <RoundedCard className={twMerge(
            'p-4 flex flex-col justify-center max-h-[140px] dark:border-none gap-4',
            isVoting && "opacity-30"
        )} >

            <div className='flex flex-row text-sm items-center justify-between' >
                <div>
                    {!gameKickedOff && <p className="font-semibold" >Who you got winning?</p>}
                    {gameKickedOff && <p className="font-semibold" >Fan Predictions</p>}
                </div>

                <div>
                    <SecondaryText>Votes Made: {totalVotes}</SecondaryText>
                </div>
            </div>

            <Activity mode={gameKickedOff ? "hidden" : "visible"} >

                <div className='flex flex-row items-center gap-2' >
                    <VotingOption
                        isVoting={isVoting}
                        team={team}
                        className=""
                        onClick={() => handleVote("home_team")}
                        isHome

                        userVote={userVote}
                        homePerc={homePerc}
                        awayPerc={awayPerc}
                    />

                    <VotingOption
                        isVoting={isVoting}
                        team={opposition_team}
                        className=""
                        onClick={() => handleVote("away_team")}

                        userVote={userVote}
                        homePerc={homePerc}
                        awayPerc={awayPerc}
                    />
                </div>

            </Activity>

            <Activity mode={gameKickedOff ? "visible" : "hidden"} >
                <VotingResults
                    homePerc={homePerc}
                    awayPerc={awayPerc}
                    userVote={userVote}
                    wasVoteCorrect={wasVoteCorrect}
                />
            </Activity>


        </RoundedCard>
    )
}

type VotingOptionProps = {
    team: IProTeam,
    className?: string,
    onClick?: () => void,
    isVoting?: boolean,
    homePerc?: number
    awayPerc?: number,
    userVote?: IGameVote,
    isHome?: boolean
}

function VotingOption({ team, className, onClick, isVoting, userVote, awayPerc, homePerc, isHome }: VotingOptionProps) {

    const handleOnClick = () => {
        if (onClick && !isVoting) {
            onClick();
        }
    }

    const hasUserVoted = Boolean(userVote);
    const isVoteCurrent = hasUserVoted && ( (userVote?.vote_for === "home_team" && isHome) || (userVote?.vote_for === "away_team" && !isHome))

    const votePer = isHome ? homePerc : awayPerc;

    return (
        <button

            className={twMerge(
                "flex flex-row items-center border hover:dark:bg-slate-800 dark:border-slate-600 rounded-xl gap-2 flex-1 justify-center p-2",
                className,
                isVoting && "animate-pulse opacity-35",
                isVoteCurrent && "bg-blue-500 text-white dark:bg-blue-500 hover:dark:bg-blue-500 dark:border-blue-400 border-blue-500"
            )}

            onClick={handleOnClick}
        >
            <TeamLogo url={team.image_url} className="w-5 h-5" />
            <p className="text-sm" >{hasUserVoted ? `${votePer}%` : team.athstat_name}</p>
        </button>
    )
}

type VotingResultsProp = {
    homePerc?: number,
    awayPerc?: number,
    userVote?: IGameVote,
    wasVoteCorrect?: boolean
}

function VotingResults({ homePerc, awayPerc, userVote, wasVoteCorrect }: VotingResultsProp) {

    return (
        <div className="flex flex-col gap-2" >
            <div className="flex flex-row items-center gap-1" >
                <div
                    style={{ width: `${homePerc}%` }}
                    className="bg-blue-500 text-white min-w-[35px] rounded-md flex-row flex px-2 h-[26px] items-center justify-center"
                >
                    <p className="text-sm" >{homePerc}%</p>
                </div>

                <div
                    style={{ width: `${awayPerc}%` }}
                    className="bg-red-500 text-white min-w-[35px] rounded-md flex-row flex px-2 h-[26px] items-center justify-center"
                >
                    <p className="text-sm" >{awayPerc}%</p>
                </div>
            </div>

            {userVote &&
                <div className="flex flex-row items-center justify-between" >
                    <div className="flex flex-row items-center gap-1" >
                        <div className={twMerge(
                            "w-4 h-4 rounded-md",
                            userVote.vote_for === "home_team" ? "bg-blue-500" : "bg-red-500"
                        )} ></div>
                        <p>Your Vote</p>
                    </div>

                    <div className={twMerge(
                        "flex flex-row items-center gap-1",
                        "text-slate-700 dark:text-slate-400",
                        wasVoteCorrect && "text-green-500 dark:text-green-400 font-bold"
                    )} >
                        <p className="text-sm" >{wasVoteCorrect ? "Correct" : "Wrong"}</p>
                        {wasVoteCorrect ?  <CircleCheck className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                    </div>
                </div>
            }
        </div>
    )
}