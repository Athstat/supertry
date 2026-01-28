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
    <RoundedCard
      className='rounded-md flex-1 bg-[#E2E8F0] cursor-pointer w-20 py-0.5 px-2 flex flex-row items-center gap-1 justify-between'
      onClick={toggleShowOptions}
    >
      <p style={{ fontFamily: 'Oswald, sans-serif' }} className='font-semibold text-[#011E5C] dark:text-white text-xl' >{trimSeasonYear(abbreviateSeasonName(selectedSeason?.name || ''))}</p>
      <div>
        <ChevronDown className='w-5 h-5 dark:text-white' />
      </div>
    </RoundedCard>
  );
}

