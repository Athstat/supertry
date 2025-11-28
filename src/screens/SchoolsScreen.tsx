import { Fragment } from 'react';
import PageView from './PageView';
import { Calendar } from 'lucide-react';
import { useQueryState } from '../hooks/useQueryState';
import SbrMatchCenter from '../components/match_center/SbrMatchCenter';
import FloatingSearchBar from '../components/players/ui/FloatingSearchBar';

export default function SchoolsScreen() {
  const [searchQuery, setSearchQuery] = useQueryState<string>('query', { init: '' });

  return (
    <Fragment>
      <PageView className="dark:text-white lg:w-[60%] p-4 md:p-6 flex flex-col gap-4 pb-28 md:pb-32">
        <div className="flex flex-row justify-between">
          <div className="flex flex-row items-center gap-2">
            <Calendar />
            <p className="font-bold text-xl">Schoolboy Rugby</p>
          </div>
        </div>

        <div className="w-full mx-auto">
          <SbrMatchCenter searchQuery={searchQuery} onSearchChange={setSearchQuery} />
        </div>
      </PageView>

      <FloatingSearchBar
        value={searchQuery ?? ''}
        onChange={setSearchQuery}
        placeholder="Search fixtures..."
        showFilterButton={false}
        showCompareButton={false}
      />
    </Fragment>
  );
}
