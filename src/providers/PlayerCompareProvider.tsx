import { useSetAtom } from "jotai"
import { ReactNode, useEffect } from "react";
import { ScopeProvider } from "jotai-scope";
import { IProAthlete } from "../types/athletes";
import { compareModeAtom, comparePlayersAtom, comparePlayersMapAtom, comparePlayersStarRatingsAtom, comparePlayersStatsAtom, isCompareModeModal, isCompareModePicking, openInfoTrackingIdAtom, showComparePlayerInfo } from "../state/comparePlayers.atoms";

type Props = {
    selectedPlayers?: IProAthlete[],
    children?: ReactNode
}

/** Provides data and manages state for comparing players. Also provides a scoped provider
 * that manages all the atoms needed
 */
export default function PlayerCompareProvider({ selectedPlayers = [], children }: Props) {

    const atoms = [
        comparePlayersAtom,
        comparePlayersStatsAtom,
        comparePlayersStarRatingsAtom,
        showComparePlayerInfo,
        openInfoTrackingIdAtom,
        compareModeAtom,
        isCompareModePicking,
        isCompareModeModal,
        comparePlayersMapAtom
    ]


    return (
        <ScopeProvider atoms={atoms}>
            <PlayerCompareInner
                selectedPlayers={selectedPlayers}
            >
                {children}
            </PlayerCompareInner>
        </ScopeProvider>
    )
}



export function PlayerCompareInner({ selectedPlayers = [], children }: Props) {

    const setComparePlayers = useSetAtom(comparePlayersAtom);

    useEffect(() => {
        setComparePlayers(selectedPlayers);
    }, [selectedPlayers, setComparePlayers]);

    return (
        <>{children}</>
    )

}
