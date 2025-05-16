import { format } from "date-fns";
import { IFixture } from "../../types/games";
import { searchFixturesPredicate } from "../../utils/fixtureUtils";
import FixtureCard from "./FixtureCard";

type Props = {
    fixtures: IFixture[],
    search?: string
}

/** Groups Fixtures into dates and renders them by date */
export default function GroupedFixturesList({ fixtures, search }: Props) {

    // Group fixtures by day
    const fixturesByDay: Record<string, IFixture[]> = {};

    fixtures.forEach((fixture) => {
        if (
            fixture.kickoff_time &&
            searchFixturesPredicate(fixture, search)
        ) {
            const dayKey = format(
                new Date(fixture.kickoff_time),
                "yyyy-MM-dd"
            );
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
                            {format(new Date(dayKey), "EEEE, MMMM d, yyyy")}
                        </div>

                        {/* Fixtures for this day */}
                        <div className="grid grid-cols-1 gap-3">
                            {fixturesByDay[dayKey].map((fixture, index) => (
                                <FixtureCard
                                    showLogos
                                    showCompetition
                                    className="dark:bg-gray-800/40 dark:hover:bg-gray-800/60 border border-gray-300 dark:border-gray-700 bg-white hover:bg-slate-50 rounded-xl"
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
