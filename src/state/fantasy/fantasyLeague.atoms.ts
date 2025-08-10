import { atom } from "jotai";
import { IFantasyLeagueRound, IFantasyLeagueTeam } from "../../types/fantasyLeague";
import { isLeagueLocked } from "../../utils/leaguesUtils";

/** Fantasy League Atom */
export const fantasyLeagueAtom = atom<IFantasyLeagueRound>();

/** Is League Locked Atom */
export const fantasyLeagueLockedAtom = atom((get) => {
    const league = get(fantasyLeagueAtom);
    return isLeagueLocked(league?.join_deadline);
});

export const userFantasyTeamAtom = atom<IFantasyLeagueTeam>();