import { twMerge } from "tailwind-merge";
import { IFixture, IGameVote } from "../../../types/games";
import { IProTeam } from "../../../types/team";
import RoundedCard from "../../shared/RoundedCard";
import SecondaryText from "../../shared/SecondaryText";
import TeamLogo from "../../team/TeamLogo";
import { useProVoting } from "../../../hooks/fixtures/useProVoting";
import { Activity } from "react";

type Props = {
    fixture: IFixture;
    className?: string;
};

/** Renders  Standalone Voting */
export function FixtureVotingCard({ fixture }: Props) {

    const { team, opposition_team } = fixture;
    const {
        isLoading, homeVotes, awayVotes,
        isVoting, handleVote, hasUserVoted,
        homePerc, awayPerc, userVote
    } = useProVoting(fixture);

    const homeVotesCount = homeVotes.length;
    const awayVotesCount = awayVotes.length;

    const totalVotes = homeVotesCount + awayVotesCount;

    if (!team || !opposition_team) {
        return;
    }

    if (isLoading) {
        return (
            <RoundedCard className="w-full h-[100px] border-none animate-pulse" >

            </RoundedCard>
        )
    }

    return (
        <RoundedCard className={twMerge(
            'p-3 flex flex-col justify-center h-[100px] border-none gap-2',
            isVoting && "opacity-30"
        )} >

            <div className='flex flex-row text-sm items-center justify-between' >
                <div>
                    <p className="font-semibold" >Who you got winning?</p>
                </div>

                <div>
                    <SecondaryText>Votes Made: {totalVotes}</SecondaryText>
                </div>
            </div>

            <Activity mode={hasUserVoted ? "hidden" : "visible"} >

                <div className='flex flex-row items-center gap-2' >
                    <VotingOption
                        isVoting={isVoting}
                        team={team}
                        className=""
                        onClick={() => handleVote("home_team")}
                    />

                    <VotingOption
                        isVoting={isVoting}
                        team={opposition_team}
                        className=""
                        onClick={() => handleVote("away_team")}
                    />
                </div>

            </Activity>

            <Activity mode={hasUserVoted ? "visible" : "hidden"} >
                <VotingResults
                    homePerc={homePerc}
                    awayPerc={awayPerc}
                    userVote={userVote}
                />
            </Activity>


        </RoundedCard>
    )
}

type VotingOptionProps = {
    team: IProTeam,
    className?: string,
    onClick?: () => void,
    isVoting?: boolean
}

function VotingOption({ team, className, onClick, isVoting }: VotingOptionProps) {

    const handleOnClick = () => {
        if (onClick && !isVoting) {
            onClick();
        }
    }

    return (
        <button
            className={twMerge(
                "flex flex-row items-center border hover:dark:bg-slate-800 dark:border-slate-600 rounded-xl gap-2 flex-1 justify-center p-2",
                className,
                isVoting && "animate-pulse opacity-35"
            )}

            onClick={handleOnClick}
        >
            <TeamLogo url={team.image_url} className="w-5 h-5" />
            <p className="text-sm" >{team.athstat_name}</p>
        </button>
    )
}

type VotingResultsProp = {
    homePerc?: number,
    awayPerc?: number,
    userVote?: IGameVote
}

function VotingResults({ homePerc, awayPerc, userVote }: VotingResultsProp) {

    return (
        <div className="flex flex-col gap-2" >
            <div className="flex flex-row items-center gap-1" >
                <div
                    style={{ width: `${homePerc}%` }}
                    className="bg-blue-500 rounded-md flex-row flex px-2 items-center justify-center"
                >
                    <p>{homePerc}%</p>
                </div>

                <div
                    style={{ width: `${awayPerc}%` }}
                    className="bg-red-500 rounded-md flex-row flex px-2 items-center justify-center"
                >
                    <p>{awayPerc}%</p>
                </div>
            </div>

            {userVote &&
                <div>
                    <div className="flex flex-row items-center gap-1" >
                        <div className={twMerge(
                            "w-4 h-4 rounded-md",
                            userVote.vote_for === "home_team" ? "bg-blue-500" : "bg-red-500"
                        )} ></div>
                        <p>Your Vote</p>
                    </div>
                </div>
            }
        </div>
    )
}