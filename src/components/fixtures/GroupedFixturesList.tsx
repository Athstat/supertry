import { FixtureListViewMode, IFixture } from "../../types/games";
import FixtureCard from "../fixture/card/FixtureCard";
import PickEmCard from "../pickem/PickEmCard";



type Props = {
    fixtures: IFixture[],
    search?: string,
    generateMessage?: (fixture: IFixture) => string,
    descendingOrder?: boolean,
    viewMode?: FixtureListViewMode,
    hideCompetitionName?: boolean
}

/** Groups Fixtures into dates and renders them by date, with an optionable pickem card view */
export default function GroupedFixturesList({ fixtures, viewMode = "fixtures", hideCompetitionName }: Props) {

    const groupedFixtures = groupFixturesByCompetition(fixtures);
    const competitions = sortCompetitions(Array.from(groupedFixtures.keys()));

    return competitions.map((competition) => {
        const fixtures = groupedFixtures.get(competition)!;

        return (
            <div key={competition} className="flex flex-col gap-3">
                {/* Competition Header */}
                {!hideCompetitionName && <div className="flex items-center gap-2 px-3 py-2 bg-slate-100 dark:bg-slate-800/50 rounded-lg">
                    <h3 className="font-bold text-sm text-slate-700 dark:text-slate-200">
                        {competition}
                    </h3>
                </div>}

                {/* Competition Fixtures */}
                <div className="flex flex-col gap-3">
                    {fixtures.map((fixture, index) => (
                        <FixtureItem
                            fixture={fixture}
                            key={`${competition}-${viewMode}-${index}`}
                            viewMode={viewMode}
                            className="rounded-xl border w-full dark:border-slate-700 flex-1"
                        />
                    ))}
                </div>
            </div>
        );
    });
}


type FixtureItemProps = {
    fixture: IFixture;
    viewMode: 'fixtures' | 'pickem';
    className?: string;
};

function FixtureItem({ fixture, viewMode, className }: FixtureItemProps) {
    return (
        <>
            {viewMode === 'fixtures' && (
                <FixtureCard fixture={fixture} showLogos showCompetition className={className} />
            )}
            {viewMode === 'pickem' && <PickEmCard fixture={fixture} className={className} />}
        </>
    );
}


// Sort competitions by priority
function sortCompetitions(competitions: string[]): string[] {
    return competitions.sort((a, b) => {
        const aPriority = COMPETITION_PRIORITY[a] || 999;
        const bPriority = COMPETITION_PRIORITY[b] || 999;

        if (aPriority !== bPriority) {
            return aPriority - bPriority;
        }

        // If both have same priority (or both are "other"), sort alphabetically
        return a.localeCompare(b);
    });
}

const COMPETITION_PRIORITY: Record<string, number> = {
    URC: 1,
    'Autumn Nations': 2,
};

// Group fixtures by competition
function groupFixturesByCompetition(fixtures: IFixture[]): Map<string, IFixture[]> {
    const grouped = new Map<string, IFixture[]>();

    fixtures.forEach(fixture => {
        const competition = fixture.competition_name || 'Other';
        if (!grouped.has(competition)) {
            grouped.set(competition, []);
        }
        grouped.get(competition)!.push(fixture);
    });

    return grouped;
}