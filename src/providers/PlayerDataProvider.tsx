import { ScopeProvider } from 'jotai-scope'
import { Fragment, ReactNode, useEffect, useMemo } from 'react'
import { useAtom, useAtomValue, useSetAtom } from 'jotai'
import useSWR from 'swr'
import DialogModal from '../components/shared/DialogModal'
import RoundedCard from '../components/shared/RoundedCard'
import { djangoAthleteService } from '../services/athletes/djangoAthletesService'
import { playerAtom, playerSeasonsAtom, playerCurrentSeasonAtom } from '../state/player.atoms'
import { IProAthlete } from '../types/athletes'
import { IFantasyTeamAthlete } from '../types/fantasyTeamAthlete'
import { swrFetchKeys } from '../utils/swrKeys'

type Props = {
    children?: ReactNode,
    player: IProAthlete | IFantasyTeamAthlete,
    onClose?: () => void
}

/** Provides a players data and stats down to child components */
export default function PlayerDataProvider({ children, player, onClose }: Props) {

    const atoms = [
        playerAtom,
        playerSeasonsAtom,
        playerCurrentSeasonAtom
    ]

    return (
        <ScopeProvider atoms={atoms} >
            <ProviderInner
                player={player}
                onClose={onClose}
            >
                {children}
            </ProviderInner>
        </ScopeProvider>
    )
}

function ProviderInner({ children, player, onClose }: Props) {

    const setPlayer = useSetAtom(playerAtom);
    const setSeasons = useSetAtom(playerSeasonsAtom);

    const seasonFetchKey = swrFetchKeys.getAthleteSeasons(player.tracking_id);
    const { data: seasons, isLoading: loadingSeasons } = useSWR(seasonFetchKey, () => djangoAthleteService.getAthleteSeasons(player.tracking_id));

    const playerKey = swrFetchKeys.getAthleteById(player.tracking_id);
    const {data: fetchedPlayer, isLoading: loadingPlayer} = useSWR(playerKey, () => djangoAthleteService.getAthleteById(player.tracking_id))

    const isLoading = loadingPlayer || loadingSeasons;

    useEffect(() => {

        if (fetchedPlayer) setPlayer(fetchedPlayer);
        if (seasons) setSeasons(seasons);

    }, [player, seasons, fetchedPlayer, setPlayer, setSeasons]);

    if (isLoading) {
        return <DialogModal
            open={true}
            hw='min-h-[95%] lg:w-[40%]'
            className='animate-pulse flex flex-col gap-4'
            title={player.player_name}
            onClose={onClose}
        >

            <RoundedCard className='animate-pulse bg-slate-200 dark:bg-slate-700 border-none h-[200px]' >

            </RoundedCard>

            <div className='flex flex-row  justify-between' >
                <div className='flex flex-col gap-2' >
                    <RoundedCard className='animate-pulse bg-slate-200 dark:bg-slate-700 border-none h-[20px] w-[120px]' />
                    <RoundedCard className='animate-pulse bg-slate-200 dark:bg-slate-700 border-none h-[20px] w-[60px]' />
                </div>

                <RoundedCard className='animate-pulse bg-slate-200 dark:bg-slate-700 border-none h-[20px] w-[60px]' />

            </div>

            <div className='flex flex-row gap-2 items-center' >
                <RoundedCard className='animate-pulse bg-slate-200 dark:bg-slate-700 border-none h-[60px] flex-1 ' />
                <RoundedCard className='animate-pulse bg-slate-200 dark:bg-slate-700 border-none h-[60px] flex-1' />
            </div>

            <RoundedCard className='animate-pulse bg-slate-200 dark:bg-slate-700 border-none rounded-2xl h-[100px] w-full' />
            <RoundedCard className='animate-pulse bg-slate-200 dark:bg-slate-700 border-none rounded-2xl h-[50px] w-full' />
            <RoundedCard className='animate-pulse bg-slate-200 dark:bg-slate-700 border-none rounded-2xl h-[100px] w-full' />

        </DialogModal>
    }

    return (
        <Fragment>
            {children}
        </Fragment>
    )
}

/** A hook that provides data from the PlayerDataProvider */

export function usePlayerData() {
    const [player] = useAtom(playerAtom);
    const [seasons] = useAtom(playerSeasonsAtom);
    const currentSeason = useAtomValue(playerCurrentSeasonAtom);

    const sortedSeasons = useMemo(() => {
        return [...seasons].sort((a, b) => {
            const aEnd = new Date(a.end_date);
            const bEnd = new Date(b.end_date);

            return bEnd.valueOf() - aEnd.valueOf();
        });
    }, [seasons])


    return { player, seasons, currentSeason, sortedSeasons };
}