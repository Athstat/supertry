import { useAtom, useAtomValue } from "jotai";
import { playerPickerAtoms } from "../../state/playerPicker/playerPicker";
import { remainingTeamBudgetAtom } from "../../state/myTeam.atoms";
import { useQueryState } from "../useQueryState";
import { fantasyLeagueAtom } from "../../state/fantasy/fantasyLeague.atoms";

/** Provides a hook to interface with the player picker component */
export function usePlayerPicker() {
    const onSelectPlayer = useAtomValue(playerPickerAtoms.onSelectPlayerAtom);
    const [filterTeams, setFilterTeams] = useAtom(playerPickerAtoms.filterTeamsAtom);
    const availbleTeams = useAtomValue(playerPickerAtoms.availableTeamsAtom);

    const positionPool = useAtomValue(playerPickerAtoms.positionPoolAtom);
    const [relatedGames] = useAtomValue(playerPickerAtoms.relatedGamesAtom);
    const leagueRound = useAtomValue(fantasyLeagueAtom);

    const remaingBudget = useAtomValue(remainingTeamBudgetAtom);

    const excludePlayers = useAtomValue(playerPickerAtoms.excludePlayersAtom);


    const [searchQuery, setSearchQuery] = useQueryState<string>('player_query');

    const maxPrice = useAtomValue(playerPickerAtoms.maxPlayerPriceAtom);

    return {
        onSelectPlayer,
        filterTeams,
        setFilterTeams,
        availbleTeams,
        positionPool,
        relatedGames,
        remaingBudget,
        searchQuery,
        setSearchQuery,
        leagueRound,
        excludePlayers,
        maxPrice
    }
}