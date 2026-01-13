import { ChevronDown } from 'lucide-react';
import { useFantasySeasons } from '../../hooks/dashboard/useFantasySeasons';
import { useState } from 'react';
import { trimSeasonYear } from '../../utils/stringUtils';
import { SELECTED_SEASON_ID_KEY } from '../../types/constants';


export default function CompetitionSelector() {

  const { fantasySeasons, selectedSeason, setSelectedSeason, isLoading } = useFantasySeasons();

const savedId = localStorage.getItem(SELECTED_SEASON_ID_KEY) || undefined;
  const [seasonId, setSeasonId] = useState<string | undefined>(selectedSeason?.id || savedId);

  const availableSeasons = fantasySeasons;

  const handleSeasonChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const inputSeasonId = e.target.value;

    if (inputSeasonId) {
      setSeasonId(inputSeasonId);
      const requestedSeason = availableSeasons.find((s) => s.id === inputSeasonId);
      
      if (requestedSeason) {
        setSelectedSeason(requestedSeason);
      }
    }
  };

  // useEffect(() => {
  //   setSelectedSeason(() => {
  //     return availableSeasons.find((s) => s.id === defferedSeasonId);
  //   })
  // }, [availableSeasons, defferedSeasonId, setSelectedSeason]);

  // Show loading skeleton ONLY while actively loading and no data yet
  if (isLoading) {
    return (
      <div className="flex justify-center items-center">
        <div className="relative">
          <div className="bg-gray-200 dark:bg-gray-700 px-4 py-2 pr-10 rounded-md w-32 h-10 animate-pulse"></div>
        </div>
      </div>
    );
  }

  // If error or no seasons available after loading, hide the selector
  if (availableSeasons.length === 0) {
    return null;
  }

  return (
    <div className="flex justify-center items-center">
      <div className="relative">

        <select
          value={seasonId}
          onChange={handleSeasonChange}
          className="appearance-none border dark:bg-gray-900 text-gray-900 dark:text-white px-4 py-2 pr-10 rounded-md font-semibold cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
        >
          {availableSeasons.map(season => (
            <option key={season.id} value={season.id}>
              {trimSeasonYear(season.name)}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none w-4 h-4 text-gray-900 dark:text-white" />
      </div>
    </div>
  );
}