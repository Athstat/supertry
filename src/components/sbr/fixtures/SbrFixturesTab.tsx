import { Calendar, FileX2, X } from "lucide-react"
import GroupedSbrFixturesList from "./GroupSbrFixtureList";
import { ISbrFixture } from "../../../types/sbr";
import PillBar, { PillBarItems } from "../../ui/bars/PillTabBar";
import { useQueryState } from "../../../hooks/web/useQueryState";
import { formatPosition } from "../../../utils/athletes/athleteUtils";

type Props = {
    fixtures: ISbrFixture[],
}

/** Renders all the Sbr Fixtures */
export default function SbrFixturesTab({ fixtures }: Props) {

    const [country, setCoutry] = useQueryState('fs', { init: 'all' });
    const countryFilterIsSet = country && country !== "all";
    
    const clearCountryFilter = () => {
        setCoutry("all");
    }

    const filteredFixtures = fixtures.filter((f) => {
        if (country) {
            if (country === "all") return true;

            if (country === "south-africa") {
                return f.season === 'Sharks Schools 2025';
            } else {
                return f.season === 'CBZ Schools 2025';
            }
        }

        return true;
    });

    // const fixturesLen = filteredFixtures.length;

    // const firstDate = fixturesLen > 0 ?
    //     filteredFixtures[0].kickoff_time : undefined;

    // const lastDate = fixturesLen > 0 ?
    //     filteredFixtures[fixturesLen - 1].kickoff_time : undefined;

    // const onMoveLeft = () => {

    //     if (pivotDate) {
    //         const prevPivot = subDays(pivotDate, 7);
    //         setPivotDateStr(dateToStrWithoutTime(prevPivot));
    //     }

    // }

    // const onMoveToToday = () => {
    //     setPivotDateStr(dateToStrWithoutTime(new Date()));
    // }

    // const onMoveRight = () => {

    //     if (pivotDate) {
    //         const nextPivot = addDays(pivotDate, 7);
    //         setPivotDateStr(dateToStrWithoutTime(nextPivot));
    //     }
    // }

    // const getDateMessage = () => {

    //     if (firstDate && lastDate) {

    //         if (isSameDay(lastDate, firstDate)) {
    //             return `Week of ${format(firstDate, 'EEE dd MMM yyyy')}`
    //         }

    //         return `Week of ${format(firstDate, 'EEE dd MMM yyyy')} - ${format(lastDate, 'EEE dd MMM yyyy')}`;
    //     }

    //     return undefined;
    // }


    const pills: PillBarItems[] = [

        {
            label: "All",
            key: "all"
        },

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

                {/* <div className="flex flex-row items-center" >
                    <p className="text-lg font-semibold mr-3" >Week {week}</p>

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
                        onClick={onMoveToToday}
                        className={twMerge(
                            "bg-slate-300 mr-1 px-2 text-slate-500 dark:text-slate-300 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 ",
                            !pivotDate && "opacity-50"
                        )}
                    >
                        Today
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
                </div> */}

            </div>

            {/* {pivotDate && <p className="dark:text-slate-300 text-slate-700 font-medium" >{getDateMessage()}</p>} */}

            {<GroupedSbrFixturesList
                fixtures={filteredFixtures}
            />}

            {filteredFixtures.length === 0 && (
                <div className="p-5 w-full flex gap-4 text-slate-700 dark:text-slate-400 flex-col items-center justify-center" >
                    <FileX2 className="w-20 h-20" />
                    <p className="w-4/5 text-center" >You are all caught up, no fixtures were found</p>
                    {countryFilterIsSet && <div className="flex flex-row items-center gap-2 " >
                        <p>You have a filter set </p>
                        <button onClick={clearCountryFilter}  className="bg-slate-200 hover:bg-slate-300 dark:hover:bg-slate-600 flex flex-row items-center gap-1 px-2 py-0.5 text-sm rounded-xl dark:bg-slate-700" >
                            {formatPosition(country)}
                            <X className="w-3 h-3" />
                        </button>
                    </div>}
                </div>
            )}

        </div>
    )
}