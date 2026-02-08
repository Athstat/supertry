import { Fragment, ReactNode, useEffect } from "react";
import { useSetAtom } from "jotai";
import { playerPickerAtoms } from "../state/playerPicker/playerPicker";
import { IProAthlete, PositionClass } from "../types/athletes";
import { IFantasyTeamAthlete } from "../types/fantasyTeamAthlete";
import { IFantasyAthlete } from "../types/rugbyPlayer";
import { useMyTeam } from "../hooks/fantasy/my_team/useMyTeam";

type Props = {
    children?: ReactNode,
    playerToBeReplaced?: IProAthlete | IFantasyAthlete | IFantasyTeamAthlete,
    positionPool?: PositionClass,
    title?: string,
    remainingBudget?: number,
    excludePlayers?: (IProAthlete | IFantasyAthlete | IFantasyTeamAthlete | { tracking_id: string })[],
    onClose?: () => void,
    totalSpent?: number
}

/** A component that fetches the related games and makes them availble to downward children */
export default function PlayerPickerDataProvider({ children, positionPool, playerToBeReplaced, excludePlayers}: Props) {
    const {roundGames} = useMyTeam()

    const relatedGames = roundGames;

    const setPositionPool = useSetAtom(playerPickerAtoms.positionPoolAtom);
    const setPlayerToBeReplaced = useSetAtom(playerPickerAtoms.playerToBeReplacedAtom);
    const setExcludePlayers = useSetAtom(playerPickerAtoms.excludePlayersAtom);
    const setRelatedGames = useSetAtom(playerPickerAtoms.relatedGamesAtom);

    useEffect(() => {
        if (positionPool) {
            setPositionPool(positionPool);
        }
    }, [positionPool, setPositionPool]);

    useEffect(() => {
        if (playerToBeReplaced) {
            setPlayerToBeReplaced(playerToBeReplaced);
        }
    }, [playerToBeReplaced, setPlayerToBeReplaced]);

    useEffect(() => {
        if (excludePlayers) {
            setExcludePlayers(excludePlayers);
        }
    }, [excludePlayers, setExcludePlayers]);


    useEffect(() => {
        if (relatedGames) {
            setRelatedGames(relatedGames.filter((f) => f.game_status === "not_started"));
        }
    }, [relatedGames, setRelatedGames]);


    return (
        <Fragment>
            {children}
        </Fragment>
    )
}
