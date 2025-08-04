import PageView from './PageView';
import MyWeekPanel from '../components/dashboard/MyWeekPanel';
import UpcomingFixturesSection from '../components/dashboard/UpcomingFixturesSection';
import FeaturedPlayersCarousel from '../components/dashboard/FeaturedPlayersCarousel';
import ComparePlayersPanel from '../components/dashboard/ComparePlayersPanel';
import { Home } from 'lucide-react';
import { HeroSection, MyTeamsSection } from '../components/dashboard';

export function DashboardScreen() {

  return (
    <PageView className="flex flex-col space-y-6 p-4">

      <div className='flex flex-row items-center gap-2' >
        <Home />
        <p className='text-xl font-extrabold' >Dashboard</p>
      </div>

      <HeroSection />
      <FeaturedPlayersCarousel />

      {/* <ActionList /> */}
      <UpcomingFixturesSection />
      <ComparePlayersPanel />
      <MyWeekPanel />
      {/* <MyTeamsSection /> */}
    </PageView>
  );
}
