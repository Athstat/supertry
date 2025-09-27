import { atom } from "jotai";
import { IFantasyLeagueTeam } from "../../types/fantasyLeague";
import { IFantasyLeagueTeamSlot } from "../../types/fantasyLeagueTeam";
import { IFantasyTeamAthlete } from "../../types/fantasyTeamAthlete";

/** Holds the fantasy league team */
export const fantasyLeagueTeamAtom = atom<IFantasyLeagueTeam>();

/** Holds team athletes */
export const fantasyTeamAthletesAtom = atom<IFantasyTeamAthlete[]>((get) => {
    const team = get(fantasyLeagueTeamAtom);
    return (team?.athletes) ?? [];
});

/** Holds the fantasy league team */
export const fantasyTeamSlotsAtom = atom<IFantasyLeagueTeamSlot[]>([]);