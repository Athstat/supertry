import { IProAthlete, IAthleteSeasonStarRatings } from '../types/athletes';
import { SportAction, getPlayerAggregatedStat } from '../types/sports_actions';

export type PlayerIcon = 
  | 'Diamond In the Ruff'
  | 'Rookie' 
  | 'Scrum Master'
  | 'Ruck Master'
  | 'Speed Merchant'
  | 'Captain'
  | 'Game Changer'
  | 'Media Darling'
  | 'Magician';

export interface PlayerIconData {
  name: PlayerIcon;
  description: string;
  iconType: string;
}

export const PLAYER_ICONS: Record<PlayerIcon, PlayerIconData> = {
  'Diamond In the Ruff': {
    name: 'Diamond In the Ruff',
    description: 'Young player who is future face of the game',
    iconType: 'Award'
  },
  'Rookie': {
    name: 'Rookie',
    description: 'Player is a rookie in their first season',
    iconType: 'User'
  },
  'Scrum Master': {
    name: 'Scrum Master',
    description: 'Player is very good in the scrum',
    iconType: 'Shield'
  },
  'Ruck Master': {
    name: 'Ruck Master',
    description: 'Player is very good at the Ruck',
    iconType: 'Users'
  },
  'Speed Merchant': {
    name: 'Speed Merchant',
    description: 'Player is very quick and fast',
    iconType: 'Zap'
  },
  'Captain': {
    name: 'Captain',
    description: 'Player is a captain',
    iconType: 'Trophy'
  },
  'Game Changer': {
    name: 'Game Changer',
    description: 'Player has the ability to tilt the balance of the game for his team',
    iconType: 'Zap'
  },
  'Media Darling': {
    name: 'Media Darling',
    description: 'The media loves this guy',
    iconType: 'Mail'
  },
  'Magician': {
    name: 'Magician',
    description: 'Very smart and elusive player, that can always pull one out of the back of tricks',
    iconType: 'Sparkles'
  }
};

/**
 * Algorithm to determine which icons a player should have based on their stats and profile
 */
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
  const tacklesMade = getPlayerAggregatedStat("TacklesMade", seasonStats)?.action_count || 0;
  const tackleSuccess = getPlayerAggregatedStat("TackleSuccess", seasonStats)?.action_count || 0;
  const turnoversWon = getPlayerAggregatedStat("TurnoversWon", seasonStats)?.action_count || 0;
  const kicksFromHand = getPlayerAggregatedStat("KicksFromHand", seasonStats)?.action_count || 0;
  const minutesPlayed = getPlayerAggregatedStat('MinutesPlayed', seasonStats)?.action_count || 0;

  // Diamond In the Ruff - Young player with high potential (age < 23 and high power rating)
  if (age && age < 23 && (player.power_rank_rating || 0) > 75) {
    icons.push('Diamond In the Ruff');
  }

  // Rookie - Young player with limited minutes (age < 22 and low minutes)
  if (age && age < 22 && minutesPlayed < 500) {
    icons.push('Rookie');
  }

  // Scrum Master - Forward with high strength rating
  if (isForward(player.position_class) && (starRatings?.strength || 0) > 80) {
    icons.push('Scrum Master');
  }

  // Ruck Master - High turnovers won and good breakdown work
  if (turnoversWon > 15 && (starRatings?.ball_carrying || 0) > 75) {
    icons.push('Ruck Master');
  }

  // Speed Merchant - High tries for backs or high attacking rating
  if (isBack(player.position_class) && (tries > 8 || (starRatings?.attacking || 0) > 85)) {
    icons.push('Speed Merchant');
  }

  // Captain - High power rating and leadership position (usually 9, 10, or 15)
  if ((player.power_rank_rating || 0) > 85 && isLeadershipPosition(player.position_class)) {
    icons.push('Captain');
  }

  // Game Changer - Very high power rating
  if ((player.power_rank_rating || 0) > 90) {
    icons.push('Game Changer');
  }

  // Media Darling - High tries and assists (exciting player)
  if (tries > 10 && assists > 5) {
    icons.push('Media Darling');
  }

  // Magician - High playmaking and assists (creative player)
  if ((starRatings?.playmaking || 0) > 80 && assists > 8) {
    icons.push('Magician');
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
