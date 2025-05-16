import { format } from "date-fns"
import { ISbrFixture } from "../../types/sbr"
import SbrTeamLogo from "./fixtures/SbrTeamLogo"
import { twMerge } from "tailwind-merge"
import { getCountryEmojiFlag } from "../../utils/svrUtils"

type Props = {
    fixture: ISbrFixture,
    showLogos?: boolean,
    showCompetition?: boolean,
    className?: string,
    showKickOffTime?: boolean
}

export default function SbrFixtureCard({ fixture, showLogos, showCompetition, className, showKickOffTime }: Props) {

    const { kickoff_time } = fixture;

    return (
        <div
            className={twMerge(
                " dark:hover:bg-slate-800/70 hover:bg-slate-200 dark:bg-slate-800/40 bg-white rounded-xl border dark:border-slate-800/60 p-4",
                className
            )}
        >

            <div className="text-center w-full flex flex-col items-center justify-center text-xs text-slate-700 dark:text-slate-400" >
                {showCompetition && fixture.season && <p>{fixture.season}</p>}
            </div>

            <div
                className="flex flex-row"
            >
                {/* Home Team */}
                <div className="flex-1 flex gap-2 flex-col items-center justify-start" >
                    {showLogos && <SbrTeamLogo className="lg:w-14 lg:h-14" teamName={fixture.home_team} />}
                    <p className="text-xs lg-text-sm truncate" >{fixture.home_team}</p>
                </div>
                {/* Kick off information */}
                <div className="flex-1 flex flex-col items-center justify-center dark:text-slate-400 text-slate-700 " >
                    {showKickOffTime && <p className="text-xs lg:text-base" >{kickoff_time ? format(kickoff_time, "hh:mm a") : ""}</p>}
                    {/* <p>{kickoff_time ? format(kickoff_time, "") : ""}</p> */}
                    <p className="text-sm" >VS</p>
                </div>
                {/* Away Team */}
                <div className="flex-1 flex gap-2 flex-col items-center justify-end" >
                    {showLogos && <SbrTeamLogo className="lg:w-14 lg:h-14" teamName={fixture.away_team} />}
                    <p className="text-xs lg-text-sm truncate" >{fixture.away_team}</p>
                </div>
            </div>
        </div>
    )
}
