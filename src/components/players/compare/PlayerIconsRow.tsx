import { IProAthlete, IAthleteSeasonStarRatings } from '../../../types/athletes';
import { SportAction } from '../../../types/sports_actions';
import { getPlayerIcons } from '../../../utils/playerIcons';
import PlayerIconComponent from './PlayerIconComponent';

type Props = {
  player: IProAthlete;
  starRatings: IAthleteSeasonStarRatings | null;
  seasonStats: SportAction[];
  size?: 'sm' | 'md' | 'lg';
};

export default function PlayerIconsRow({ player, starRatings, seasonStats, size = 'md' }: Props) {
  const playerIcons = getPlayerIcons(player, starRatings, seasonStats);

  // Always show the container, even when empty
  return (
    <div className="flex flex-row items-center justify-start flex-wrap min-h-[32px]">
      {playerIcons.map((iconName, index) => (
        <div key={`${iconName}-${index}`} className="mr-4">
          <PlayerIconComponent
            iconName={iconName}
            size={size}
          />
        </div>
      ))}
    </div>
  );
}
