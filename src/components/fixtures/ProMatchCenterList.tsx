import NoContentCard from '../ui/typography/NoContentMessage';
import { ChevronRight } from 'lucide-react';
import { FixtureListViewMode, IFixture } from '../../types/games';
import GroupedFixturesList from './GroupedFixturesList';


type Props = {
  searchQuery: string;
  viewMode: FixtureListViewMode;
  onViewModeChange: (mode: FixtureListViewMode) => void;
  onMoveNextWeek: () => void,
  displayFixtures: IFixture[],
  hasAnyFixtures?: boolean
};

/** Renders a list of pro matches */
export default function ProMatchCenterList({ onMoveNextWeek, displayFixtures, hasAnyFixtures }: Props) {

  const handleJumpToNextFixtures = () => {
    onMoveNextWeek();
  };

  return (
    <div className="flex flex-col gap-6 w-full">
      {displayFixtures.length === 0 && hasAnyFixtures && (
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

      <GroupedFixturesList 
        fixtures={displayFixtures}
        viewMode={"fixtures"}
        hideCompetitionName
      />

    </div>
  );
}
