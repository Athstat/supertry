import useSWR from "swr";
import { Fragment, ReactNode, useEffect } from "react";
import { useSetAtom } from "jotai";
import { playerPickerAtoms } from "../state/playerPicker/playerPicker";
import { IProAthlete, PositionClass } from "../types/athletes";
import { IFantasyTeamAthlete } from "../types/fantasyTeamAthlete";
import { IFantasyAthlete } from "../types/rugbyPlayer";
import RoundedCard from "../components/ui/cards/RoundedCard";
import { useFantasySeasons } from "../hooks/dashboard/useFantasySeasons";
import { seasonService } from "../services/seasonsService";

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
    const {currentRound: round} = useFantasySeasons();

    const key =  round ? `/seasons/${round.season}/games?round=${round.round_number}` : null;
    const { data: relatedGames, isLoading: loadingGames } = useSWR(key, () =>
        seasonService.getSeasonFixtures(round?.season || '', round?.round_number ?? '')
    );

    const isLoading = loadingGames;

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
            setRelatedGames(relatedGames);
        }
    }, [relatedGames, setRelatedGames]);

    if (isLoading) {
        return (
            <div className="flex mt-5 flex-col gap-2" >
                <RoundedCard
                    className="animate-pulse h-[50px] rounded-xl border-none bg-slate-200"
                />
                <RoundedCard
                    className="animate-pulse h-[50px] rounded-xl border-none bg-slate-200"
                />
                <RoundedCard
                    className="animate-pulse h-[50px] rounded-xl border-none bg-slate-200"
                />
                <RoundedCard
                    className="animate-pulse h-[50px] rounded-xl border-none bg-slate-200"
                />
                <RoundedCard
                    className="animate-pulse h-[50px] rounded-xl border-none bg-slate-200"
                />
                <RoundedCard
                    className="animate-pulse h-[50px] rounded-xl border-none bg-slate-200"
                />
                <RoundedCard
                    className="animate-pulse h-[50px] rounded-xl border-none bg-slate-200"
                />
                <RoundedCard
                    className="animate-pulse h-[50px] rounded-xl border-none bg-slate-200"
                />
                <RoundedCard
                    className="animate-pulse h-[50px] rounded-xl border-none bg-slate-200"
                />
            </div>
        )
    }

    return (
        <Fragment>
            {children}
        </Fragment>
    )
}
