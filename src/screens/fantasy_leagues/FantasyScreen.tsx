import { FantasySeasonDashboard } from '../../components/fantasy-seasons/FantasyCompetitionDashboard';
import FantasySeasonOptionsList from '../../components/fantasy-seasons/FantasySeasonOptionsList';
import PageView from '../../components/ui/containers/PageView';
import { LoadingIndicator } from '../../components/ui/LoadingIndicator';
import { useFantasySeasons } from '../../hooks/dashboard/useFantasySeasons';
import { Activity } from 'react';
import AutoJoinLeagueModal from '../../components/fantasy-leagues/AutoJoinLeagueModal';
import RoundedScreenHeader from '../../components/ui/containers/RoundedScreenHeader';
import ThinTrophyIcon from '../../components/ui/icons/ThinTrophyIcon';

/** Renders the Fantasy/League Screen */
export function FantasyScreen() {
  const { selectedSeason, isLoading } = useFantasySeasons();

  const showLoading = isLoading;
  const showFantasySeasonDashboard = (isLoading === false) && (selectedSeason !== undefined);
  const showSeasonsOverview = (isLoading === false) && (selectedSeason === undefined);

  return (
    <PageView className="flex flex-col">

      <RoundedScreenHeader 
        title='Fantasy'
        leadingIcon={<ThinTrophyIcon />}
        className='rounded-none'
      />

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
