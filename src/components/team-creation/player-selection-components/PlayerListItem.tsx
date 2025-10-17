import { twMerge } from 'tailwind-merge';
import { Position } from '../../../types/position';
import { IProAthlete } from '../../../types/athletes';
import { formatPosition, getTeamJerseyImage } from '../../../utils/athleteUtils';
import FormIndicator from '../../shared/FormIndicator';
import renderStatDots from './renderStatDots';
import { useState } from 'react';
import { WarningPopup } from '../../shared/WarningPopup';
import AvailabilityIcon from '../../players/availability/AvailabilityIcon';

type Props = {
  index?: number;
  handlePlayerSelect: (player: IProAthlete) => void;
  selectedPosition: Position;
  player: IProAthlete;
  onClose: () => void;
  handleViewPlayerProfile: (player: any, e: React.MouseEvent) => void;
  remainingBudget: number;
};

export default function PlayerListItem({
  handlePlayerSelect,
  selectedPosition,
  player,
  onClose,
  handleViewPlayerProfile,
  remainingBudget,
}: Props) {
  const canAffordPlayer = (player.price || 0) <= remainingBudget;
  const cannotAfford = !canAffordPlayer;

  const [showWarning, setShowWarning] = useState(false);
  const toggleWarning = () => setShowWarning(!showWarning);
  const [imageError, setImageError] = useState(false);

  const handleClickPlayer = () => {
    if (cannotAfford) {
      setShowWarning(true);
    } else {
      handlePlayerSelect(player);
      onClose();
    }
  };

  if (!((player.power_rank_rating ?? 0) > 0) || !((player.price ?? 0) > 0)) return;

  const imageUrl = player.team?.athstat_id
    ? getTeamJerseyImage(player.team?.athstat_id)
    : undefined;

  return (
    <>
      <div
        onClick={handleClickPlayer}
        className={twMerge(
          'flex items-center px-4 py-3 border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-dark-700 cursor-pointer transition',
          cannotAfford &&
          'opacity-40 bg-gray-200 hover:bg-gray-300 dark:bg-slate-600 dark:hover:bg-slate-700'
        )}
      >
        {/* Player image with fallback logo */}
        <div className="sm:flex w-16 h-16 rounded-full bg-gray-200 dark:bg-slate-700 flex items-center justify-center mr-4 overflow-hidden">
          {/* {player.image_url && !imageError ? (
            <img
              src={player.image_url}
              alt={player.player_name}
              className="w-16 h-16 rounded-full object-cover object-top translate-y-[5%]"
              onError={() => setImageError(true)}
            />
          ) : (
            <ScrummyLightModeLogo className="w-9 h-9 opacity-70" />
          )} */}
          <img
            src={imageUrl}
            alt={player.player_name}
            className="w-16 h-16 rounded-full object-cover object-top translate-y-[5%]"
            onError={() => setImageError(true)}
          />
        </div>
        {/* Player info */}
        <div className="flex-1 min-w-0 pr-4">
          <div className="flex items-start sm:items-center justify-between">
            <div className="font-semibold flex flex-row gap-1 items-center text-sm leading-tight break-words sm:truncate dark:text-gray-100 max-w-[150px] sm:max-w-none">
              {player.player_name}{' '}
              {player.form && player.form !== 'NEUTRAL' && <FormIndicator form={player.form} />}
            </div>
          </div>

          <div className="flex flex-row gap-1 items-center text-gray-500 dark:text-gray-400">
            <p className="text-xs  truncate">
              {player.team?.athstat_name || 'No team'}
            </p>
            <p>|</p>
            <p className="text-xs">
              {formatPosition(player.position || selectedPosition.name)}
            </p>
            <AvailabilityIcon
              athlete={player}
              className='w-4 h-4 rounded-md'
              iconClassName='w-2 h-2'
            />
          </div>

          <button
            onClick={e => handleViewPlayerProfile(player, e)}
            className="mt-1 text-blue-500 dark:text-blue-400 hover:underline transition-colors text-xs flex items-center"
            aria-label="More player information"
          >
            <span className="mr-1">→</span>
            <span>More Info</span>
          </button>
        </div>
        {/* Price - always visible */}
        {/* {player.form && <div className="w-fit lg:w-12 flex flex-row items-center justify-end">
                    <FormIndicator form={player.form} />
                  </div>} */}
        {/*
                  {player.form !== undefined && (
                    <div className="w-fit lg:w-16 flex flex-row items-center justify-start">
                      <FormIndicator form={player.form} />
                    </div>
                  )} */}
        <div className="w-7 text-center">
          <p className="font-bold text-sm dark:text-gray-200">{player.price}</p>
        </div>
        {/* Rating */}
        <div className="w-16 text-center">
          <p className="text-sm dark:text-gray-200">{(player.power_rank_rating || 0).toFixed(1)}</p>
        </div>
        {/* Stats placeholders - using power_rank_rating as a fallback */}
        <div className="hidden w-14 md:flex justify-center px-2">
          {renderStatDots(Math.round((player.power_rank_rating || 0) / 20), 'bg-red-500')}
        </div>
        <div className="hidden w-14 md:flex justify-center px-2">
          {renderStatDots(Math.round((player.power_rank_rating || 0) / 25), 'bg-blue-500')}
        </div>
        <div className="hidden w-14 md:flex justify-center px-2">
          {renderStatDots(Math.round((player.power_rank_rating || 0) / 33), 'bg-green-500')}
        </div>
      </div>

      <WarningPopup open={showWarning} onClose={toggleWarning}>
        You can't afford <strong>{player.player_name}</strong> right not now with your remaining
        budget. Free up some coins and try again
      </WarningPopup>
    </>
  );
}
