import { Fragment, ReactNode, useEffect } from 'react'
import { fantasySeasonsAtom } from '../../../state/fantasy/fantasyLeagueScreen.atoms'
import { dashboardAtoms } from '../../../state/dashboard/dashboard.atoms'
import { ScopeProvider } from 'jotai-scope'
import { useAtom } from 'jotai'
import useSWR from 'swr'
import { fantasySeasonsService } from '../../../services/fantasy/fantasySeasonsService'
import { swrFetchKeys } from '../../../utils/swrKeys'
import { seasonService } from '../../../services/seasonsService'
import { logger } from '../../../services/logger'
import PageView from '../../../screens/PageView'
import RoundedCard from '../../shared/RoundedCard'

type Props = {
    children?: ReactNode
}

export default function DashboardDataProvider({ children }: Props) {

    const atoms = [
        fantasySeasonsAtom,
        dashboardAtoms.currentSeasonAtom,
        dashboardAtoms.currentSeasonRoundAtom,
        dashboardAtoms.seasonRoundsAtom
    ]

    return (
        <ScopeProvider atoms={atoms} >
            <InnerProvider>
                {children}
            </InnerProvider>
        </ScopeProvider>
    )
}


function InnerProvider({ children }: Props) {

    const [fantasySeasons, setFantasySeasons] = useAtom(fantasySeasonsAtom);
    const [currentSeason, setCurrentSeason] = useAtom(dashboardAtoms.currentSeasonAtom);
    const [seasonRounds, setSeasonRounds] = useAtom(dashboardAtoms.seasonRoundsAtom);
    const [, setCurrentRound] = useAtom(dashboardAtoms.currentSeasonRoundAtom);

    const seasonsKey = swrFetchKeys.getActiveFantasySeasons()
    const { data: seasonsFetched, isLoading: loadingSeasons } = useSWR(seasonsKey, () => fantasySeasonsService.getAllFantasySeasons(true));

    const roundsKey = currentSeason ? swrFetchKeys.getSeasonRounds(currentSeason.id) : null;
    const { data: roundsFetched, isLoading: loadingRounds } = useSWR(roundsKey, () => seasonService.getSeasonRounds(currentSeason?.id ?? ''))

    const isLoading = loadingRounds || loadingSeasons;

    useEffect(() => {

        if (seasonsFetched) {
            setFantasySeasons(seasonsFetched);
        }

    }, [setFantasySeasons, seasonsFetched, loadingSeasons]);


    useEffect(() => {
        if (fantasySeasons && fantasySeasons.length > 0) {
            setCurrentSeason(fantasySeasons[0]);
        }
    }, [setCurrentSeason, fantasySeasons]);

    useEffect(() => {
        if (roundsFetched) {
            setSeasonRounds(roundsFetched);
        }
    }, [roundsFetched, setSeasonRounds]);

    useEffect(() => {
        if (seasonRounds) {

            try {

                const firstActive = seasonRounds
                    .filter((r) => {
                        return r.build_up_start && r.coverage_end;
                    })
                    .find((r) => {
                        const dateNow = new Date().valueOf();
                        const start = new Date(r.build_up_start).valueOf();
                        const end = new Date(r.coverage_end).valueOf();
                        return dateNow >= start && dateNow <= end;
                    });

                const seasonsLength = seasonRounds.length;

                setCurrentRound(firstActive || seasonRounds[seasonsLength - 1]);

            } catch (err) {
                logger.error("Error setting active season round ", err);
            }
        }
    }, [seasonRounds, setCurrentRound]);


    if (isLoading) {
        return (
            <LoadingSkeleton />
        )
    }

    return (
        <Fragment>
            {children}
        </Fragment>
    )
}

function LoadingSkeleton() {
    return (
        <PageView className="flex flex-col space-y-4 p-4">

            <div className='flex flex-col gap-2' >

                <div className='flex flex-row items-center gap-2' >
                    <RoundedCard className=' bg-slate-200 h-[50px] w-[50px] border-none animate-pulse' />
                    <RoundedCard className=' bg-slate-200 h-[40px] w-[200px] border-none animate-pulse' />
                </div>

                <RoundedCard className='w-full bg-slate-200 h-[200px] border-none animate-pulse' />
                <RoundedCard className='w-full bg-slate-200 h-[50px] border-none animate-pulse' />

                <RoundedCard className=' bg-slate-200 mt-5 h-[30px] w-[200px] border-none animate-pulse' />
                <RoundedCard className='w-full bg-slate-200 h-[150px] border-none animate-pulse' />
                <RoundedCard className='w-full bg-slate-200 h-[150px] border-none animate-pulse' />
                <RoundedCard className='w-full bg-slate-200 h-[150px] border-none animate-pulse' />
                <RoundedCard className='w-full bg-slate-200 h-[150px] border-none animate-pulse' />
            </div>
        </PageView>
    )
}

