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

  if (playerIcons.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-row gap-2 items-center flex-wrap overflow-visible">
      {playerIcons.map((iconName, index) => (
        <PlayerIconComponent
          key={`${iconName}-${index}`}
          iconName={iconName}
          size={size}
        />
      ))}
    </div>
  );
}
