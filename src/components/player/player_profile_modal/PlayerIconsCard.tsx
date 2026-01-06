import { IProAthlete } from '../../../types/athletes';
import { getPlayerIcons, PLAYER_ICONS, PlayerIcon } from '../../../utils/playerIcons';
import PlayerIconComponent from '../../players/compare/PlayerIconComponent';
import useSWR from 'swr';
import { djangoAthleteService } from '../../../services/athletes/djangoAthletesService';
import { swrFetchKeys } from '../../../utils/swrKeys';
import { IProSeason } from '../../../types/season';
import RoundedCard from '../../shared/RoundedCard';
import SecondaryText from '../../ui/typography/SecondaryText';
import { Sparkles } from 'lucide-react';

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
        <SecondaryText className='flex flex-row items-center gap-2' >
          <Sparkles className='w-4 h-4' />
          <p>Player Icons</p>

        </SecondaryText>
        
        <RoundedCard className='bg-slate-200 animate-pulse rounded-xl w-full border-none h-[100px]' />
      </div>
    )
  }

  if (!playerIcons) {
    return;
  }

  return (
    <div className="flex flex-col gap-2">
      <SecondaryText className='flex flex-row items-center gap-2' >
        <Sparkles className='w-4 h-4' />
        <p>Player Icons</p>

      </SecondaryText>

      <div className="space-y-3">
        {playerIcons.map((iconName: PlayerIcon) => {
          const iconData = PLAYER_ICONS[iconName];

          return (
            <RoundedCard
              key={iconName}
              className="flex flex-row items-center p-4 px-6 dark:border-none"
            >
              <div className="flex items-center flex-row gap-4">
                {/* Icon */}
                <div className="flex-shrink-0 mt-1 min-w-[40px]">
                  <PlayerIconComponent iconName={iconName} size="md" />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 flex-col flex">
                  <h4 className="text-md font-bold text-gray-900 dark:text-white">
                    {iconData.name}
                  </h4>
                  <p className="text-gray-600 dark:text-gray-400 text-xs leading-relaxed">
                    {iconData.description}
                  </p>
                </div>
              </div>
            </RoundedCard>
          );
        })}
      </div>
    </div>
  );
};

export default PlayerIconsCard;
