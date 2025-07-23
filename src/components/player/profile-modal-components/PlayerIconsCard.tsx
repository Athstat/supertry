import { useAtomValue } from 'jotai';
import { IProAthlete } from '../../../types/athletes';
import { getPlayerIcons, PLAYER_ICONS, PlayerIcon } from '../../../utils/playerIcons';
import PlayerIconComponent from '../../players/compare/PlayerIconComponent';
import { playerProfileCurrStarRatings, playerProfileCurrStatsAtom } from '../../../state/playerProfile.atoms';

interface Props {
  player: IProAthlete;
  className?: string,
}

export function PlayerIconsCard({ player }: Props) {

  const starRatings = useAtomValue(playerProfileCurrStarRatings);
  const stats = useAtomValue(playerProfileCurrStatsAtom);

  const playerIcons = getPlayerIcons(player, starRatings || null, stats);

  if (playerIcons.length === 0) {
    return null;
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
