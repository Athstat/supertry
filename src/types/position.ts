import { IFantasyTeamAthlete } from "./fantasyTeamAthlete";
import { RugbyPlayer } from "./rugbyPlayer";

export type BasePositionType = {
  id: string;
  name: string;
  shortName: string;
  x: string;
  y: string;
  positionClass?: string;
  isSpecial?: boolean;
}

export type Position = BasePositionType & {
  player?: IFantasyTeamAthlete;
}

export type TeamCreationPositionSlot = BasePositionType & {
  player?: RugbyPlayer;
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



export type CreateTeamPositon = {
  name: string, 
  position_class: string
}