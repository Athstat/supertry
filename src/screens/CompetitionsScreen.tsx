import { Trophy } from 'lucide-react';
import PageView from './PageView';
import useSWR from 'swr';
import { seasonService } from '../services/seasonsService';
import { LoadingState } from '../components/ui/LoadingState';
import SeasonCard from '../components/seasons/SeasonCard';
import NoContentCard from '../components/shared/NoContentMessage';
import { swrFetchKeys } from '../utils/swrKeys';

/** Renders Competition Screen */
export default function CompetitionsScreen() {
  const key = swrFetchKeys.getAllSuppportedSeasons();
  let { data: seasons, isLoading } = useSWR(key, () => seasonService.getAllSupportedSeasons());

  if (isLoading) return <LoadingState />;

  seasons = seasons ?? [];

  // Order competitions to show upcoming first, then past
  const now = new Date();
  seasons.sort((a, b) => {
    const aStart = new Date(a.start_date as unknown as string).getTime();
    const bStart = new Date(b.start_date as unknown as string).getTime();
    const aEnd = new Date(a.end_date as unknown as string).getTime();
    const bEnd = new Date(b.end_date as unknown as string).getTime();

    const aUpcoming = aEnd >= now.getTime();
    const bUpcoming = bEnd >= now.getTime();

    // Upcoming first
    if (aUpcoming && !bUpcoming) return -1;
    if (!aUpcoming && bUpcoming) return 1;

    // Within same bucket, sort by start date ascending
    return aStart - bStart;
  });

  return (
    <PageView className="p-4 flex flex-col gap-4">
      <div className="flex flex-row items-center gap-2 ">
        <Trophy className="" />
        <p className="text-xl font-bold">Competitions</p>
      </div>

      {seasons && (
        <div className="flex flex-col gap-2">
          {seasons.map((s, index) => {
            return <SeasonCard season={s} key={index} />;
          })}
        </div>
      )}

      {seasons.length === 0 && (
        <div>
          <NoContentCard message="No competitions were found" />
        </div>
      )}
    </PageView>
  );
}
