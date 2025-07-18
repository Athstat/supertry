import { format } from "date-fns";
import { Calendar, Trophy, Watch } from "lucide-react";
import { ISbrFixture } from "../../../types/sbr";
import { Fragment } from "react/jsx-runtime";
import { twMerge } from "tailwind-merge";
import { useState } from "react";
import { mutate } from "swr";
import { useSbrFixtureVotes } from "../../../hooks/useFixtureVotes";
import { sbrService } from "../../../services/sbr/sbrService";
import { sbrFixtureSummary, getSbrVotingSummary } from "../../../utils/sbrUtils";
import { VotingOptionBar } from "../../shared/bars/VotingOptionBar";
import RoundedCard from "../../shared/RoundedCard";
import NoContentCard from "../../shared/NoContentMessage";

type Props = {
    fixture: ISbrFixture
}

export default function SbrFixtureKickOffInfo({ fixture }: Props) {

    const { kickoff_time, season } = fixture;
    const { homeVotes, awayVotes, userVote, isLoading } = useSbrFixtureVotes(fixture);
    const { home_team, away_team } = fixture;

    const [isVoting, setIsVoting] = useState(false);

    const onVote = async (side: "home_team" | "away_team") => {
        // if user has voted before use put request
        // else use post request

        if (hasKickedOff) {
            return;
        }

        setIsVoting(true);

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

    const handleClickHomeVoteBar = () => {
        onVote("home_team");
    }

    const handleClickAwayVoteBar = () => {
        onVote("away_team");
    }

    const gameCompleted = fixture.status === "completed";

    const { hasKickedOff, homeTeamWon, awayTeamWon } = sbrFixtureSummary(fixture);
    const { homePerc, awayPerc, votedAwayTeam, votedHomeTeam } = getSbrVotingSummary(fixture, userVote)

    const hasUserVoted = votedAwayTeam || votedHomeTeam;

    const isNoKickoffInfo = season === undefined && kickoff_time === undefined

    return (
        <div>
            <RoundedCard className="p-4 flex flex-col gap-2" >

                <h1 className="text-md font-bold" >Kick Off</h1>

                { kickoff_time && <div className="flex flex-row items-center mt-3 gap-2" >
                    <Watch className="text-blue-500" />
                    {kickoff_time && <p>{format(kickoff_time, "hh:mm a")}</p>}
                </div>}

                {kickoff_time && <div className="flex flex-row items-center gap-2" >
                    <Calendar className="text-blue-500" />
                    {kickoff_time && <p>{format(kickoff_time, "EEEE dd MMMM yyyy")}</p>}
                </div>}

                { season && <div className="flex flex-row items-center gap-2" >
                    <Trophy className="text-blue-500" />
                    <p>{season}</p>
                </div>}

                {isNoKickoffInfo && (
                    <NoContentCard message="No Kickoff Information Available" />
                )}
            </RoundedCard>

            {isLoading && (
                <div className="w-full h-20 bg-slate-200 dark:bg-slate-800/40 animate-pulse rounded-xl" >

                </div>
            )}

            {!isLoading && <div
                className={twMerge(
                    "flex mt-6 flex-col w-full gap-3 items-center justify-center",
                    isVoting && "animate-pulse opacity-60 cursor-progress"
                )}
            >
                {/* Home Team Voting Station */}

                {!hasUserVoted && !hasKickedOff && <div className="flex flex-col w-full gap-2 items-center text-sm justify-center text-slate-700 dark:text-slate-400" >
                    <p>Who you got winning?</p>

                    <button onClick={handleClickHomeVoteBar} className="border dark:border-slate-700 w-full px-2 rounded-xl bg-slate-200 py-2 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700" >
                        {home_team}
                    </button>

                    <button onClick={handleClickAwayVoteBar} className="border dark:border-slate-700 w-full px-2 rounded-xl bg-slate-200 py-2 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700" >
                        {away_team}
                    </button>

                </div>}

                {/* Post Match Voting Results */}

                {(hasUserVoted || hasKickedOff) && <Fragment>
                    <VotingOptionBar
                        hasUserVoted={votedHomeTeam}
                        voteCount={homeVotes.length}
                        votePercentage={homePerc}
                        title={`${home_team} Win`}
                        onClick={handleClickHomeVoteBar}
                        isGreen={votedHomeTeam && gameCompleted && homeTeamWon}
                        isRed={votedHomeTeam && gameCompleted && awayTeamWon}
                        disable={isVoting}
                    />
                    <VotingOptionBar
                        hasUserVoted={votedAwayTeam}
                        voteCount={awayVotes.length}
                        votePercentage={awayPerc}
                        title={`${away_team} Win`}
                        onClick={handleClickAwayVoteBar}
                        isGreen={votedAwayTeam && gameCompleted && awayTeamWon}
                        isRed={votedAwayTeam && gameCompleted && homeTeamWon}
                        disable={isVoting}
                    />
                </Fragment>}

            </div>}
        </div>
    )
}
