import { format } from "date-fns"
import { ISbrFixture } from "../../types/sbr"
import SbrTeamLogo from "./SbrTeamLogo"

type Props = {
    fixture: ISbrFixture
}

export default function SbrFixtureCard({ fixture }: Props) {
    
    const {kickoff_time} = fixture;
    
    return (
        <div className="flex flex-row dark:bg-slate-800/40 bg-white rounded-xl border dark:border-slate-800/60 p-4" >
            {/* Home Team */}

            <div className="flex-1 flex gap-2 flex-col items-center justify-start" >
                <SbrTeamLogo teamName={fixture.home_team} />
                <p className="text-xs lg-text-sm truncate" >{fixture.home_team}</p>
            </div>

            {/* Kick off information */}

            <div className="flex-1 flex flex-col items-center justify-center dark:text-slate-400 text-slate-700 " >
                <p>{kickoff_time ? format(kickoff_time, "hh:mm a") : ""}</p>
                {/* <p>{kickoff_time ? format(kickoff_time, "") : ""}</p> */}
            </div>  

            {/* Away Team */}
            <div className="flex-1 flex gap-2 flex-col items-center justify-end" >
                <SbrTeamLogo teamName={fixture.away_team} />
                <p className="text-xs lg-text-sm truncate" >{fixture.away_team}</p>
            </div>
        </div>
    )
}
