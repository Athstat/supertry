import { Player } from '../../../types/player';
import { Position } from '../../../types/position';

/**
 * Converts a rugby player object to our Player type
 * 
 * @param rugbyPlayer The rugby player object from API
 * @param selectedPosition The selected position to assign to player
 * @returns Player object compatible with our application
 */
export const convertToPlayer = (rugbyPlayer: any, selectedPosition: Position): Player => {
  return {
    id: rugbyPlayer.tracking_id || rugbyPlayer.id || String(Math.random()),
    name: rugbyPlayer.player_name || 'Unknown Player',
    team: rugbyPlayer.team_name || 'Unknown Team',
    position: selectedPosition.name,
    price: rugbyPlayer.price || 0,
    points: rugbyPlayer.power_rank_rating || 0,
    image_url: rugbyPlayer.image_url || '',
    power_rank_rating: rugbyPlayer.power_rank_rating || 0,
    points_kicking: rugbyPlayer.points_kicking || 0,
    tackling: rugbyPlayer.tackling || 0,
    infield_kicking: rugbyPlayer.infield_kicking || 0,
    strength: rugbyPlayer.strength || 0,
    playmaking: rugbyPlayer.playmaking || 0,
    ball_carrying: rugbyPlayer.ball_carrying || 0,
  };
};

export default convertToPlayer;
