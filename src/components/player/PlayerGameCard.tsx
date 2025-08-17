import { twMerge } from 'tailwind-merge';
import { formatPosition } from '../../utils/athleteUtils';
import FormIndicator from '../shared/FormIndicator';
import TeamLogo from '../team/TeamLogo';
import { CardTier, IProAthlete } from '../../types/athletes';
import { useAtomValue } from 'jotai';
import { comparePlayersAtom } from '../../state/comparePlayers.atoms';
import { useState } from 'react';
import ScrummyLogo from '../branding/scrummy_logo';
import { CircleDollarSign } from 'lucide-react';
import { IFantasyTeamAthlete } from '../../types/fantasyTeamAthlete';

type Props = {
  player: IProAthlete | IFantasyTeamAthlete;
  name?: string;
  onClick?: () => void;
  className?: string;
  blockGlow?: boolean;
  hideTeamLogo?: boolean;
  hidePrice?: boolean
};



/** Renders a athlete game card that is either gold, silver or
 * bronze depending on the power ranking of the player
 *
 * does not rely on team context */

export function PlayerGameCard({ player, name, onClick, className, blockGlow, hideTeamLogo = false, hidePrice = false }: Props) {
  const selectedPlayers = useAtomValue(comparePlayersAtom);

  const [imageError, setImageError] = useState<boolean>(false);

  const shouldGlow = selectedPlayers.some((a) => (
    a.tracking_id === player.tracking_id
  ));


  const pr = player.power_rank_rating ?? 0;
  const cardTier: CardTier =
    pr <= 69 ? 'bronze' : pr >= 70 && pr < 80 ? 'silver' : pr >= 90 ? 'blue' : 'gold';

  const statValue = (val: number) => Math.min(99, Math.max(0, Math.floor(val)));

  const isAvailable = true;

  return (
    <div className="h-full w-full">
      <div
        onClick={onClick}
        className={twMerge(
          'group relative shadow-xl rounded-lg flex flex-col h-full transition-all duration-300 hover:scale-105 hover:shadow-2xl overflow-hidden transform-style-3d text-white',
          cardTier === 'gold' && 'bg-gradient-to-br from-yellow-300 via-yellow-500 to-yellow-700 ',
          cardTier === 'silver' && 'bg-gradient-to-br from-gray-300 via-gray-400 to-gray-600',
          cardTier === 'bronze' &&
          'bg-gradient-to-br from-amber-600 via-amber-800 to-amber-900 text-white',
          cardTier === 'blue' &&
          'bg-gradient-to-br from-purple-600 via-blue-800 to-purple-900 text-white',
          shouldGlow && !blockGlow && 'animate-glow border border-yellow-500',
          className
        )}
      >
        {!isAvailable && (
          <div className="top-0 left-0 absolute w-full h-full bg-black/50 z-10"></div>
        )}
        {/* Player Price */}
        {!hidePrice && <div className="absolute top-2 left-2 z-[5] flex gap-1">
          <CircleDollarSign className="w-4 h-fit" />
          <h3 className="text-xs font-bold truncate flex-1">{player.price}</h3>
        </div>}
        {/* Team Logo */}
        {!hideTeamLogo && <div className="absolute top-2 right-2 z-[5]">
          <TeamLogo
            className="w-8 h-8 dark:text-white/40"
            url={player.team?.image_url ?? player.athlete.team.image_url}
          />
        </div>}

        {/* Player Image */}
        <div className="relative flex-[3] overflow-hidden bg-gradient-to-b from-transparent to-black/20">

          {!imageError && player.image_url && <img
            src={player.image_url}
            alt={""}
            className="w-full object-scale-down object-top"
            onError={() => setImageError(true)}
          />}

          {imageError || !player.image_url && (
            <div className='flex flex-col items-center justify-center w-full h-full' >
              <ScrummyLogo className='w-32 h-32 opacity-20 grayscale ' />
            </div>
          )}

        </div>

        {/* Player Details */}
        <div
          className={twMerge(
            'p-3 flex-[1]',
            cardTier === 'gold' && 'bg-yellow-500/10',
            cardTier === 'silver' && 'bg-gray-500/10',
            cardTier === 'bronze' && 'bg-amber-900/10',
            cardTier === 'blue' && 'bg-blue-900/10'
          )}
        >
          {/* Player name and form */}
          <div className="flex items-center justify-between gap-2 mb-1">
            <h3 className="text-xs text-left font-bold truncate flex-1">{player.player_name}</h3>
            {player.form && (player.form === 'UP' || player.form === 'DOWN') && (
              <FormIndicator form={player.form} />
            )}
          </div>

          {/* Position and Rating */}
          <div className="flex justify-between items-center text-sm">
            <div className="font-bold text-xs truncate">
              {formatPosition(player.position ?? '')}
            </div>
            <div className="text-xs font-medium flex flex-row items-center justify-end text-nowrap">
              PR {statValue(pr)}
            </div>
          </div>

          {/* Position and Rating */}
          <div className="text-xs mt-1 text-left truncate">{name}</div>

          {/* Stats Grid */}
          {/* <div className="grid grid-cols-3 gap-1 text-xs">
            <div className="flex justify-between">
              <span>ATT</span>
              <span>{statValue(player.ball_carrying ?? 0)}</span>
            </div>
            <div className="flex justify-between">
              <span>DEF</span>
              <span>{statValue(player.tackling ?? 0)}</span>
            </div>
            <div className="flex justify-between">
              <span>KCK</span>
              <span>{statValue(player.points_kicking ?? 0)}</span>
            </div>
          </div> */}
        </div>
      </div>
    </div>
  );
}
