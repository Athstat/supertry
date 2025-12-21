import PageView from './PageView';
import { Trophy } from 'lucide-react';
import { FantasyCompetitionDashboard } from '../components/fantasy-seasons/FantasyCompetitionDashboard';
import FantasySeasonsOverview from '../components/fantasy-seasons/FantasySeasonsOverview';
import { Activity } from '../components/shared/Activity';
import { useFantasySeasons } from '../hooks/dashboard/useFantasySeasons';

/** Renders the Fantasy/League Screen */
export function FantasyScreen() {
  const { selectedSeason } = useFantasySeasons();

  return (
    <PageView className="px-4 pt-4 flex flex-col gap-3">

      <div>
        <div className="flex flex-row items-center gap-2">
          <Trophy className="w-6 h-6" />
          <h1 className="font-bold text-2xl">Fantasy</h1>
        </div>
      </div>

      <Activity mode={selectedSeason ? 'visible' : 'hidden'}>
        {selectedSeason && <FantasyCompetitionDashboard fantasySeason={selectedSeason} />}
      </Activity>

      {!selectedSeason && <FantasySeasonsOverview />}
    </PageView>
  );
}
