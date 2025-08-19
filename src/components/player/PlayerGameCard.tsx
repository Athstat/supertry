import { getPositionFrameBackground } from '../../utils/athleteUtils';
import { IProAthlete } from '../../types/athletes';
import { IFantasyTeamAthlete } from '../../types/fantasyTeamAthlete';
import { twMerge } from 'tailwind-merge';
import TeamLogo from '../team/TeamLogo';
import { useState } from 'react';
import TeamJersey from './TeamJersey';
import { CircleDollarSign } from 'lucide-react';

type Props = {
  player: IProAthlete | IFantasyTeamAthlete;
  name?: string;
  onClick?: () => void;
  className?: string;
  blockGlow?: boolean;
  hideTeamLogo?: boolean;
  hidePrice?: boolean;
  // Optional style overrides for specific screens (e.g., PlayersScreen)
  priceClassName?: string;
  teamLogoClassName?: string;
  detailsClassName?: string;
  // Optional override for background frame image styling (to avoid cropping in specific contexts)
  frameClassName?: string;
};

/** Renders a athlete game card that is either gold, silver or
 * bronze depending on the power ranking of the player
 *
 * does not rely on team context */

export function PlayerGameCard({
  player,
  className,
  onClick,
  hidePrice = false,
  frameClassName,
}: Props) {
  const frameSrc = getPositionFrameBackground(player.position_class ?? '');
  const [playerImageErr, setPlayerImageErr] = useState<boolean>(false);

  return (
    <div
      className={twMerge(
        'min-w-[180px] max-w-[190px] lg:min-w-[200px] lg:max-w-[200px] cursor-pointer max-h-[250px] ',
        'flex items-center justify-center relative text-white dark:text-white',
        className
      )}
      onClick={onClick}
    >
      {/* Card Container */}
      <div className="relative">
        {/* Card */}
        <img
          src={frameSrc}
          className={twMerge(
            'object-contain min-w-[180px] max-w-[190px] lg:min-w-[200px] lg:max-w-[200px]',
            frameClassName
          )}
        />

        {/* Player Image - Positioned absolutely and centered on the card */}
        <div className="z-30 overflow-clip absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          {!hidePrice && (
            <div className=" w-10 flex flex-row items-center justify-center h-10 absolute left-0">
              <div className="flex flex-row items-center gap-1">
                <CircleDollarSign className="w-3 h-3" />
                <p className="text-[12px] font-bold">{player.price}</p>
              </div>
            </div>
          )}
          <div className=" w-10 flex flex-row items-center justify-center h-10 absolute right-0">
            {player.team?.image_url && <TeamLogo url={player.team.image_url} className="w-8 h-8" />}
          </div>

          <div className="min-h-[140px] max-h-[140px] relative aspect-[3/4] overflow-hidden min-w-[140px] flex flex-col items-center justify-center max-w-[140px]">
            {!playerImageErr && (
              <img
                src={player.image_url}
                className={twMerge(
                  'min-h-[120px] max-h-[120px] min-w-[120px] max-w-[120px] object-cover object-top',
                  '[mask-image:linear-gradient(to_bottom,black_80%,transparent)]',
                  '[mask - repeat:no-repeat] [mask-size:100%_100%]',
                  '[-webkit-mask-image:linear-gradient(to_bottom,black_80%,transparent)]',
                  '[-webkit-mask-repeat:no-repeat]',
                  '[-webkit-mask-size:100%_100%'
                )}
                onError={() => setPlayerImageErr(true)}
              />
            )}

            {playerImageErr && <TeamJersey teamId={player.team?.athstat_id} />}
          </div>

          <div className="flex flex-col items-center p-1 justify-center">
            <p className="text-xs truncate max-w-[130px]">{player.player_name}</p>
          </div>

          <div className="flex text-xs flex-row items-center justify-center gap-2">
            <p className="font-bold">
              {player.power_rank_rating && Math.floor(player.power_rank_rating)}
            </p>
            <p>{player.position}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
