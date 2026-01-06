import { IProAthlete } from '../../../types/athletes';
import { getPlayerIcons } from '../../../utils/playerIcons';
import Experimental from '../../ui/ab_testing/Experimental';
import PlayerIconComponent from './PlayerIconComponent';
import useSWR from 'swr';
import { djangoAthleteService } from '../../../services/athletes/djangoAthletesService';
import { swrFetchKeys } from '../../../utils/swrKeys';
import { IProSeason } from '../../../types/season';

type Props = {
  player: IProAthlete;
  season: IProSeason
  size?: 'sm' | 'md' | 'lg';
};

export default function PlayerIconsRow({ player, size = 'md', season }: Props) {

  // consr fetchKey = swrFetchKeys.getAthleteCurrentSeasonStats(player.tracking_id)
  // const seasonStats = useSWR()

  const statsKey = swrFetchKeys.getAthleteSeasonStats(player.tracking_id, season.id);
  const { data: actions, isLoading: loadingStats } = useSWR(statsKey, () => djangoAthleteService.getAthleteSeasonStats(player.tracking_id, season.id));

  const starsKey = swrFetchKeys.getAthleteSeasonStars(player.tracking_id, season.id);
  const { data: starRatings, isLoading: loadingStars } = useSWR(starsKey, () => djangoAthleteService.getAthleteSeasonStarRatings(player.tracking_id, season.id));

  const isLoading = loadingStars || loadingStats;

  const playerIcons =  getPlayerIcons(player, starRatings ?? null, actions ?? []);

  if (isLoading) {
    return null;
  }

  if (playerIcons.length === 0) {
    return;
  }

  // Always show the container, even when empty
  return (
    <Experimental>
      <div className="flex flex-row max-h-[40px] hide-scrollbar min-h-[40px] p-2 items-center justify-start overflow-x-auto">
        {playerIcons.map((iconName, index) => (
          <div key={`${iconName}-${index}`} className="mr-4">
            <PlayerIconComponent
              iconName={iconName}
              size={size}
            />
          </div>
        ))}

        {playerIcons.length === 0 && <div className='' ></div>}
      </div>

    </Experimental>
  );
}
