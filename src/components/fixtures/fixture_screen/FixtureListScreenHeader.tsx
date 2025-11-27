import { Calendar } from "lucide-react";
import { useSticky } from "../../hooks/useSticky"
import { Sticky } from "../shared/Sticky";
import { useState } from "react";

/** Renders the fixture screen header for filtering and searching matches */
export default function FixtureListScreenHeader() {

    const { sentinelRef } = useSticky<HTMLDivElement>();
    const [showCalendar, setShowCalendar] = useState(false);
    const toggle = () => setShowCalendar(!showCalendar);

    return (
        <>
            <div ref={sentinelRef} ></div>
            <Sticky className="bg-white p-4 flex flex-row" >
                <div>
                </div>
                <div className="flex-1 items-center justify-end flex flex-row" >
                    <button onClick={toggle} className="flex p-2 hover:bg-slate-100 dark:hover:bg-slate-900 rounded-xl" >
                        <Calendar />
                    </button>
                </div>
            </Sticky>


        </>
    )
}
