import { IProAthlete } from '../../../types/athletes';
import { getPlayerIcons, PLAYER_ICONS, PlayerIcon } from '../../../utils/playerIcons';
import PlayerIconComponent from '../../players/compare/PlayerIconComponent';
import useSWR from 'swr';
import { djangoAthleteService } from '../../../services/athletes/djangoAthletesService';
import { swrFetchKeys } from '../../../utils/swrKeys';
import { IProSeason } from '../../../types/season';
import RoundedCard from '../../shared/RoundedCard';

interface Props {
  player: IProAthlete;
  className?: string,
  season: IProSeason
}

export function PlayerIconsCard({ player, season }: Props) {

  const statsKey = swrFetchKeys.getAthleteSeasonStats(player.tracking_id, season.id);
  const { data: actions, isLoading: loadingStats } = useSWR(statsKey, () => djangoAthleteService.getAthleteSeasonStats(player.tracking_id, season.id));

  const starsKey = swrFetchKeys.getAthleteSeasonStars(player.tracking_id, season.id);
  const { data: starRatings, isLoading: loadingStars } = useSWR(starsKey, () => djangoAthleteService.getAthleteSeasonStarRatings(player.tracking_id, season.id));

  const isLoading = loadingStars || loadingStats;

  const playerIcons = getPlayerIcons(player, starRatings ?? null, actions ?? []);

  if (playerIcons.length === 0) {
    return null;
  }

  if (isLoading) {
    return (
      <div className='flex flex-col gap-2' >
        <RoundedCard className='bg-slate-200 animate-pulse rounded-xl w-full h-[20px]' />
        <RoundedCard className='bg-slate-200 animate-pulse rounded-xl w-full h-[20px]' />
        <RoundedCard className='bg-slate-200 animate-pulse rounded-xl w-full h-[20px]' />
      </div>
    )
  }

  if (!playerIcons) {
    return;
  }

  return (
    <div className="">
      <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
        Player Icons
      </h3>

      <div className="space-y-3">
        {playerIcons.map((iconName: PlayerIcon) => {
          const iconData = PLAYER_ICONS[iconName];

          return (
            <div
              key={iconName}
              className="bg-gray-50 flex flex-row items-center dark:bg-gray-800/50 rounded-lg p-4 border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-center flex-row gap-4">
                {/* Icon */}
                <div className="flex-shrink-0 mt-1">
                  <PlayerIconComponent iconName={iconName} size="lg" />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                    {iconData.name}
                  </h4>
                  <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                    {iconData.description}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PlayerIconsCard;
