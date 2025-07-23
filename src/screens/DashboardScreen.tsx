import PageView from './PageView';
import MyWeekPanel from '../components/dashboard/MyWeekPanel';
import UpcomingFixturesSection from '../components/dashboard/UpcomingFixturesSection';
import FeaturedPlayersCarousel from '../components/dashboard/FeaturedPlayersCarousel';
import ComparePlayersPanel from '../components/dashboard/ComparePlayersPanel';
import { Home } from 'lucide-react';

export function DashboardScreen() {

  return (
    <PageView className="flex flex-col space-y-6 p-4">

      <div className='flex flex-row items-center gap-2' >
        <Home />
        <p className='text-xl font-bold' >Dashboard</p>
      </div>

      {/* <ActionList /> */}
      <UpcomingFixturesSection />
      <FeaturedPlayersCarousel />
      <ComparePlayersPanel />
      <MyWeekPanel />
    </PageView>
  );
}
