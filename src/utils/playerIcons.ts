import { IProAthlete, IAthleteSeasonStarRatings } from '../types/athletes';
import { SportAction, getPlayerAggregatedStat } from '../types/sports_actions';

export type PlayerIcon =
  | 'Diamond In the Ruff'
  | 'Rookie'
  | 'Scrum Master'
  | 'Ruck Master'
  | 'Speed Merchant'
  | 'Captain'
  | 'Superstar'
  | 'Media Darling'
  | 'Magician'
  | 'Mr Reliable';

export interface PlayerIconData {
  name: PlayerIcon;
  description: string;
  iconType: string;
}

export const PLAYER_ICONS: Record<PlayerIcon, PlayerIconData> = {
  'Diamond In the Ruff': {
    name: 'Diamond In the Ruff',
    description: 'A young talent destined to become the face of the rugby.',
    iconType: 'Gem'
  },
  'Rookie': {
    name: 'Rookie',
    description: 'Newcomer making their debut season in top-level rugby.',
    iconType: 'Baby'
  },
  'Scrum Master': {
    name: 'Scrum Master',
    description: 'Dominates the scrum with power and technique.',
    iconType: 'BicepFlexed'
  },
  'Ruck Master': {
    name: 'Ruck Master',
    description: 'Exceptional at securing and disrupting possession at the ruck.',
    iconType: 'Dumbell'
  },
  'Speed Merchant': {
    name: 'Speed Merchant',
    description: 'Blazing pace and electric acceleration on the field.',
    iconType: 'Zap'
  },
  'Captain': {
    name: 'Captain',
    description: 'The leader on and off the pitch—sets the tone.',
    iconType: 'Trophy'
  },
  'Superstar': {
    name: 'Superstar',
    description: 'Elite, proven player with an undeniable presence on the field.',
    iconType: 'Star'
  },
  'Media Darling': {
    name: 'Media Darling',
    description: 'A fan and media favorite—always in the spotlight.',
    iconType: 'Camera'
  },
  'Magician': {
    name: 'Magician',
    description: 'Creative and unpredictable—always has something special up his sleeve.',
    iconType: 'WandSparkles'
  },
  'Mr Reliable': {
    name: 'Mr Reliable',
    description: 'Consistent, durable, and always delivers under pressure.',
    iconType: 'Swords'
  }
};

/**
 * Algorithm to determine which icons a player should have based on their stats and profile
 */
// Color scheme helper function
export function getIconColorScheme(iconName: PlayerIcon) {
  switch (iconName) {
    case 'Diamond In the Ruff':
      return {
        bg: 'bg-gradient-to-br from-purple-400 to-purple-600',
        border: 'border-purple-300'
      };
    case 'Rookie':
      return {
        bg: 'bg-gradient-to-br from-green-400 to-green-600',
        border: 'border-green-300'
      };
    case 'Captain':
      return {
        bg: 'bg-gradient-to-br from-yellow-400 to-yellow-600',
        border: 'border-yellow-300'
      };
    case 'Superstar':
      return {
        bg: 'bg-gradient-to-br from-red-400 to-yellow-600',
        border: 'border-yellow-300'
      };
    case 'Mr Reliable':
      return {
        bg: 'bg-gradient-to-br from-slate-400 to-slate-600',
        border: 'border-slate-300'
      };
    case 'Speed Merchant':
      return {
        bg: 'bg-gradient-to-br from-blue-400 to-blue-600',
        border: 'border-blue-300'
      };
    case 'Scrum Master':
      return {
        bg: 'bg-gradient-to-br from-orange-400 to-orange-600',
        border: 'border-orange-300'
      };
    case 'Ruck Master':
      return {
        bg: 'bg-gradient-to-br from-indigo-400 to-indigo-600',
        border: 'border-indigo-300'
      };
    case 'Media Darling':
      return {
        bg: 'bg-gradient-to-br from-pink-400 to-pink-600',
        border: 'border-pink-300'
      };
    case 'Magician':
      return {
        bg: 'bg-gradient-to-br from-cyan-400 to-cyan-600',
        border: 'border-cyan-300'
      };
    default:
      return {
        bg: 'bg-gradient-to-br from-gray-400 to-gray-600',
        border: 'border-gray-300'
      };
  }
}

export function getPlayerIcons(
  player: IProAthlete,
  starRatings: IAthleteSeasonStarRatings | null,
  seasonStats: SportAction[]
): PlayerIcon[] {
  const icons: PlayerIcon[] = [];

  // Calculate age if date_of_birth is available
  const age = player.date_of_birth ?
    new Date().getFullYear() - new Date(player.date_of_birth).getFullYear() : null;

  // Get key stats
  const tries = getPlayerAggregatedStat("Tries", seasonStats)?.action_count || 0;
  const assists = getPlayerAggregatedStat("Assists", seasonStats)?.action_count || 0;
  const passes = getPlayerAggregatedStat("Passes", seasonStats)?.action_count || 0;
  const tacklesMade = getPlayerAggregatedStat("TacklesMade", seasonStats)?.action_count || 0;
  const tackleSuccess = getPlayerAggregatedStat("TackleSuccess", seasonStats)?.action_count || 0;
  const turnoversWon = getPlayerAggregatedStat("TurnoversWon", seasonStats)?.action_count || 0;
  const kicksFromHand = getPlayerAggregatedStat("KicksFromHand", seasonStats)?.action_count || 0;
  const minutesPlayed = getPlayerAggregatedStat('MinutesPlayed', seasonStats)?.action_count || 0;

  // Diamond In the Ruff - Young player with high potential (age < 23 and high power rating)
  if (age && age < 25 && (player.power_rank_rating || 0) > 75) {
    icons.push('Diamond In the Ruff');
  }

  // Rookie - Player is a rookie in their first season (age < 23 and only has stats for 1 season)
  const uniqueSeasons = new Set(seasonStats.map(stat => stat.season_id)).size;
  if (age && age < 23 && uniqueSeasons === 1) {
    icons.push('Rookie');
  }

  // Scrum Master - Forward with high strength rating
  if (isForward(player.position_class) && (starRatings?.strength || 0) > 4.0) {
    icons.push('Scrum Master');
  }

  // Ruck Master - High turnovers won and good breakdown work
  if (turnoversWon > 15 && (starRatings?.ball_carrying || 0) > 3.5) {
    icons.push('Ruck Master');
  }

  // Speed Merchant - High tries for backs or high attacking rating
  if (isBack(player.position_class) && (tries > 8 || (starRatings?.attacking || 0) > 4.0)) {
    icons.push('Speed Merchant');
  }

  // Captain - High power rating and leadership position (usually 9, 10, or 15)
  if ((player.power_rank_rating || 0) > 85 && isLeadershipPosition(player.position_class)) {
    icons.push('Captain');
  }

  // Game Changer - Very high power rating
  if ((player.power_rank_rating || 0) > 90 && minutesPlayed > 700) {
    icons.push('Superstar');
  }

  // Media Darling - High tries and assists (exciting player)
  if (tries > 10 && assists > 5) {
    icons.push('Media Darling');
  }

  // Magician - High playmaking and assists (creative player)
  if ((starRatings?.playmaking || 0) >= 3.5 && assists >= 4 && passes > 40) {
    icons.push('Magician');
  }

  // Mr Reliable
  if ((minutesPlayed || 0) >= 800) {
    icons.push('Mr Reliable');
  }

  return icons;
}

function isForward(position?: string): boolean {
  if (!position) return false;
  const forwardPositions = ['Prop', 'Hooker', 'Lock', 'Flanker', 'Number 8', 'Forward'];
  return forwardPositions.some(pos => position.toLowerCase().includes(pos.toLowerCase()));
}

function isBack(position?: string): boolean {
  if (!position) return false;
  const backPositions = ['Scrum-half', 'Fly-half', 'Centre', 'Wing', 'Fullback', 'Back'];
  return backPositions.some(pos => position.toLowerCase().includes(pos.toLowerCase()));
}

function isLeadershipPosition(position?: string): boolean {
  if (!position) return false;
  const leadershipPositions = ['Scrum-half', 'Fly-half', 'Fullback', 'Captain'];
  return leadershipPositions.some(pos => position.toLowerCase().includes(pos.toLowerCase()));
}
