import { ChevronDown } from 'lucide-react';
import { useFantasySeasons } from '../../hooks/dashboard/useFantasySeasons';
import { abbreviateSeasonName, trimSeasonYear } from '../../utils/stringUtils';
import RoundedCard from '../ui/cards/RoundedCard';


export default function CompetitionSelector() {

  const { fantasySeasons, selectedSeason, isLoading, setShowDrawer } = useFantasySeasons();
  const toggleShowOptions = () => setShowDrawer(prev => !prev);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center">
        <div className="relative">
          <div className="bg-gray-200 dark:bg-gray-700 px-4 py-2 pr-10 rounded-md w-32 h-10 animate-pulse"></div>
        </div>
      </div>
    );
  }

  if (fantasySeasons.length === 0) {
    return null;
  }

  return (
    <>

      <RoundedCard
        className='rounded-md cursor-pointer px-2 py-1 flex flex-row items-center gap-1 justify-between'
        onClick={toggleShowOptions}
      >
        <p>{trimSeasonYear(abbreviateSeasonName(selectedSeason?.name || ''))}</p>
        <div>
          <ChevronDown className='w-5 h-5' />
        </div>
      </RoundedCard>
    </>
  );
}

