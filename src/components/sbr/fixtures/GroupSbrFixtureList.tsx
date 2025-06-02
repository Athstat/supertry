import { format } from "date-fns";
import { ISbrFixture } from "../../../types/sbr";
import { searchSbrFixturesPredicate } from "../../../utils/fixtureUtils";
import SbrFixtureCard from "../SbrFixtureCard";

type Props = {
    fixtures: ISbrFixture[],
    search?: string
}

/** Groups Fixtures into dates and renders them by date */
export default function GroupedSbrFixturesList({ fixtures, search }: Props) {

    // Group fixtures by day
    const fixturesByDay: Record<string, ISbrFixture[]> = {};

    fixtures.forEach((fixture) => {
        if (
            searchSbrFixturesPredicate(fixture, search)
        ) {
            const dayKey = fixture.kickoff_time ? format(
                new Date(fixture.kickoff_time),
                "yyyy-MM-dd" 
            ) : "Date not confirmed";

            if (!fixturesByDay[dayKey]) {
                fixturesByDay[dayKey] = [];
            }

            fixturesByDay[dayKey].push(fixture);
        }
    });

    // Get sorted day keys
    const sortedDays = Object.keys(fixturesByDay).sort();

    return (
        <div className="grid grid-cols-1 gap-3">
            {(() => {

                return sortedDays.map((dayKey) => (
                    
                    <div key={dayKey} className="mb-4">
                        {/* Day header */}
                        <div className="px-4 py-2 mb-3 bg-gray-100 dark:bg-gray-800/40 font-medium text-gray-800 dark:text-gray-200 rounded-lg">
                            {dayKey !== "Date not confirmed" ? format(new Date(dayKey), "EEEE, MMMM d, yyyy") : "Date Not Confirmed"}
                        </div>

                        {/* Fixtures for this day */}
                        <div className="grid grid-cols-1 gap-3">
                            {fixturesByDay[dayKey].map((fixture, index) => (
                                <SbrFixtureCard
                                    showLogos
                                    showCompetition
                                    className="  border border-gray-300 dark:border-gray-700 bg-white  rounded-xl"
                                    fixture={fixture}
                                    key={index}
                                />
                            ))}
                        </div>
                    </div>
                ));
            })()}
        </div>
    )
}
