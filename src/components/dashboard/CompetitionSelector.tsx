import { ChevronDown } from 'lucide-react';
import { useAtom } from 'jotai';
import { fantasySeasonsAtoms } from '../../state/dashboard/dashboard.atoms';
import { useMemo } from 'react';
import useSWR from 'swr';
import { swrFetchKeys } from '../../utils/swrKeys';
import { fantasySeasonsService } from '../../services/fantasy/fantasySeasonsService';

// Helper function to abbreviate season names
const abbreviateSeasonName = (name: string): string => {
  // Handle "United Rugby Championship" -> "URC"
  if (name.toLowerCase().includes('united rugby championship')) {
    return name.replace(/united rugby championship 25\/26/i, 'URC');
  }
  return name;
};

export default function CompetitionSelector() {
  const [selectedSeason, setSelectedSeason] = useAtom(fantasySeasonsAtoms.selectedDashboardSeasonAtom);

  // Fetch fantasy seasons data directly
  const seasonsKey = swrFetchKeys.getActiveFantasySeasons();
  const {
    data: fantasySeasons,
    isLoading,
    error,
  } = useSWR(seasonsKey, () => fantasySeasonsService.getAllFantasySeasons(true));

  // Use all active seasons (no filtering by fantasy_supported)
  const availableSeasons = useMemo(() => {
    if (!fantasySeasons) return [];
    return fantasySeasons;
  }, [fantasySeasons]);

  const handleSeasonChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const seasonId = e.target.value;
    const season = availableSeasons.find(s => s.id === seasonId);
    if (season) {
      setSelectedSeason(season);
    }
  };

  // Use selected season or fall back to first available season
  const displaySeason = selectedSeason || availableSeasons[0];

  // Show loading skeleton ONLY while actively loading and no data yet
  if (isLoading && !fantasySeasons) {
    return (
      <div className="flex justify-center items-center">
        <div className="relative">
          <div className="bg-gray-200 dark:bg-gray-700 px-4 py-2 pr-10 rounded-md w-32 h-10 animate-pulse"></div>
        </div>
      </div>
    );
  }

  // If error or no seasons available after loading, hide the selector
  if (error || availableSeasons.length === 0) {
    console.error('CompetitionSelector - Error or no available seasons:', error);
    return null;
  }

  return (
    <div className="flex justify-center items-center">
      <div className="relative">
        <select
          value={displaySeason?.id || ''}
          onChange={handleSeasonChange}
          className="appearance-none dark:bg-gray-900 text-gray-900 dark:text-white px-4 py-2 pr-10 rounded-md font-semibold cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
        >
          {availableSeasons.map(season => (
            <option key={season.id} value={season.id}>
              {abbreviateSeasonName(season.name)}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none w-4 h-4 text-gray-900 dark:text-white" />
      </div>
    </div>
  );
}
