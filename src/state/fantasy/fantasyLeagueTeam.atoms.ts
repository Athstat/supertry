import { atom } from "jotai";
import { IFantasyLeagueRound, IFantasyLeagueTeam } from "../../types/fantasyLeague";
import { IFantasyLeagueTeamSlot } from "../../types/fantasyLeagueTeam";
import { IFantasyTeamAthlete } from "../../types/fantasyTeamAthlete";
import { Position } from "../../types/position";

/** Holds the fantasy league team */
export const fantasyLeagueTeamAtom = atom<IFantasyLeagueTeam>();

/** Holds the fantasy league round that a specific fantasy league team
 * belongs to */
export const fantasyLeagueTeamLeagueRoundAtom = atom<IFantasyLeagueRound>();

/** Holds team athletes */
export const fantasyTeamAthletesAtom = atom<IFantasyTeamAthlete[]>((get) => {
    const team = get(fantasyLeagueTeamAtom);
    return (team?.athletes) ?? [];
});

/** Holds the fantasy league team */
export const fantasyTeamSlotsAtom = atom<IFantasyLeagueTeamSlot[]>([]);

/** Tempral hold for the player to be swapped out of the team */
export const swapPlayerAtom = atom<IFantasyTeamAthlete>();

export type SwapState = {
    open: boolean;
    slot: number | null;
    position?: Position | null;
}

/** Holds the swap state */
export const swapStateAtom = atom<SwapState>({ open: false, slot: null, position: null });
