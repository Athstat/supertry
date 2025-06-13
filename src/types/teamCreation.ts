import { RugbyPlayer } from "./rugbyPlayer"

/** Object representing a single slot on team creation */
export type ITeamCreationPlayerSlot = {
    player?: RugbyPlayer,
    position: string,
    isSub?: boolean,
    slot: number
}