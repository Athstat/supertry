import { useAtomValue, useAtom } from 'jotai';
import {
  fantasyTeamAthletesAtom,
  remainingTeamBudgetAtom,
  teamCaptainIdAtom,
  fantasyTeamAtom,
} from '../../state/myTeam.atoms';
import { MAX_TEAM_BUDGET } from '../../types/constants';
import { Coins, Lock, Award } from 'lucide-react';
import { fantasyLeagueLockedAtom } from '../../state/fantasyLeague.atoms';
import { IFantasyTeamAthlete } from '../../types/fantasyTeamAthlete';
import { FantasyTeamPosition, Position } from '../../types/position';
import { useMemo, useState } from 'react';
import { twMerge } from 'tailwind-merge';
import PlayerMugshotPlayerHolder from '../player/PlayerMugshotPlayerHolder';
import { formatPosition } from '../../utils/athleteUtils';
import { useMyTeamScreenActions } from './MyTeamActions';
import { fantasyTeamService } from '../../services/fantasyTeamService';

type Props = {};

export function EditFantasyTeamView({}: Props) {
  const remainingBudget = useAtomValue(remainingTeamBudgetAtom);
  const athletes = useAtomValue(fantasyTeamAthletesAtom);

  const { handleViewStats, handleSwapPlayer } = useMyTeamScreenActions();

  const positionList = useMemo(() => {
    if (!athletes?.length) return [];

    const positions: Position[] = [];

    // Add regular position players (non-super sub)

    athletes.forEach(athlete => {
      if (athlete.is_starting) {
        positions.push({
          id: athlete.athlete_id || '',
          name: athlete.position_class || 'Unknown Position',
          shortName: (athlete.position_class || '').substring(0, 2).toUpperCase(),
          x: '0',
          y: '0',
          player: athlete,
        });
      }
    });

    // Add Substitute at the back
    athletes.forEach(athlete => {
      if (!athlete.is_starting) {
        positions.push({
          id: athlete.athlete_id || '',
          name: athlete.position_class || 'Unknown Position',
          shortName: (athlete.position_class || '').substring(0, 2).toUpperCase(),
          x: '0',
          y: '0',
          player: athlete,
        });
      }
    });

    return positions;
  }, [athletes]);

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">Edit Your Team</h2>
        <div className="flex items-center gap-1">
          <Coins size={14} className="text-yellow-500 dark:text-yellow-400" />
          <span className="text-xs font-medium whitespace-nowrap dark:text-gray-400">
            {remainingBudget} / {MAX_TEAM_BUDGET}
          </span>
        </div>
      </div>

      {/* Position Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pt-4">
        {positionList.map((position, index) => {
          const { player } = position;
          const isSub = !player?.is_starting;

          return (
            <div
              key={index}
              className={twMerge(
                'bg-white dark:bg-dark-800 rounded-lg shadow-md p-4 transition hover:shadow-lg border h-[290px] flex flex-col items-center justify-center w-full',
                isSub &&
                  'border-orange-200 dark:border-orange-700 bg-orange-50 dark:bg-orange-900/10',
                !isSub && 'border-gray-100 dark:border-gray-700'
              )}
            >
              {position.player ? (
                <EditTeamViewPlayerCard
                  player={position.player}
                  position={position}
                  index={index}
                  onSwapOutPlayer={handleSwapPlayer}
                  onViewStats={handleViewStats}
                />
              ) : (
                <AddPlayerCard position={position} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

type PlayerCardProps = {
  onSwapOutPlayer?: (player: IFantasyTeamAthlete) => void;
  onViewStats?: (player: IFantasyTeamAthlete) => void;
  player: IFantasyTeamAthlete;
  position: FantasyTeamPosition;
  index: number;
};

export function EditTeamViewPlayerCard({
  onSwapOutPlayer,
  onViewStats,
  player,
  position,
}: PlayerCardProps) {
  const isEditLocked = useAtomValue(fantasyLeagueLockedAtom);
  const { is_starting, image_url, player_name, team_name, purchase_price } = player;
  const isSub = !is_starting;
  const [captainId, setCaptainId] = useAtom(teamCaptainIdAtom);
  const team = useAtomValue(fantasyTeamAtom);
  const [isUpdating, setIsUpdating] = useState(false);

  const isCaptain = player.tracking_id === captainId;

  const handleViewStats = () => {
    if (onViewStats) {
      onViewStats(player);
    }
  };

  const handleSwapOutPlayer = () => {
    if (onSwapOutPlayer) {
      onSwapOutPlayer(player);
    }
  };

  const handleToggleCaptain = async () => {
    if (isEditLocked || isUpdating || !team?.id) return;

    // If this player is already captain, do nothing
    if (isCaptain) {
      return;
    }

    try {
      setIsUpdating(true);

      // Set this player as captain
      console.log('Setting captain:', player.player_name, player.tracking_id);

      // Make sure we have the tracking_id
      if (!player.tracking_id) {
        console.error('Missing tracking_id for player:', player);
        setIsUpdating(false);
        return;
      }

      console.log('Player tracking_id:', player.tracking_id);
      console.log('Team ID:', team.id);

      try {
        const result = await fantasyTeamService.updateTeamCaptain(team.id, player.tracking_id);
        console.log('API Response (set captain):', result);
        // Update UI state
        setCaptainId(player.tracking_id);
      } catch (apiError) {
        console.error('API Error (set captain):', apiError);
        throw apiError;
      }
    } catch (error) {
      console.error('Error updating captain:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <>
      {/* Player image with captain badge */}
      <div className="w-16 h-16 mb-2 relative border-red">
        <div
          className={twMerge(
            'w-16 h-16 rounded-full flex items-center justify-center overflow-hidden',
            isSub ? 'bg-gray-300 border-2 border-orange-300 dark:border-orange-600' : 'bg-gray-300',
            isCaptain &&
              'border-2 border-yellow-400 dark:border-yellow-500 ring-2 ring-yellow-400/30 dark:ring-yellow-500/30'
          )}
        >
          {image_url ? (
            <img
              src={image_url}
              alt={player_name}
              className="w-16 h-16 rounded-full object-cover"
            />
          ) : (
            <PlayerMugshotPlayerHolder playerName={player_name} />
          )}
        </div>
      </div>

      {/* Position name with badge for Super Sub */}
      <div className="flex flex-col items-center">
        <h3
          className={twMerge(
            'font-bold text-sm mb-1',
            isSub && 'text-orange-600 dark:text-orange-400',
            !isSub && 'text-gray-800 dark:text-white'
          )}
        >
          {formatPosition(position.name)}
        </h3>

        {isSub && (
          <span className="text-xs bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 px-2 py-0.5 rounded-full mb-1">
            Super Sub
          </span>
        )}

        {isCaptain && (
          <span className="text-xs bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400 px-2 py-0.5 rounded-full mb-1 flex items-center">
            <Award className="w-3 h-3 mr-1" />
            Team Captain
          </span>
        )}
      </div>

      {/* Player name */}
      <p className="text-xs text-center font-medium mb-1 text-gray-900 dark:text-gray-300">
        {player_name}
      </p>

      {/* Team & price */}
      <div className="flex justify-between w-full text-xs mb-3">
        <span className="text-gray-500 dark:text-gray-400">{team_name}</span>
        <span className="font-bold dark:text-gray-200 flex items-center">
          <Coins size={14} className="text-yellow-500 dark:text-yellow-400 mr-1" />
          {purchase_price}
        </span>
      </div>

      {/* Action buttons */}
      <div className="w-full flex flex-col gap-2">
        <button
          onClick={handleViewStats}
          className="w-full py-1.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-md text-xs font-medium hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors"
        >
          View Stats
        </button>

        {!isEditLocked && (
          <>
            <button
              onClick={handleSwapOutPlayer}
              className="w-full py-1.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-md text-xs font-medium hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors"
            >
              Swap
            </button>

            <button
              onClick={handleToggleCaptain}
              disabled={isUpdating || isCaptain}
              className={twMerge(
                'w-full py-1.5 rounded-md text-xs font-medium transition-colors flex items-center justify-center',
                isCaptain
                  ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 hover:bg-yellow-200 dark:hover:bg-yellow-900/50'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700',
                isUpdating && 'opacity-75 cursor-wait',
                isCaptain && 'cursor-not-allowed opacity-70'
              )}
            >
              <Award className="w-3.5 h-3.5 mr-1.5" />
              {isCaptain ? 'Team Captain' : 'Make Captain'}
            </button>
          </>
        )}

        {isEditLocked && (
          <button className="w-full py-1.5 flex flex-row items-center justify-center gap-1 opacity-45 cursor-not-allowed bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-md text-xs font-medium hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors">
            Swap
            <Lock className="w-3 h-3" />
          </button>
        )}
      </div>
    </>
  );
}

type AddPlayerCardProps = {
  position: FantasyTeamPosition;
  onSelectPosition?: (position: FantasyTeamPosition) => {};
};

function AddPlayerCard({ position, onSelectPosition }: AddPlayerCardProps) {
  const handleClick = () => {
    if (onSelectPosition) {
      onSelectPosition(position);
    }
  };

  return (
    <>
      <div className="w-16 h-16 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center mb-2">
        <span className="text-2xl text-gray-500 dark:text-gray-300">+</span>
      </div>
      <h3
        className={`font-bold text-sm mb-1 ${
          position.isSpecial
            ? 'text-orange-600 dark:text-orange-400'
            : 'text-gray-800 dark:text-white'
        }`}
      >
        {position.name}
      </h3>
      <p className="text-xs text-gray-500 dark:text-gray-400">
        Add {position.name}
        {position.isSpecial && (
          <span className="block text-orange-500 font-semibold mt-0.5">Any Position</span>
        )}
      </p>
      <button
        onClick={handleClick}
        className="mt-2 text-xs py-1 px-3 bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 rounded-full"
      >
        Click to add
      </button>
    </>
  );
}
