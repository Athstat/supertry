import { IFantasyTeamAthlete } from "./fantasyTeamAthlete";

export interface Position {
  id: string;
  name: string;
  shortName: string;
  x: string;
  y: string;
  positionClass?: string;
  isSpecial?: boolean;
  player?: IFantasyTeamAthlete;
}

export interface FantasyTeamPosition {
  id: string;
  name: string;
  shortName: string;
  x: string;
  y: string;
  positionClass?: string;
  isSpecial?: boolean;
}

