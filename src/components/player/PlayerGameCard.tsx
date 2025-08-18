import { getPositionFrameBackground } from '../../utils/athleteUtils';
import { IProAthlete } from '../../types/athletes';
import { IFantasyTeamAthlete } from '../../types/fantasyTeamAthlete';
import { twMerge } from 'tailwind-merge';
import TeamLogo from '../team/TeamLogo';
import { useState } from 'react';
import ScrummyLogo from '../branding/scrummy_logo';

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

export function PlayerGameCard({ player, className }: Props) {
  const frameSrc = getPositionFrameBackground(player.position_class ?? '');
  const [playerImageErr, setPlayerImageErr] = useState<boolean>(false);

  return (
    <div
      className={twMerge(
        'bg-red-500 max-w-[250px] max-h-[300px]',
        'flex items-center justify-center relative',
        className
      )}
    >

      {/* Card Container */}
      <div className='relative'>
        {/* Card */}
        <img
          src={frameSrc}
          className='object-contain min-w-[200px] max-w-[200px]'
        />

        {/* Player Image - Positioned absolutely and centered on the card */}
        <div className='z-30 overflow-clip absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2' >

          <div className=' w-10 flex flex-row items-center justify-center h-10 absolute right-0' >
            {player.team?.image_url && <TeamLogo
              url={player.team.image_url}
              className='w-8 h-8'
            />}
          </div>

          <div className='min-h-[140px] relative aspect-[3/4] overflow-hidden max-h-[140px] min-w-[140px] flex flex-col items-center justify-center max-w-[140px]' >

            {!playerImageErr && <img
              src={player.image_url}
              className={twMerge(
                'w-full h-full object-cover object-top',
                "[mask-image:linear-gradient(to_bottom,black_80%,transparent)]",
                "[mask - repeat:no-repeat] [mask-size:100%_100%]",
                "[-webkit-mask-image:linear-gradient(to_bottom,black_80%,transparent)]",
                "[-webkit-mask-repeat:no-repeat]",
                "[-webkit-mask-size:100%_100%"
              )}
              onError={() => setPlayerImageErr(true)}
            />}

            {playerImageErr && (
              <ScrummyLogo className='grayscale opacity-10 h-[100px] w-[100px] ' />
            )}


          </div>

          <div className='flex flex-col items-center p-1 justify-center' >
            <p className='text-xs text-center' >{player.player_name}</p>
          </div>

          <div className='flex text-xs flex-row items-center justify-center gap-2' >
            <p className='font-bold' >{player.power_rank_rating && Math.floor(player.power_rank_rating)}</p>
            <p>{player.position}</p>
          </div>
        </div>
      </div>

    </div>
  )
}
