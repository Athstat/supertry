import { createContext, ReactNode, useCallback, useMemo } from "react";
import { useQueryState } from "../../hooks/web/useQueryState";
import { queryParamKeys } from "../../types/constants";
import { useFantasySeasons } from "../../hooks/dashboard/useFantasySeasons";
import { ISeasonRound } from "../../types/fantasy/fantasySeason";
import { DjangoUserMinimal } from "../../types/auth";
import { IFantasyLeagueTeam } from "../../types/fantasyLeague";
import { useUserRoundTeam } from "../../hooks/fantasy/useUserRoundTeam";
import { KeyedMutator } from "swr";

type TeamHistoryContextProps = {
    round?: ISeasonRound,
    setRound: (r: ISeasonRound) => void,
    moveNextRound: () => void,
    movePreviousRound: () => void,
    manager?: DjangoUserMinimal,
    roundTeam?: IFantasyLeagueTeam,
    isLoading?: boolean,
    onUpdateRoundTeam: KeyedMutator<IFantasyLeagueTeam | undefined>
}

export const TeamHistoryContext = createContext<TeamHistoryContextProps | null>(null);

type Props = {
    children?: ReactNode,
    user?: DjangoUserMinimal,
    loadingFallback?: ReactNode,
    initRoundNumber?: number
}

/** Component that provides team history to its child components. 
 * Provder depends on the FantasyLeagueGroupProvider
 */
export default function TeamHistoryProvider({ children, user, initRoundNumber, loadingFallback }: Props) {
    const { seasonRounds, currentRound } = useFantasySeasons();

    const [roundNumber, setRoundNumber] = useQueryState(queryParamKeys.ROUND_NUMBER_QUERY_KEY, {
        init: initRoundNumber?.toString() || currentRound?.round_number.toString()
    });

    const maxIndex = useMemo(() => {
        return seasonRounds.findIndex((r) => {
            return r.round_number === currentRound?.round_number;
        });
    }, [currentRound?.round_number, seasonRounds]);

    const minIndex = 0;

    const round = useMemo(() => {
        return seasonRounds.find((r) => r.round_number.toString() === roundNumber)
    }, [roundNumber, seasonRounds]);

    const setRound = useCallback((r: ISeasonRound) => {
        setRoundNumber(r.round_number.toString());
    }, [setRoundNumber]);

    const shouldFetchTeam = Boolean(round);
    const { roundTeam, isLoading, mutate } = useUserRoundTeam(user?.kc_id, round?.round_number, shouldFetchTeam);

    const moveNextRound = useCallback(() => {
        const currentIndex = seasonRounds.findIndex((r) => r.round_number.toString() === roundNumber);

        if (!maxIndex || currentIndex >= maxIndex) {
            return;
        }

        const nextIndex = currentIndex + 1;
        setRoundNumber(seasonRounds[nextIndex].round_number.toString());

    }, [maxIndex, roundNumber, seasonRounds, setRoundNumber]);

    const movePreviousRound = useCallback(() => {

        const currentIndex = seasonRounds.findIndex((r) => r.round_number.toString() === roundNumber);

        if (currentIndex <= minIndex) {
            return;
        }

        const nextIndex = currentIndex - 1;
        setRoundNumber(seasonRounds[nextIndex].round_number.toString());
    }, [roundNumber, seasonRounds, setRoundNumber]);


    if (isLoading && loadingFallback) {
        return <>{loadingFallback}</>
    }

    return (
        <TeamHistoryContext.Provider
            value={{
                round, setRound, moveNextRound, movePreviousRound, manager: user,
                roundTeam, isLoading, onUpdateRoundTeam: mutate
            }}
        >
            {children}
        </TeamHistoryContext.Provider>
    )
}