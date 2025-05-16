import { useFetch } from "../../../hooks/useFetch"
import { useFixtureVotes } from "../../../hooks/useFxitureVotes"
import { sbrService } from "../../../services/sbrService"
import { ISbrFixture } from "../../../types/sbr"
import { calculatePerc, createEmptyArray } from "../../../utils/fixtureUtils"
import SbrTeamLogo from "../fixtures/SbrTeamLogo"

type Props = {
    fixtures: ISbrFixture[]
}

export default function SbrPersonalVotingSummary({ fixtures }: Props) {

    

    return (
        <div className="w-full flex flex-col gap-3" >
            <h1 className="text-md font-bold" >Your Voting Summary 👀</h1>
            <div className="grid grid-cols-1 gap-1" >
                {fixtures.map((fixture, index) => {
                    return <SummaryItem
                        fixture={fixture}
                        key={index}
                    />
                })}
            </div>
        </div>
    )
}

type SummaryItemProps = {
    fixture: ISbrFixture
}

export function SummaryItem({ fixture }: SummaryItemProps) {

    const { userVote, isLoading } = useFixtureVotes(fixture);

    if (isLoading) {
        return (
            <div className="bg-slate-200 dark:bg-slate-800/40 animate-pulse h-5 rounded-xl w-full" >

            </div>
        )
    }

    const homeVotes = Number.parseInt(fixture.home_votes.toString());
    const awayVotes = Number.parseInt(fixture.away_votes.toString());
    const total = homeVotes + awayVotes;
    const homePerc = calculatePerc(homeVotes, total);
    const awayPerc = calculatePerc(awayVotes, total);

    if (total === 0 || !userVote) return;

    return (
        <div className="p-3 border w-full grid grid-cols-1 gap-2 rounded-xl border-slate-200 bg-slate-100 dark:bg-slate-800/50 dark:border-slate-800/50" >

            {/* Team Row */}
            <div className="flex flex-row text-xs items-center justify-start gap-1" >
                <div className="flex-1 flex flex-row gap-1 items-center justify-start overflow-hidden w-max" >
                    {/* <SbrTeamLogo className="w-5 h-5" teamName={fixture.home_team} /> */}
                    <p className="truncate" >{fixture.home_team}</p>
                </div>
                <div className="flex-1 items-center justify-center flex flex-col" >
                    <p>VS</p>
                </div>
                <div className="flex-1 flex items-center justify-end overflow-hidden w-max" >
                    {/* <SbrTeamLogo className="w-5 h-5" teamName={fixture.home_team} /> */}
                    <p className="truncate" >{fixture.away_team}</p>
                </div>
            </div>

            {/* Progress Bars */}
            <div className="flex flex-row rounded-xl overflow-hidden w-[100%]">
                <div
                    className="bg-slate-900 h-4 dark:bg-slate-800"
                    style={{ width: `${homePerc}%` }}
                />
                <div
                    className="bg-primary-700 h-4"
                    style={{ width: `${awayPerc}%` }}
                />

            </div>

            <div className="flex text-xs flex-row items-center" >
                <div className="flex-1 flex gap-1 flex-row items-center justify-start" >
                    {userVote.vote_for === "home_team" && (
                        <div className="px-2 text-xs rounded-xl bg-slate-white dark:bg-slate-700" >
                            <p>You</p>
                        </div>
                    )}
                    <p className="dark:text-slate-400 text-slate-700" >{homeVotes} Votes</p>
                </div>

                <div className="flex-1 flex gap-1 flex-row items-center justify-end" >
                    {userVote.vote_for === "away_team" && (
                        <div className="px-2 text-xs rounded-xl bg-slate-white dark:bg-primary-700" >
                            <p>You</p>
                        </div>
                    )}
                    <p className="dark:text-slate-400 text-slate-700" >{awayVotes} Votes</p>
                </div>
            </div>

        </div>
    )
}

