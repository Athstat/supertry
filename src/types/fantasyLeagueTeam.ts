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
    { name: 'Front Row', position_class: 'front-row', isSpecial: false, },
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
    athlete?: IFantasyTeamAthlete,
    purchasePrice?: number,
    is_starting: boolean,
    isCaptain?: boolean
}

/** Type represents the position of a slot card */
export type SlotCardPosition = {
    x: number,
    y: number
}

export type UpdateFantasyTeamAthleteItem = {
    athlete_id: string,
    slot: number,
    purchase_price: number,
    is_starting?: boolean,
    is_captain?: boolean,
}

/** Represents the JSON req body for updating a fantasy league team athlete */
export type UpdateFantasyLeagueTeam = {
    athletes: UpdateFantasyTeamAthleteItem[],
    user_id: string
}

export type MyTeamSlotType = "obscured" | "athlete" | "empty"

export type MyTeamSwapState = {
    slot?: IFantasyLeagueTeamSlot
}

export type MyTeamModalsState = {
    showActionModal: boolean,
    showProfileModal: boolean,
    showPointsModal: boolean
}