import { Activity } from 'react';
import PageView from '../../components/ui/containers/PageView';
import { LoadingIndicator } from '../../components/ui/LoadingIndicator';
import { useFantasySeasons } from '../../hooks/dashboard/useFantasySeasons';
import AutoJoinLeagueModal from '../../components/fantasy-leagues/AutoJoinLeagueModal';
import MyFantasyTeamPreview from '../../components/fantasy-leagues/MyFantasyTeamPreview';
import LeagueAndStandingsSection from '../../components/fantasy-leagues/other_leagues_section/LeagueAndStandingsSection';
import { useFeaturedLeague } from '../../hooks/leagues/useFeaturedLeague';
import TextHeading from '../../components/ui/typography/TextHeading';
import FantasyTrophyIcon from '../../components/ui/icons/FantasyTrophyIcon';
import IconCircle from '../../components/ui/icons/IconCircle';

/** Renders the Fantasy/League Screen */
export function FantasyScreen() {
  const { selectedSeason } = useFantasySeasons();
  const { featuredLeague, isLoading: loadingFeatureGroup } = useFeaturedLeague();

  const isLoading = loadingFeatureGroup;

  return (
    <PageView className="pt-1 flex flex-col gap-3" key={selectedSeason?.id} >

      <div className="flex flex-row items-center gap-2 px-4">
        <IconCircle>
          <FantasyTrophyIcon />
        </IconCircle>

        <TextHeading className="text-2xl">Fantasy</TextHeading>
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
