import PageView from './PageView';
import { useNavigate } from 'react-router-dom';
import FeaturedFantasyLeagueGroups from './FeaturedFantasyLeagueGroups';
import ClaimAccountNoticeCard from '../components/auth/guest/ClaimAccountNoticeCard';
import PrimaryButton from '../components/shared/buttons/PrimaryButton';
import RoundedCard from '../components/shared/RoundedCard';
import { useTempEnableNotificationAlert } from '../hooks/notifications/useNotificationAlert';
import SportActionRankingsList from '../components/dashboard/rankings/SportActionRankingCard';
import { Crown } from 'lucide-react';

export function DashboardScreen() {
  const navigate = useNavigate();

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
          <Crown />
          <h1 className='font-bold' >Stats Leaders</h1>
        </div>

        <SportActionRankingsList
          actionName='tries'
          title='Tries Scored'
        />

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
