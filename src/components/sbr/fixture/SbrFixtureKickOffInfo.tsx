import { format } from "date-fns";
import { Watch, Calendar } from "lucide-react";
import { ISbrFixture } from "../../../types/sbr";

type Props = {
    fixture: ISbrFixture
}

export default function SbrFixtureKickOffInfo({fixture} : Props) {
    
    const { kickoff_time } = fixture;

    return (
        <div>
            <div className="flex flex-col gap-3 bg-white dark:bg-slate-800/40 p-5 rounded-xl" >

                <h1 className="text-xl font-bold" >Kick Off</h1>

                <div className="flex flex-row items-center mt-3 gap-2" >
                    <Watch className="text-blue-500" />
                    {kickoff_time && <p>{format(kickoff_time, "hh:mm a")}</p>}
                </div>

                <div className="flex flex-row items-center gap-2" >
                    <Calendar className="text-blue-500" />
                    {kickoff_time && <p>{format(kickoff_time, "EEEE dd MMMM yyyy")}</p>}
                </div>
            </div>
        </div>
    )
}
