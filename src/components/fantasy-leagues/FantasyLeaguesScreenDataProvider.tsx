import { Fragment, ReactNode, useEffect } from "react"
import { fantasySeasonsAtom, SELECTED_FANTASY_SEASON_QUERY_PARAM_KEY } from "../../state/fantasy/fantasyLeagueScreen.atoms"
import { ScopeProvider } from "jotai-scope"
import useSWR from "swr"
import { swrFetchKeys } from "../../utils/swrKeys"
import { fantasySeasonsService } from "../../services/fantasy/fantasySeasonsService"
import { useSetAtom } from "jotai"
import { useQueryState } from "../../hooks/useQueryState"
import RoundedCard from "../shared/RoundedCard"
import PageView from "../../screens/PageView"

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
    const { data: seasonsFetched, isLoading: loadingSeasons } = useSWR(seasonsKey, () => fantasySeasonsService.getAllFantasySeasons(true));

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
        return (
            <PageView className="p-4 mt-0 pt-6 flex flex-col gap-4 animate-pulse" >
                <div className="flex flex-col gap-2" >
                    <RoundedCard className="w-[150px] h-[30px] bg-slate-200 border-none rounded-xl " />
                    <div className="flex flex-row items-center gap-2" >
                        <RoundedCard className="w-[100px] h-[30px] rounded-full bg-slate-200 border-none " />
                        <RoundedCard className="w-[100px] h-[30px] rounded-full bg-slate-200 border-none " />
                        <RoundedCard className="w-[100px] h-[30px] rounded-full bg-slate-200 border-none " />
                    </div>
                </div>


                <div className="flex flex-col gap-2" >
                    <RoundedCard className="w-full h-[150px] bg-slate-200 border-none rounded-xl " />
                </div>

                <div>
                    <RoundedCard className="w-[160px] h-[30px] bg-slate-200 border-none rounded-xl " />
                </div>

                <div className="flex flex-row items-center gap-2 overflow-y-auto no- justify-between" >
                    <RoundedCard className="w-full h-[40px] bg-slate-200 border-none rounded-xl " />
                    <RoundedCard className="w-full h-[40px] bg-slate-200 border-none rounded-xl " />
                </div>

                <div className="flex flex-col gap-2" >
                    <RoundedCard className="w-full h-[160px] bg-slate-200 border-none rounded-xl " />
                </div>

            </PageView>
        )
    }

    return (
        <Fragment>
            {children}
        </Fragment>
    )
}