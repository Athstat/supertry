import { twMerge } from 'tailwind-merge';
import { formatPosition } from '../../utils/athleteUtils';
import FormIndicator from '../shared/FormIndicator';
import TeamLogo from '../team/TeamLogo';
import { IProAthlete } from '../../types/athletes';
import { useAtomValue } from 'jotai';
import { comparePlayersAtom } from '../../state/comparePlayers.atoms';
import { useState } from 'react';
import { ScrummyLightModeLogo } from '../branding/scrummy_logo';
import { CircleDollarSign } from 'lucide-react';
import { IFantasyTeamAthlete } from '../../types/fantasyTeamAthlete';

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
};

/** Renders a athlete game card that is either gold, silver or
 * bronze depending on the power ranking of the player
 *
 * does not rely on team context */

export function PlayerGameCard({
  player,
  name,
  onClick,
  className,
  blockGlow,
  hideTeamLogo = false,
  hidePrice = false,
  priceClassName,
  teamLogoClassName,
  detailsClassName,
}: Props) {
  const selectedPlayers = useAtomValue(comparePlayersAtom);

  const [imageError, setImageError] = useState<boolean>(false);

  const shouldGlow = selectedPlayers.some(a => a.tracking_id === player.tracking_id);

  const pr = player.power_rank_rating ?? 0;

  const statValue = (val: number) => Math.min(99, Math.max(0, Math.floor(val)));

  const isAvailable = true;

  // Determine position class and map to the correct background frame image
  const rawPositionClass =
    // @ts-ignore - different shapes between IProAthlete and IFantasyTeamAthlete
    ((player as any).position_class || (player as any).athlete?.position_class || '') as string;
  const positionClass = (rawPositionClass || '').toLowerCase();
  const frameByPosition: Record<string, string> = {
    'front-row': '/player_card_backgrounds/front-row-bg.png',
    'second-row': '/player_card_backgrounds/second-row-bg.png',
    'back-row': '/player_card_backgrounds/back-row-bg.png',
    'half-back': '/player_card_backgrounds/half-back-bg.png',
    back: '/player_card_backgrounds/back-bg.png',
  };
  const frameSrc = frameByPosition[positionClass] || '/player_card_backgrounds/back-bg.png';

  return (
    <div className="h-full w-full">
      <div
        onClick={onClick}
        className={twMerge(
          'group relative flex flex-col h-full transition-all duration-300 hover:scale-105 overflow-hidden transform-style-3d text-white',
          // Keep glow but avoid square borders/shadows
          shouldGlow && !blockGlow && 'animate-glow',
          className
        )}
      >
        {/* Background Frame Image */}
        <img
          src={frameSrc}
          alt=""
          aria-hidden
          className="absolute inset-0 w-full h-full object-cover z-0 pointer-events-none select-none"
        />

        {!isAvailable && (
          <div className="top-0 left-0 absolute w-full h-full bg-black/50 z-10"></div>
        )}
        {/* Player Price */}
        {!hidePrice && (
          <div className={twMerge('absolute top-10 left-4 z-[5] flex gap-1', priceClassName)}>
            <CircleDollarSign className="w-4 h-fit" />
            <h3 className="text-xs font-bold truncate flex-1">{player.price}</h3>
          </div>
        )}
        {/* Team Logo */}
        {!hideTeamLogo && (
          <div className={twMerge('absolute top-2 right-2 z-[5]', teamLogoClassName)}>
            <TeamLogo
              className="w-8 h-8 dark:text-white/40"
              url={player.team?.image_url ?? player.athlete.team.image_url}
            />
          </div>
        )}

        {/* Foreground Content Wrapper */}
        {/* Player Image */}
        <div className="relative flex-[3] overflow-hidden z-[1]">
          {!imageError && player.image_url && (
            <img
              src={player.image_url}
              alt={''}
              className="w-full object-scale-down object-top"
              onError={() => setImageError(true)}
            />
          )}

          {(imageError || !player.image_url) && (
            <div className="flex flex-col items-center justify-center w-full h-full translate-y-5">
              {/* Force light-mode logo regardless of theme, no background */}
              <ScrummyLightModeLogo className="w-24 h-24 opacity-30" />
            </div>
          )}
        </div>

        {/* Player Details */}
        <div className={twMerge('p-3 pb-8 flex-[1] z-[1] bg-black/0', detailsClassName)}>
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
