import { format } from "date-fns";
import { Calendar } from "lucide-react";
import { ISbrFixture } from "../../../types/sbr";

type Props = {
    fixture: ISbrFixture
}

export default function SbrFixtureKickOffInfo({ fixture }: Props) {

    const { kickoff_time } = fixture;

    if (!kickoff_time) {
        return (
            <div>
                <div className="flex flex-col gap-3 bg-white dark:bg-slate-800/40 p-5 rounded-xl" >

                    <h1 className="text-xl font-bold" >Kick Off</h1>

                    <p className="dark:text-slate-400 text-slate-700" >Kick off time for this game is not available</p>
                </div>
            </div>
        )
    }

    return (
        <div>
            <div className="flex flex-col gap-3 bg-white dark:bg-slate-800/40 p-5 rounded-xl" >

                <h1 className="text-xl font-bold" >Kick Off</h1>

                {/* <div className="flex flex-row items-center mt-3 gap-2" >
                    <Watch className="text-blue-500" />
                    {kickoff_time && <p>{format(kickoff_time, "hh:mm a")}</p>}
                </div> */}

                <div className="flex flex-row items-center gap-2" >
                    <Calendar className="text-blue-500" />
                    {kickoff_time && <p>{format(kickoff_time, "EEEE dd MMMM yyyy")}</p>}
                </div>
            </div>
        </div>
    )
}
