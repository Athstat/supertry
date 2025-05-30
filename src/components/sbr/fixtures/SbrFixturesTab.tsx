import { Calendar, ChevronLeft, ChevronRight } from "lucide-react"
import { useState } from "react"
import { useSbrContext } from "../../../contexts/SbrContext";
import { sbrService } from "../../../services/sbrService";
import useSWR from "swr";
import GroupedSbrFixturesList from "./GroupSbrFixtureList";
import { twMerge } from "tailwind-merge";
import { LoadingState } from "../../ui/LoadingState";

/** Renders all the Sbr Fixtures */
export default function SbrAllFixturesTab({ }) {

    const { data, isLoading } = useSWR("sbr-fixtures", fetcher);

    const { currentRound } = useSbrContext();
    const [week, setWeek] = useState(currentRound);

    const allFixtures = data ?? [];

    let maxRound = week;
    let minRound = week;

    allFixtures.forEach(f => {
        if (f.round > maxRound) {
            maxRound = f.round
        }

        if (f.round < minRound) {
            minRound = f.round
        }
    });

    const weekFixtures = allFixtures.filter(f => {
        return f.round === week;
    });

    const canMoveLeft = week > minRound;
    const canMoveRight = week < maxRound

    const onMoveLeft = () => {

        if (canMoveLeft) {
            setWeek(week - 1)
        }
    }

    const onMoveRight = () => {

        if (canMoveRight) {
            setWeek(week + 1)
        }
    }

    if (isLoading) return <LoadingState />

    return (
        <div className="flex flex-col gap-4" >
            <div className="flex flex-row items-center justify-between" >

                <div className="flex flex-row items-center gap-1" >
                    <Calendar className="" />
                    <h1 className="text-xl font-bold" >Fixtures</h1>
                </div>

                {currentRound !== 0 && <div className="flex flex-row items-center" >
                    <p className="text-lg font-semibold mr-3" >Week {week}</p>

                    <button
                        onClick={onMoveLeft}
                        className={twMerge(
                            "bg-slate-300 mr-1 text-slate-500 dark:text-slate-300 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-l-lg",
                            !canMoveLeft && "opacity-50"
                        )}
                    >
                        <ChevronLeft className="w-7" />
                    </button>

                    <button
                        onClick={onMoveRight}
                        className={twMerge(
                            "bg-slate-300 mr-1 text-slate-500 dark:text-slate-300 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-r-lg",
                            !canMoveRight && "opacity-50"
                        )}
                    >
                        <ChevronRight className="w-7" />
                    </button>
                </div>}
                
            </div>

            { currentRound !== 0 && <GroupedSbrFixturesList
                fixtures={weekFixtures}
            />}


            {currentRound === 0 && (
                <div className="h-fit mt-10 w-full overflow-hidden flex flex-col items-center justify-start" >
                    <p className="text-slate-500" >All caught up, no fixtures this week</p>
                </div>
            )}
        </div>
    )
}

async function fetcher() {
    const res = await sbrService.getAllFixtures();
    return res;
}