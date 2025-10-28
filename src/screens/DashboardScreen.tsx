import PageView from './PageView';
import { useNavigate } from 'react-router-dom';
import FeaturedFantasyLeagueGroups from './FeaturedFantasyLeagueGroups';
import ClaimAccountNoticeCard from '../components/auth/guest/ClaimAccountNoticeCard';
import PrimaryButton from '../components/shared/buttons/PrimaryButton';
import RoundedCard from '../components/shared/RoundedCard';
import { useTempEnableNotificationAlert } from '../hooks/notifications/useNotificationAlert';
import SportActionRankingsList from '../components/dashboard/rankings/SportActionRankingCard';
import { Crown } from 'lucide-react';
import { Flame } from 'lucide-react';
import MostSelectedPlayersList from '../components/dashboard/rankings/MostSelectedPlayersList';
import FantasyPointsScoredPlayerList from '../components/dashboard/rankings/FantasyPointsPlayerList';
import { useDashboard } from '../hooks/dashboard/useDashboard';
import { abbreviateSeasonName } from '../components/players/compare/PlayerCompareSeasonPicker';

export function DashboardScreen() {
  const navigate = useNavigate();
  const {currentSeason} = useDashboard();

  /** Hook for temporal fix, that prompts user to enable
   * notification if they havem't already seen a message to do so */
  useTempEnableNotificationAlert();

  const handleBannerClick = () => {
    navigate('/leagues');
  };

  return (
    <PageView className="flex flex-col space-y-4 p-4">


      {/* <FixtureCarrousel /> */}

      <ClaimAccountNoticeCard />

      {/* <EnableNotificationMessage /> */}

      <FeaturedFantasyLeagueGroups />

      <div className='flex flex-col gap-4 pt-4' >
        <div className='flex flex-row items-center gap-2' >
          <Flame className="text-yellow-500" />
          <h1 className='font-bold' >Top Fantasy Picks</h1>
        </div>

        <MostSelectedPlayersList />
        <FantasyPointsScoredPlayerList />
      </div>

      <div className='flex flex-col gap-4 pt-4' >
        <div className='flex flex-row items-center gap-2' >
          <Crown className='text-blue-500' />
          <h1 className='font-bold' >{ currentSeason ? `${abbreviateSeasonName(currentSeason.name)} STATS LEADERS`  : "Stats Leaders"}</h1>
        </div>

        <div className='flex flex-col no-scrollbar overflow-y-hidden overflow-x-auto gap-2' >
          <SportActionRankingsList
            actionName='tries'
            title='Tries Scored'
            className='min-w-[90%]'
          />

          <SportActionRankingsList
            actionName='try_assist'
            title='Try Assits'
            className='min-w-[90%]'
          />

          <SportActionRankingsList
            actionName='defenders_beaten'
            title='Defenders Beaten'
            className='min-w-[90%]'
          />

          <SportActionRankingsList
            actionName='tackles'
            title='Tackles'
            className='min-w-[90%]'
          />

          <SportActionRankingsList
            actionName='post_contact_metres'
            title='Post Contact Meters (m)'
            className='min-w-[90%]'
          />
        </div>

      </div>

      <RoundedCard className="flex flex-col gap-4 p-4">
        <div className="flex flex-col gap-1">
          <h1 className="font-bold text-lg">Dominate the SCRUMM</h1>
          <p>
            Leagues are live! 🎉 Create your own, join one, and challenge your friends. Invite your
            crew and see who really rules the game!
          </p>
        </div>

        <PrimaryButton onClick={handleBannerClick}>Take Me There</PrimaryButton>
      </RoundedCard>

    </PageView>
  );
}
