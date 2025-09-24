import { Fragment, ReactNode, useEffect } from "react"
import { fantasySeasonsAtom, SELECTED_FANTASY_SEASON_QUERY_PARAM_KEY } from "../../state/fantasy/fantasyLeagueScreen.atoms"
import { ScopeProvider } from "jotai-scope"
import useSWR from "swr"
import { swrFetchKeys } from "../../utils/swrKeys"
import { fantasySeasonsService } from "../../services/fantasy/fantasySeasonsService"
import { useSetAtom } from "jotai"
import { LoadingState } from "../ui/LoadingState"
import { useQueryState } from "../../hooks/useQueryState"

type Props = {
    children?: ReactNode
}

export default function FantasyLeaguesScreenDataProvider({ children }: Props) {

    const atoms = [
        fantasySeasonsAtom
    ]

    return (
        <ScopeProvider atoms={atoms}>
            <InnerProvider>
                {children}
            </InnerProvider>
        </ScopeProvider>
    )
}


function InnerProvider({ children }: Props) {

    const setFantasySeasons = useSetAtom(fantasySeasonsAtom);

    const seasonsKey = swrFetchKeys.getActiveFantasySeasons()
    const { data: seasonsFetched, isLoading: loadingSeasons } = useSWR(seasonsKey, () => fantasySeasonsService.getAllFantasySeasons(true), {
        revalidateOnFocus: false
    });

    const [selectedFantasySeasonId, setSelectedFantasySeasonId] = useQueryState<string>(
        SELECTED_FANTASY_SEASON_QUERY_PARAM_KEY
    );

    const isLoading = loadingSeasons;

    useEffect(() => {
        if (seasonsFetched) {
            setFantasySeasons(seasonsFetched);
        }

        const lastSavedValue = localStorage.getItem(
            SELECTED_FANTASY_SEASON_QUERY_PARAM_KEY
        );

        if (lastSavedValue && !selectedFantasySeasonId) {
            setSelectedFantasySeasonId(lastSavedValue)
        }
    },
        [
            seasonsFetched, setFantasySeasons,
            selectedFantasySeasonId, setSelectedFantasySeasonId
        ]
    );

    /** Sync selected fantasy season id */
    useEffect(() => {

        if (selectedFantasySeasonId) {
            localStorage.setItem(
                SELECTED_FANTASY_SEASON_QUERY_PARAM_KEY,
                selectedFantasySeasonId
            )
        } else {
            localStorage.removeItem(SELECTED_FANTASY_SEASON_QUERY_PARAM_KEY);
        }

        return () => {
            localStorage.setItem(
                SELECTED_FANTASY_SEASON_QUERY_PARAM_KEY,
                selectedFantasySeasonId
            )
        }

    }, [selectedFantasySeasonId]);

    if (isLoading) {
        <LoadingState />
    }

    return (
        <Fragment>
            {children}
        </Fragment>
    )
}