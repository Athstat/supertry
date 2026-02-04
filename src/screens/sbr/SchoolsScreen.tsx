import { Fragment, useMemo } from 'react';
import PageView from '../../components/ui/containers/PageView';
import { useQueryState } from '../../hooks/web/useQueryState';
import SbrMatchCenter from '../../components/fixtures/SbrMatchCenter';
import IconCircle from '../../components/ui/icons/IconCircle';
import SbrIcon from '../../components/ui/icons/SbrIcon';
import SearchInput from '../../components/ui/forms/SearchInput';
import { useFixtureCursor } from '../../hooks/fixtures/useFixtureCursor';
import { useSbrFixtures } from '../../hooks/fixtures/useSbrFixtures';
import WeekCursor from '../../components/fixtures/WeekCursor';
import { searchSbrFixturePredicate } from '../../utils/sbrUtils';
import { SeasonFilterBarItem } from '../../types/games';
import { useDebounced } from '../../hooks/web/useDebounced';

export default function SchoolsScreen() {
  const [searchQuery, setSearchQuery] = useQueryState<string>('query', { init: '' });
  const { fixtures, isLoading } = useSbrFixtures();

  const debouncedQuery = useDebounced(searchQuery, 500);

  const seasons: SeasonFilterBarItem[] = [];

  fixtures.forEach(f => {
    if (f.season && !seasons.some(s => s.id === f.season)) {
      seasons.push({ name: f.season, id: f.season });
    }
  });

  const initDateVal = new Date();
  const {
    weekFixtures, handleNextWeek, handlePreviousWeek, weekHeader
  } = useFixtureCursor({ fixtures, isLoading, initDateVal });

  const displayFixture = useMemo(() => {
    if (debouncedQuery) {
      return fixtures.filter((f) => {
        return searchSbrFixturePredicate(debouncedQuery, f);
      })
    }

    return weekFixtures;
  }, [debouncedQuery, fixtures, weekFixtures]);

  const round = displayFixture.at(0)?.round;

  return (
    <Fragment>
      <PageView className="dark:text-white flex flex-col gap-4 pb-28 md:pb-32">


        <div className="flex flex-row justify-between px-4">

          <div className="flex flex-row items-center gap-2">

            <IconCircle>
              <SbrIcon />
            </IconCircle>

            <p className="font-bold text-xl">Schoolboy Rugby</p>
          </div>

        </div>

        <div className='px-4' >
          <SearchInput
            placeholder='Search school fixtures'
            value={searchQuery}
            onChange={setSearchQuery}
          />
        </div>

        <WeekCursor
          weekHeader={weekHeader}
          onNext={handleNextWeek}
          onPrevious={handlePreviousWeek}
          roundNumber={round}
          className='px-6'
        />

          <SbrMatchCenter 
            searchQuery={searchQuery}  
            fixtures={displayFixture}
            className='mx-6'
          />
      </PageView>

    </Fragment>
  );
}
