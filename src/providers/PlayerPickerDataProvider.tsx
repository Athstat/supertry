import useSWR from "swr";
import { Fragment, ReactNode, useEffect } from "react";
import { useSetAtom } from "jotai";
import { fantasyLeagueGroupsService } from "../services/fantasy/fantasyLeagueGroupsService";
import { fantasyLeagueAtom } from "../state/fantasy/fantasyLeague.atoms";
import { playerPickerAtoms } from "../state/playerPicker/playerPicker";
import { IProAthlete, PositionClass } from "../types/athletes";
import { IFantasyLeagueRound } from "../types/fantasyLeague";
import { IFantasyTeamAthlete } from "../types/fantasyTeamAthlete";
import { IFantasyAthlete } from "../types/rugbyPlayer";
import { swrFetchKeys } from "../utils/swrKeys";
import RoundedCard from "../components/ui/cards/RoundedCard";

type Props = {
    leagueRound?: IFantasyLeagueRound,
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
export default function PlayerPickerDataProvider({ leagueRound, children, positionPool, playerToBeReplaced, excludePlayers}: Props) {
    const round = leagueRound;
    
    const key =  round ? swrFetchKeys.getGroupRoundGames(round.fantasy_league_group_id, round.id) : null;
    const { data: relatedGames, isLoading: loadingGames } = useSWR(key, () =>
        fantasyLeagueGroupsService.getGroupRoundGames(round?.fantasy_league_group_id ?? '', round?.id ?? '')
    );

    const isLoading = loadingGames;

    const setTargetRound = useSetAtom(fantasyLeagueAtom);
    const setPositionPool = useSetAtom(playerPickerAtoms.positionPoolAtom);
    const setPlayerToBeReplaced = useSetAtom(playerPickerAtoms.playerToBeReplacedAtom);
    const setExcludePlayers = useSetAtom(playerPickerAtoms.excludePlayersAtom);
    const setRelatedGames = useSetAtom(playerPickerAtoms.relatedGamesAtom);

    useEffect(() => {
        if (leagueRound) {
            setTargetRound(leagueRound);
        }
    }, [leagueRound, setTargetRound]);

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
