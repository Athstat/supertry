import { Calendar, ChevronLeft, ChevronRight } from "lucide-react"
import GroupedSbrFixturesList from "./GroupSbrFixtureList";
import { ISbrFixture } from "../../../types/sbr";
import PillBar, { PillBarItems } from "../../shared/bars/PillTabBar";
import { useQueryState } from "../../../hooks/useQueryState";
import { safeTransformStringToDate } from "../../../utils/dateUtils";
import { addDays, format, subDays } from "date-fns";
import { twMerge } from "tailwind-merge";

type Props = {
    fixtures: ISbrFixture[]
}

/** Renders all the Sbr Fixtures */
export default function SbrFixturesTab({ fixtures }: Props) {

    const [country] = useQueryState('fs', { init: 'south-africa' });
    const [pivotDateStr, setPivotDateStr] = useQueryState('pivot');

    const pivotDate = safeTransformStringToDate(pivotDateStr);

    const filteredFixtures = fixtures.filter((f) => {
        if (country) {
            if (country === "south-africa") {
                return f.season === 'Sharks Schools 2025';
            } else {
                return f.season === 'CBZ Schools 2025';
            }
        }

        return true;
    })

    const onMoveLeft = () => {

        if (pivotDate) {
            const prevPivot = subDays(pivotDate, 7);
            setPivotDateStr(format(prevPivot, 'yyyy-MM-dd'));
        }

    }

    const onMoveRight = () => {

        if (pivotDate) {
            const nextPivot = addDays(pivotDate, 7);
            setPivotDateStr(format(nextPivot, 'yyyy-MM-dd'));
        }
    }


    const pills: PillBarItems[] = [
        {
            label: "South Africa",
            key: "south-africa"
        },

        {
            label: "Zimbabwe",
            key: "zimbabwe"
        }
    ]

    return (
        <div className="flex flex-col gap-4" >

            <PillBar
                items={pills}
                searchParam="fs"
            />

            <div className="flex flex-row items-center justify-between" >

                <div className="flex flex-row items-center gap-1" >
                    <Calendar className="" />
                    <h1 className="text-xl font-bold" >Fixtures</h1>
                </div>

                { <div className="flex flex-row items-center" >
                    {/* <p className="text-lg font-semibold mr-3" >Week {week}</p> */}
                    
                    <button
                        onClick={onMoveLeft}
                        className={twMerge(
                            "bg-slate-300 mr-1 text-slate-500 dark:text-slate-300 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-l-lg",
                            !pivotDate && "opacity-50"
                        )}
                    >
                        <ChevronLeft className="w-7" />
                    </button>

                    <button
                        onClick={onMoveRight}
                        className={twMerge(
                            "bg-slate-300 mr-1 text-slate-500 dark:text-slate-300 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-r-lg",
                            !pivotDate && "opacity-50"
                        )}
                    >
                        <ChevronRight className="w-7" />
                    </button>
                </div>}

            </div>

            {<GroupedSbrFixturesList
                fixtures={filteredFixtures}
            />}

        </div>
    )
}