import { format } from "date-fns";
import { IFixture } from "../../types/games";
import { searchFixturesPredicate } from "../../utils/fixtureUtils";
import FixtureCard from "./FixtureCard";

type Props = {
    fixtures: IFixture[],
    search?: string,
    generateMessage?: (fixture: IFixture) => string,
    descendingOrder?: boolean
}

/** Groups Fixtures into dates and renders them by date */
export default function GroupedFixturesList({ fixtures, search, generateMessage, descendingOrder }: Props) {

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
    const sortedDays = Object.keys(fixturesByDay).sort((a, b) => {
        if (descendingOrder) return new Date(b).valueOf() - new Date(a).valueOf()
        return new Date(a).valueOf() - new Date(b).valueOf()
    });

    return (
        <div className="grid grid-cols-1 gap-3">
            {(() => {


                return sortedDays.map((dayKey) => {

                    const dayFixtures = fixturesByDay[dayKey];
                    const firstKickOff = dayFixtures.length > 0 ? dayFixtures[0]?.kickoff_time : undefined;
                    const dayDate = firstKickOff ? new Date(firstKickOff) : new Date(dayKey);

                    return (
                        <div key={dayKey} className="mb-4">
                            {/* Day header */}

                            <div className="px-4 text-sm lg:text-base py-2 mb-3 bg-gray-100 dark:bg-gray-800/40 font-medium text-gray-800 dark:text-gray-200 rounded-lg">
                                {format(dayDate, "EEEE, MMMM d, yyyy")}
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
                                        showVenue
                                        hideDate
                                        message={generateMessage ? generateMessage(fixture) : undefined}
                                    />
                                ))}
                            </div>
                        </div>
                    )
                });
            })()}
        </div>
    )
}
