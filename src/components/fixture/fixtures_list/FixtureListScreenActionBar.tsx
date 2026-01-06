import { Calendar, ChevronDown } from 'lucide-react'
import { useState } from 'react'
import FixtureListScreenCalendar from '../calendar/FixtureListScreenCalendar'
import { useSectionNavigation } from '../../../hooks/useSectionNavigation';
import { ChevronUp } from 'lucide-react';

/** Renders action on the bottom right of fixtures list screen */
export default function FixturesListScreenActionBar() {

    const sectionId = "upcoming_matches";
    const { scrollToSection } = useSectionNavigation(["upcoming_matches"]);

    const [showCalendar, setShowCalendar] = useState(false);
    const toggleCalendar = () => setShowCalendar(!showCalendar);

    const handleScrollToTop = () => {
        window.scrollTo(0, 0);
    }

    return (
        <div>
            <div
                className="items-center gap-2 flex-col text-white justify-center flex rounded-full bottom-0 mb-20 mr-3 right-0 fixed"
            >
                <div
                    onClick={handleScrollToTop}
                    className="bg-primary-600 hover:bg-primary-600 items-center text-white justify-center flex w-10 h-10 rounded-full"
                >
                    <ChevronUp />
                </div>

                <div
                    onClick={() => scrollToSection(sectionId)}
                    className="bg-primary-600 hover:bg-primary-600 items-center text-white justify-center flex w-10 h-10 rounded-full"
                >
                    <ChevronDown />
                </div>

                <div
                    onClick={toggleCalendar}
                    className="bg-primary-600 hover:bg-primary-600 items-center text-white justify-center flex w-10 h-10 rounded-full"
                >
                    <Calendar />
                </div>
            </div>

            <FixtureListScreenCalendar open={showCalendar} onClose={toggleCalendar} />
        </div>
    )
}
