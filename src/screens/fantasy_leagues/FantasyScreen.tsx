import { Trophy } from 'lucide-react';
import { FantasySeasonDashboard } from '../../components/fantasy-seasons/FantasyCompetitionDashboard';
import FantasySeasonOptionsList from '../../components/fantasy-seasons/FantasySeasonOptionsList';
import PageView from '../../components/ui/containers/PageView';
import { LoadingIndicator } from '../../components/ui/LoadingIndicator';
import { useFantasySeasons } from '../../hooks/dashboard/useFantasySeasons';
import { Activity } from 'react';

/** Renders the Fantasy/League Screen */
export function FantasyScreen() {
  const { selectedSeason, isLoading } = useFantasySeasons();

  const showLoading = isLoading;
  const showFantasySeasonDashboard = (isLoading === false) && (selectedSeason !== undefined);
  const showSeasonsOverview = (isLoading === false) && (selectedSeason === undefined);

  return (
    <PageView className="px-4 pt-4 flex flex-col gap-3">

      <div>
        <div className="flex flex-row items-center gap-2">
          <Trophy className="w-6 h-6" />
          <h1 className="font-bold text-2xl">Fantasy</h1>
        </div>
      </div>

      <Activity mode={showLoading ? "visible" : "hidden"} >
        <LoadingIndicator />
      </Activity>

      <Activity mode={showFantasySeasonDashboard ? 'visible' : 'hidden'}>
        {selectedSeason && <FantasySeasonDashboard fantasySeason={selectedSeason} />}
      </Activity>

      <Activity mode={showSeasonsOverview ? "visible" : "hidden"} >
        <FantasySeasonOptionsList />
      </Activity>

    </PageView>
  );
}
