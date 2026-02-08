import { IProAthlete, PositionClass } from "../../types/athletes";
import { ISeasonRound } from "../../types/fantasy/fantasySeason";
import { IFantasyLeagueTeam } from "../../types/fantasyLeague";
import { defaultFantasyPositions, FantasyPositionName, IFantasyLeagueTeamSlot, IFantasyPosition } from "../../types/fantasyLeagueTeam";
import { IFantasyTeamAthlete } from "../../types/fantasyTeamAthlete";
import { formatPosition, hashFantasyTeamAthletes, sortFantasyTeamAthletes } from "../athletes/athleteUtils";

/** Gets storage key for saving team in local storage */
export function getMyTeamStorageKey(leagueRoundId: string | number, authUserId: string) {
    return `local-team-save-for-user-${authUserId}-for-round-${leagueRoundId}`;
}

export function getSlotsFromTeam(team: IFantasyLeagueTeam): IFantasyLeagueTeamSlot[] {
    return team.athletes.map((a) => {

        const defaultPosition = {
            name: formatPosition(a.position_class) as FantasyPositionName,
            position_class: (a.position_class || '') as PositionClass,
            isSpecial: !a.is_starting
        } as IFantasyPosition

        return {
            athlete: a,
            slotNumber: a.slot,
            purchasePrice: a.purchase_price,
            is_starting: Boolean(a.is_starting),
            isCaptain: Boolean(a.is_captain),
            position: defaultFantasyPositions.at(a.slot) ?? defaultPosition
        }
    }).sort((a, b) => {
        return (a.slotNumber) - (b.slotNumber);
    })
}

/** Takes a slot and sets a player at a slot in place */
export function setPlayerAtSlot(team: IFantasyLeagueTeam, slots: IFantasyLeagueTeamSlot[], slotNumber: number, newPlayer: IProAthlete) : IFantasyLeagueTeamSlot[] {
    return slots.map((s) => {
        if (s.slotNumber === slotNumber) {
            const newSlot = {
                ...s,
                athlete: {
                    ...newPlayer,
                    is_captain: s.isCaptain,
                    team_id: team.id,
                    purchase_price: newPlayer.price ?? 0,
                    slot: s.slotNumber,
                    id: new Date().valueOf(), // temporal id,
                    athlete_id: newPlayer.tracking_id,
                    is_starting: s.slotNumber < 6,
                    athlete_team_id: newPlayer.team?.athstat_id,
                    athlete: newPlayer,
                    is_super_sub: s.slotNumber >= 6,
                    score: 0,
                },
                purchasePrice: newPlayer.price,
            }

            return newSlot;
        }

        return s;
    })
}

/** Returns true if the hash of a team and its slots are the same */
export const hashCompareFantasyTeams = (team: IFantasyLeagueTeam, slots: IFantasyLeagueTeamSlot[]) => {    

    let oldAthletes = (team?.athletes) ?? [];
    let newAthletes: IFantasyTeamAthlete[] = [];

    slots.forEach((s) => {
        if (s.athlete) {
            newAthletes.push(s.athlete);
        }
    });

    oldAthletes = sortFantasyTeamAthletes(oldAthletes);
    newAthletes = sortFantasyTeamAthletes(newAthletes);

    const oldAthletesHash = hashFantasyTeamAthletes(oldAthletes);
    const newAthletesHash = hashFantasyTeamAthletes(newAthletes);

    return oldAthletesHash === newAthletesHash;

};

export function getMyTeamViewMode(round?: ISeasonRound, roundTeam?: IFantasyLeagueTeam, isLocked?: boolean) {
    
    if (round && roundTeam) {
      return 'pitch-view';
    }

    if (isLocked && roundTeam === undefined) {
      return 'no-team-locked';
    }

    if (!isLocked && roundTeam === undefined) {
      return 'create-team';
    }

    return 'error';
}

export function hashFantasyTeam(team: IFantasyLeagueTeam) {
    const teamAthletesStr = team.athletes.reduce((str, curr) => {
        return str + `slot-${curr.slot}-${curr.athlete?.tracking_id}-`;
    }, '');

    return `${team.id}-club_id=${team.team_id}-${team.user_id}-${teamAthletesStr}`;
}