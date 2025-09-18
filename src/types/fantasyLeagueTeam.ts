import { PositionClass } from "./athletes";
import { IFantasyTeamAthlete } from "./fantasyTeamAthlete"

export type FantasyPositionName = 'Front Row' | 'Second Row' | 'Back Row' | 'Halfback' | 'Back' | 'Super Sub';

export type IFantasyPosition = {
    name: FantasyPositionName,
    position_class: PositionClass,

    /** Denotes whether a position is a sub position or not */
    isSpecial?: boolean
}

/** Default Fantasy Position Slots */
export const defaultFantasyPositions: IFantasyPosition[] = [
    { name: 'Front Row', position_class: 'front-row', isSpecial: false },
    { name: 'Second Row', position_class: 'second-row', isSpecial: false },
    { name: 'Back Row', position_class: 'back-row', isSpecial: false },
    { name: 'Halfback', position_class: 'half-back', isSpecial: false },
    { name: 'Back', position_class: 'back', isSpecial: false },
    { name: 'Super Sub', position_class: 'super-sub', isSpecial: true },
];


/** Represents a single slot on team creation */
export type IFantasyLeagueTeamSlot = {
    slotNumber: number,
    position: IFantasyPosition,
    athlete?: IFantasyTeamAthlete
}