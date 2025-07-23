import { IProAthlete, IAthleteSeasonStarRatings } from '../../../types/athletes';
import { SportAction } from '../../../types/sports_actions';
import { getPlayerIcons } from '../../../utils/playerIcons';
import Experimental from '../../shared/ab_testing/Experimental';
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
    <Experimental>
      <div className="flex flex-row min-h-[40px] max-h-[40px] p-2 items-center justify-start flex-wrap">
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
