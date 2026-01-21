import { createContext, ReactNode, useCallback, useMemo } from "react";
import { useQueryState } from "../../hooks/web/useQueryState";
import { queryParamKeys } from "../../types/constants";
import { useFantasySeasons } from "../../hooks/dashboard/useFantasySeasons";
import { ISeasonRound } from "../../types/fantasy/fantasySeason";
import { DjangoUserMinimal } from "../../types/auth";

type TeamHistoryContextProps = {
    round?: ISeasonRound,
    setRound: (r: ISeasonRound) => void,
    moveNextRound: () => void,
    movePreviousRound: () => void,
    manager?: DjangoUserMinimal
}

export const TeamHistoryContext = createContext<TeamHistoryContextProps | null>(null);

type Props = {
    children?: ReactNode,
    user?: DjangoUserMinimal,
    loadingFallback?: ReactNode,
}

/** Component that provides team history to its child components. 
 * Provder depends on the FantasyLeagueGroupProvider
 */
export default function TeamHistoryProvider({ children, user }: Props) {
    const {seasonRounds, currentRound} = useFantasySeasons();

    const [roundNumber, setRoundNumber] = useQueryState(queryParamKeys.ROUND_NUMBER_QUERY_KEY, {
        init: currentRound?.round_number.toString()
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

    const moveNextRound = useCallback(() => {
        const currentIndex = seasonRounds.findIndex((r) => r.round_number.toString() === roundNumber);

        if (!maxIndex || currentIndex >= maxIndex ) {
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


    return (
        <TeamHistoryContext.Provider
            value={{
                round, setRound, moveNextRound, movePreviousRound, manager: user
            }}
        >
            {children}
        </TeamHistoryContext.Provider>
    )
}