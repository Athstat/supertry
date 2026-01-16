import { Trophy } from 'lucide-react';
import { FantasySeasonDashboard } from '../../components/fantasy-seasons/FantasyCompetitionDashboard';
import FantasySeasonOptionsList from '../../components/fantasy-seasons/FantasySeasonOptionsList';
import PageView from '../../components/ui/containers/PageView';
import { LoadingIndicator } from '../../components/ui/LoadingIndicator';
import { useFantasySeasons } from '../../hooks/dashboard/useFantasySeasons';
import { Activity } from 'react';
import AutoJoinLeagueModal from '../../components/fantasy-leagues/AutoJoinLeagueModal';
import EditFantasyClubCTA from '../../components/fantasy_clubs/EditFantasyClubCTA';

/** Renders the Fantasy/League Screen */
export function FantasyScreen() {
  const { selectedSeason, isLoading } = useFantasySeasons();

  const showLoading = isLoading;
  const showFantasySeasonDashboard = (isLoading === false) && (selectedSeason !== undefined);
  const showSeasonsOverview = (isLoading === false) && (selectedSeason === undefined);

  return (
    <PageView className="pt-4 flex flex-col gap-3">


      <div className="flex flex-row items-center gap-2 px-4">
        <Trophy className="w-5 h-5" />
        <h1 className="font-bold text-xl">Fantasy</h1>
      </div>

      <div className='px-4' >
        <EditFantasyClubCTA />
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

      <AutoJoinLeagueModal />

    </PageView>
  );
}
