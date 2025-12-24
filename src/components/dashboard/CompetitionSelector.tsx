import { ChevronDown } from 'lucide-react';
import { useFantasySeasons } from '../../hooks/dashboard/useFantasySeasons';
import { abbreviateSeasonName } from '../players/compare/PlayerCompareSeasonPicker';
import { useDeferredValue, useEffect, useState } from 'react';


export default function CompetitionSelector() {

  const { fantasySeasons, selectedSeason, setSelectedSeason, isLoading } = useFantasySeasons();

  const [seasonId, setSeasonId] = useState<string | undefined>(selectedSeason?.id);
  const defferedSeasonId = useDeferredValue(seasonId);

  const availableSeasons = fantasySeasons;

  const handleSeasonChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const inputSeasonId = e.target.value;

    if (inputSeasonId) {
      setSeasonId(inputSeasonId);
    }
  };

  useEffect(() => {
    setSelectedSeason(() => {
      return availableSeasons.find((s) => s.id === defferedSeasonId);
    })
  }, [availableSeasons, defferedSeasonId, setSelectedSeason]);

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
          className="appearance-none dark:bg-gray-900 text-gray-900 dark:text-white px-4 py-2 pr-10 rounded-md font-semibold cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
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


export function trimSeasonYear(seasonName: string) {
  const abbreviated = abbreviateSeasonName(seasonName);
  if (seasonName.includes(" ") && abbreviated) {
    const [seasonNamePart] = abbreviated.split(" ");
    return seasonNamePart;
  }

  return abbreviated || seasonName;
}