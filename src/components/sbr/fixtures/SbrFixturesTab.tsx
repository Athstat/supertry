import { Calendar } from "lucide-react"
import { useSbrContext } from "../../../contexts/SbrContext";
import GroupedSbrFixturesList from "./GroupSbrFixtureList";
import { ISbrFixture } from "../../../types/sbr";
import PillBar, { PillBarItems } from "../../shared/bars/PillTabBar";
import { useQueryState } from "../../../hooks/useQueryState";

type Props = {
    fixtures: ISbrFixture[]
}

/** Renders all the Sbr Fixtures */
export default function SbrAllFixturesTab({ fixtures }: Props) {

    const { currentRound } = useSbrContext();
    const [ country ] = useQueryState('fs',{ init: 'south-africa'});

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

    // const allFixtures = data ?? [];

    // let maxRound = week;
    // let minRound = week;

    // allFixtures.forEach(f => {
    //     if (f.round > maxRound) {
    //         maxRound = f.round
    //     }

    //     if (f.round < minRound) {
    //         minRound = f.round
    //     }
    // });

    // const canMoveLeft = week > minRound;
    // const canMoveRight = week < maxRound

    // const onMoveLeft = () => {

    //     if (canMoveLeft) {
    //         setWeek(week - 1)
    //     }
    // }

    // const onMoveRight = () => {

    //     if (canMoveRight) {
    //         setWeek(week + 1)
    //     }
    // }


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

                {currentRound !== 0 && <div className="flex flex-row items-center" >
                    {/* <p className="text-lg font-semibold mr-3" >Week {week}</p> */}
                    {/* 
                    <button
                        onClick={onMoveLeft}
                        className={twMerge(
                            "bg-slate-300 mr-1 text-slate-500 dark:text-slate-300 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-l-lg",
                            !canMoveLeft && "opacity-50"
                        )}
                    >
                        <ChevronLeft className="w-7" />
                    </button> */}

                    {/* <button
                        onClick={onMoveRight}
                        className={twMerge(
                            "bg-slate-300 mr-1 text-slate-500 dark:text-slate-300 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-r-lg",
                            !canMoveRight && "opacity-50"
                        )}
                    >
                        <ChevronRight className="w-7" />
                    </button> */}
                </div>}

            </div>

            {<GroupedSbrFixturesList
                fixtures={filteredFixtures}
            />}

        </div>
    )
}