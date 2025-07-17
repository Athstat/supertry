import { useSetAtom } from "jotai"
import { IProAthlete } from "../../../types/athletes"
import { comparePlayersAtom } from "../../../state/comparePlayers.atoms";
import { ReactNode, useEffect } from "react";

type Props = {
    selectedPlayers: IProAthlete[],
    children?: ReactNode
}

/** Provides data and manages state for comparing players */
export default function PlayerCompareDataProvider({selectedPlayers, children} : Props) {

    const setComparePlayers = useSetAtom(comparePlayersAtom);

    useEffect(() => {
        if(selectedPlayers) setComparePlayers(selectedPlayers);
    }, [selectedPlayers]);

    return (
        <>{children}</>
    )
}
