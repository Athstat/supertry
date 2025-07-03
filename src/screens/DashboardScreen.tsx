import { useNavigate } from 'react-router-dom';
import PageView from './PageView';
import MyWeekPanel from '../components/dashboard/MyWeekPanel';
import UpcomingFixturesSection from '../components/dashboard/UpcomingFixturesSection';
import FeaturedPlayersCarousel from '../components/dashboard/FeaturedPlayersCarousel';
import ComparePlayersPanel from '../components/dashboard/ComparePlayersPanel';
import { HeroImageBanner } from '../components/dashboard/JoinWeeklyLeagueCard';
import SecondaryText from '../components/shared/SecondaryText';

export function DashboardScreen() {
  const navigate = useNavigate();

  return (
    <PageView className="flex flex-col space-y-6 p-4">

      <div className='flex flex-col gap-2' >
        <HeroImageBanner
          link='/images/africa_banner.jpg'
        />
        <p className="font-bold text-lg">Rugby Africa Cup 2025 is here!</p>
        
        <SecondaryText className="text-xs">
          Stay updated with all the latest Africa Cup fixtures. Check out upcoming matches and follow your favorite teams throughout the tournament.
        </SecondaryText>

        <button
          className="mt-2 px-4 text-sm py-2 border border-blue-400 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition"
          onClick={() => navigate('/fixtures/africa-cup')}
        >
          View Fixtures
        </button>
      </div>

      {/* <ActionList /> */}
      <UpcomingFixturesSection />
      <FeaturedPlayersCarousel />
      <ComparePlayersPanel />
      <MyWeekPanel />
    </PageView>
  );
}
