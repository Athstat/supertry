import { useAtom, useAtomValue } from "jotai";
import { playerPickerAtoms } from "../../state/playerPicker/playerPicker";
import { fantasyLeagueAtom } from "../../state/fantasy/fantasyLeague.atoms";
import { useFantasyTeam } from "../fantasy/useFantasyTeam";

/** Provides a hook to interface with the player picker component */
export function usePlayerPicker() {
    const onSelectPlayer = useAtomValue(playerPickerAtoms.onSelectPlayerAtom);
    const [filterTeams, setFilterTeams] = useAtom(playerPickerAtoms.filterTeamsAtom);
    const availbleTeams = useAtomValue(playerPickerAtoms.availableTeamsAtom);

    const positionPool = useAtomValue(playerPickerAtoms.positionPoolAtom);
    const [relatedGames] = useAtomValue(playerPickerAtoms.relatedGamesAtom);
    const leagueRound = useAtomValue(fantasyLeagueAtom);

    const {budgetRemaining: remainingBudget} = useFantasyTeam();

    const excludePlayers = useAtomValue(playerPickerAtoms.excludePlayersAtom);


    const [searchQuery, setSearchQuery] = useAtom(playerPickerAtoms.searchQueryAtom);

    const playerToBeReplaced = useAtomValue(playerPickerAtoms.playerToBeReplacedAtom);

    const [viewType, setViewType] = useAtom(playerPickerAtoms.viewType);

    return {
        onSelectPlayer,
        filterTeams,
        setFilterTeams,
        availbleTeams,
        positionPool,
        relatedGames,
        remainingBudget,
        searchQuery,
        setSearchQuery,
        leagueRound,
        excludePlayers,
        playerToBeReplaced,
        viewType,
        setViewType
    }
}