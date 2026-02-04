import { Trophy } from 'lucide-react';
import PageView from '../../components/ui/containers/PageView';
import { LoadingIndicator } from '../../components/ui/LoadingIndicator';
import { useFantasySeasons } from '../../hooks/dashboard/useFantasySeasons';
import { Activity } from 'react';
import AutoJoinLeagueModal from '../../components/fantasy-leagues/AutoJoinLeagueModal';
import MyFantasyTeamPreview from '../../components/fantasy-leagues/MyFantasyTeamPreview';
import LeagueAndStandingsSection from '../../components/fantasy-leagues/other_leagues_section/LeagueAndStandingsSection';
import { useFeaturedLeague } from '../../hooks/leagues/useFeaturedLeague';

/** Renders the Fantasy/League Screen */
export function FantasyScreen() {
  const { selectedSeason } = useFantasySeasons();
  const { featuredLeague, isLoading: loadingFeatureGroup } = useFeaturedLeague();

  const isLoading = loadingFeatureGroup;

  return (
    <PageView className="pt-1 flex flex-col gap-3">

      <div className="flex flex-row items-center gap-2 px-4">
        <Trophy className="w-5 h-5" />
        <h1 className="font-bold text-xl">Fantasy</h1>
      </div>

      <Activity mode={isLoading ? "visible" : "hidden"} >
        <LoadingIndicator />
      </Activity>

      {featuredLeague && (
        <MyFantasyTeamPreview
          leagueGroup={featuredLeague}
        />
      )}

      {selectedSeason && <LeagueAndStandingsSection
        fantasySeason={selectedSeason}
      />}

      <AutoJoinLeagueModal />

    </PageView>
  );
}
