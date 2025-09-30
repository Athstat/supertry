import { atom } from "jotai";
import { IFixture } from "../../types/games";
import { IProAthlete, PositionClass } from "../../types/athletes";
import { IFantasyAthlete } from "../../types/rugbyPlayer";
import { IFantasyTeamAthlete } from "../../types/fantasyTeamAthlete";
import { IProTeam } from "../../types/team";
import { FantasyPositionName } from "../../types/fantasyLeagueTeam";

/** Holds related games to a player picker */
const relatedGamesAtom = atom<IFixture[]>([]);

/** Holds the player to be replaced */
const playerToBeReplacedAtom = atom<IProAthlete | IFantasyAthlete | IFantasyTeamAthlete>();

/** Holds available teams to pick players from */
const availableTeamsAtom = atom<IProTeam[]>((get) => {
    const games = get(relatedGamesAtom);
    const uniqueTeams: IProTeam[] = [];

    games.forEach((g) => {
        const { team, opposition_team } = g;

        if (team && !uniqueTeams.find(t => t.athstat_id === team.athstat_id)) {
            uniqueTeams.push(team);
        }

        if (opposition_team && !uniqueTeams.find(t => t.athstat_id === opposition_team.athstat_id)) {
            uniqueTeams.push(opposition_team);
        }
    });


    return uniqueTeams;
});

/** Holds teams to filter players by */
const filterTeamsAtom = atom<IProTeam[]>([]);

/** Holds the position class to select a player from */
const positionPoolAtom = atom<string | FantasyPositionName | PositionClass>();

const onSelectPlayerAtom = atom<(player: IProAthlete) => void>();

const excludePlayersAtom = atom<(IProAthlete | IFantasyAthlete | IFantasyTeamAthlete | {tracking_id: string})[]>([]);

const maxPlayerPriceAtom = atom<number>(240);

export const playerPickerAtoms = {
    relatedGamesAtom,
    positionPoolAtom,
    filterTeamsAtom,
    availableTeamsAtom,
    playerToBeReplacedAtom,
    onSelectPlayerAtom,
    excludePlayersAtom,
    maxPlayerPriceAtom
}