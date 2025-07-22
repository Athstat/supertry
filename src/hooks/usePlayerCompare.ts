import { useAtom, useAtomValue } from "jotai";
import { comparePlayersAtomGroup } from "../state/comparePlayers.atoms";
import { IProAthlete } from "../types/athletes";

/** Hook that provides player compare functions */
export function usePlayerCompareActions() {

    const [compareMode, setCompareMode] = useAtom(
        comparePlayersAtomGroup.compareModeAtom
    );

    const comparePlayerMap = useAtomValue(
        comparePlayersAtomGroup.comparePlayersMapAtom
    );

    const [selectedPlayers, setSelectedPlayers] = useAtom(
        comparePlayersAtomGroup.comparePlayersAtom
    )

    const showCompareModal = () => {
        setCompareMode('modal');
    }

    const closeCompareModal = () => {
        setCompareMode('picking');
    }

    const stopPicking = () => {
        setCompareMode("none");
        setSelectedPlayers([]);
    }

    const startPicking = () => {
        setCompareMode('picking');
    }

    const isPlayerSelectedAlready = (player: IProAthlete) => {
        const fPlayer = selectedPlayers.find(p => p.tracking_id === player.tracking_id);
        console.log("Some flag here ", fPlayer);
        
        return fPlayer !== undefined;
    }

    const addPlayer = (player: IProAthlete) => {
        const isAlreadyInList = isPlayerSelectedAlready(player);
        if (isAlreadyInList) return;

        console.log("Is this in the list already ", isAlreadyInList);

        setSelectedPlayers(prev => [...prev, player]);
    }

    const addMultiplePlayers = (players: IProAthlete[]) => {
        
        const playersNotSelectedAlready = players.filter((p) => {
            return !isPlayerSelectedAlready(p);
        })

        setSelectedPlayers(prev => [...prev, ...playersNotSelectedAlready]);
    }

    const removePlayer = (player: IProAthlete) => {

        setSelectedPlayers(prev => prev.filter(p => (
            p.tracking_id !== player.tracking_id
        )))
    }

    const getPlayerIndex = (player: IProAthlete) => {
        return selectedPlayers.findIndex(a => a.tracking_id === player.tracking_id);
    }

    const movePlayerLeft = (player: IProAthlete) => {
        const index = getPlayerIndex(player);
        if (index <= 0) return;

        const newArr = [...selectedPlayers];
        newArr.splice(index, 1);

        newArr.splice(index - 1, 0, player);

        setSelectedPlayers(newArr);
    }

    const movePlayerRight = (player: IProAthlete) => {
        const index = getPlayerIndex(player);
        if (index >= selectedPlayers.length) return;

        const newArr = [...selectedPlayers];
        newArr.splice(index, 1);

        newArr.splice(index + 1, 0, player);

        setSelectedPlayers(newArr);
    }

    const clearSelections = () => {
        setSelectedPlayers([])
    }

    return {
        showCompareModal,
        closeCompareModal,
        stopPicking,
        addPlayer,
        removePlayer,
        selectedPlayers,
        movePlayerLeft,
        movePlayerRight,
        compareMode,
        addMultiplePlayers,
        startPicking,
        clearSelections,
        isPlayerSelectedAlready
    }

}
