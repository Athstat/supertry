import { IFixture } from './fixtures';

/** Represents a single matches power ranking */
export type SingleMatchPowerRanking = {
  game: IFixture;
  updated_power_ranking: number;
  athlete_id: string;
  team_id: string;
  minutes_played?: number;
  fantasy_points?: number;
};
