import { useAtom, useAtomValue } from "jotai";
import { playerPickerAtoms } from "../../state/playerPicker/playerPicker";

/** Provides a hook to interface with the player picker component */
export function usePlayerPicker() {
    const onSelectPlayer = useAtomValue(playerPickerAtoms.onSelectPlayerAtom);
    const [filterTeams, setFilterTeams] = useAtom(playerPickerAtoms.filterTeamsAtom);
    const availbleTeams = useAtomValue(playerPickerAtoms.availableTeamsAtom);

    const positionPool = useAtomValue(playerPickerAtoms.positionPoolAtom);
    const [relatedGames] = useAtomValue(playerPickerAtoms.relatedGamesAtom);

    return {
        onSelectPlayer,
        filterTeams,
        setFilterTeams,
        availbleTeams,
        positionPool,
        relatedGames
    }
}