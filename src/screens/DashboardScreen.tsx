import PageView from './PageView';
import UpcomingFixturesSection from '../components/dashboard/UpcomingFixturesSection';
import { Home } from 'lucide-react';
import HeroImageBanner from '../components/dashboard/HeroImageBanner';
import { useNavigate } from 'react-router-dom';
import FeaturedFantasyLeagueGroups from './FeaturedFantasyLeagueGroups';
import ClaimAccountNoticeCard from '../components/auth/guest/ClaimAccountNoticeCard';
import PrimaryButton from '../components/shared/buttons/PrimaryButton';
import RoundedCard from '../components/shared/RoundedCard';
import { GamePlayHelpButton } from '../components/branding/help/LearnScrummyNoticeCard';

export function DashboardScreen() {
  const navigate = useNavigate();

  const handleBannerClick = () => {
    navigate('/leagues');
  };

  return (
    <PageView className="flex flex-col space-y-8 p-4">

      <div className='flex flex-row items-center justify-between' >
        <div className="flex flex-row items-center gap-2">
          <Home />
          <p className="text-xl font-extrabold">Dashboard</p>
        </div>

        <div>
          <GamePlayHelpButton />
        </div>
      </div>

      {/* <HeroSection /> */}

      <HeroImageBanner link={'/images/wwc_2025_banner.jpg'} onClick={handleBannerClick} />

      {/* <FeaturedPlayersCarousel /> */}

      <ClaimAccountNoticeCard />
      <FeaturedFantasyLeagueGroups />

      {/* <ActionList /> */}
      <UpcomingFixturesSection />
      {/* <ComparePlayersPanel /> */}
      {/* <MyWeekPanel /> */}
      {/* <MyTeamsSection /> */}

      <RoundedCard className='flex flex-col gap-4 p-4' >

        <div className='flex flex-col gap-1' >
          <h1 className='font-bold text-lg' >Dominate the SCRUMM</h1>
          <p>Leagues are live! 🎉 Create your own, join one, and challenge your friends. Invite your crew and see who really rules the game!</p>
        </div>

        <PrimaryButton onClick={handleBannerClick} >Take Me There</PrimaryButton>
      </RoundedCard>
    </PageView>
  );
}
