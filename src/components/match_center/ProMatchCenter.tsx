import FixtureCard from '../fixtures/FixtureCard';
import PickEmCard from '../fixtures/PickEmCard';
import NoContentCard from '../shared/NoContentMessage';
import { ChevronRight } from 'lucide-react';
import { FixtureListViewMode, IFixture } from '../../types/games';

// Competition priority order
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

type Props = {
  searchQuery: string;
  viewMode: FixtureListViewMode;
  onViewModeChange: (mode: FixtureListViewMode) => void;
  onMoveNextWeek: () => void,
  displayFixtures: IFixture[],
  hasAnyFixtures?: boolean
};

export default function ProMatchCenter({
  searchQuery,
  viewMode,
  onMoveNextWeek,
  displayFixtures,
  hasAnyFixtures,
}: Props) {


  const handleJumpToNextFixtures = () => {
    onMoveNextWeek();
  };

  return (
    <div className="flex flex-col gap-6 w-full">
      {!hasAnyFixtures && !searchQuery && <NoContentCard message="No fixtures available" />}
      {displayFixtures.length === 0 && !searchQuery && hasAnyFixtures && (
        <div className="flex flex-col gap-3 items-center">
          <NoContentCard message="No fixtures found for this week" />
          {(
            <button
              onClick={handleJumpToNextFixtures}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors"
            >
              <span>View Next Fixtures</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>
      )}
      {displayFixtures.length === 0 && searchQuery && (
        <NoContentCard message="No fixtures match your search" />
      )}
      {displayFixtures.length > 0 &&
        (() => {
          // Group fixtures by competition
          const groupedFixtures = groupFixturesByCompetition(displayFixtures);
          const competitions = sortCompetitions(Array.from(groupedFixtures.keys()));

          return competitions.map(competition => {
            const fixtures = groupedFixtures.get(competition)!;

            return (
              <div key={competition} className="flex flex-col gap-3">
                {/* Competition Header */}
                <div className="flex items-center gap-2 px-3 py-2 bg-slate-100 dark:bg-slate-800/50 rounded-lg">
                  <h3 className="font-bold text-sm text-slate-700 dark:text-slate-200">
                    {competition}
                  </h3>
                </div>

                {/* Competition Fixtures */}
                <div className="flex flex-col gap-3">
                  {fixtures.map((fixture, index) => (
                    <FixtureItem
                      fixture={fixture}
                      key={`${competition}-${viewMode}-${index}`}
                      viewMode={viewMode}
                      className="rounded-xl border w-full min-h-full dark:border-slate-700 flex-1"
                    />
                  ))}
                </div>
              </div>
            );
          });
        })()}
    </div>
  );
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
