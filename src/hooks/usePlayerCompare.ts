import { useAtom, useAtomValue } from "jotai";
import { comparePlayersAtomGroup } from "../state/comparePlayers.atoms";
import { IProAthlete } from "../types/athletes";

/** Hook that provides player compare functions */
export function usePlayerCompareActions() {

    const isPicking = useAtomValue(comparePlayersAtomGroup.isCompareModePicking);

    const [compareMode, setCompareMode] = useAtom(
        comparePlayersAtomGroup.compareModeAtom
    );

    const COMPARE_LIMIT = 5;

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

    const isPlayerSelectedAlready = (player: IProAthlete, list: IProAthlete[]) => {
        return list.some(selectedPlayer => selectedPlayer.tracking_id === player.tracking_id);
    }

    const addPlayer = (player: IProAthlete) => {

        setSelectedPlayers(prev => {

            if (prev.length === COMPARE_LIMIT) {
                return prev;
            }

            const doNotAdded = isPlayerSelectedAlready(player, prev);

            if (doNotAdded) {
                return prev
            } else {
                return [...prev, player]
            }
        });
    }

    const addOrRemovePlayer = (player: IProAthlete) => {

        setSelectedPlayers(prev => {

            if (prev.length === COMPARE_LIMIT) {
                return prev;
            }

            const isAlreadyThere = isPlayerSelectedAlready(player, prev);

            if (isAlreadyThere) {
                return prev.filter((a) => {
                    return a.tracking_id !== player.tracking_id;
                })
            } else {
                return [...prev, player]
            }
        });
    }

    const addMultiplePlayers = (players: IProAthlete[]) => {

        setSelectedPlayers(prev => {
            const playersNotSelectedAlready = players.filter((p) => {
                return !isPlayerSelectedAlready(p, prev);
            })

            return [...prev, ...playersNotSelectedAlready]
        });
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

    const isCompareLimitReached = COMPARE_LIMIT === selectedPlayers.length;

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
        isPlayerSelectedAlready,
        addOrRemovePlayer,
        isCompareLimitReached,
        isPicking
    }

}
