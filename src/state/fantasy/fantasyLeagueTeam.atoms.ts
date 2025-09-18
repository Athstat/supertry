import { atom } from "jotai";
import { IFantasyLeagueTeam } from "../../types/fantasyLeague";
import { defaultFantasyPositions, IFantasyLeagueTeamSlot } from "../../types/fantasyLeagueTeam";
import { IFantasyTeamAthlete } from "../../types/fantasyTeamAthlete";

/** Holds the fantasy league team */
export const fantasyLeagueTeamAtom = atom<IFantasyLeagueTeam>();

/** Holds team athletes */
export const fantasyTeamAthletesAtom = atom<IFantasyTeamAthlete[]>([]);

/** Holds the fantasy league team */
export const fantasyTeamSlotsAtom = atom<IFantasyLeagueTeamSlot[]>((get) => {
    
    const teamAthletes: IFantasyTeamAthlete[] = get(fantasyTeamAthletesAtom);
    
    const slots = defaultFantasyPositions.map((p, index) => {
        
        const slotAthlete = teamAthletes.find((a) => a.slot === index);

        const slot: IFantasyLeagueTeamSlot = {
            position: p,
            slotNumber: index,
            athlete: slotAthlete
        }

        return slot;
    });

    return slots;
});