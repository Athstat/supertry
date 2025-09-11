import { ScopeProvider } from 'jotai-scope'
import { Fragment, ReactNode, useEffect, useMemo } from 'react'
import { IProAthlete } from '../../../types/athletes'
import { useAtom, useAtomValue, useSetAtom } from 'jotai'
import { playerAtom, playerCurrentSeasonAtom, playerSeasonsAtom } from '../../../state/player.atoms'
import { swrFetchKeys } from '../../../utils/swrKeys'
import useSWR from 'swr'
import { djangoAthleteService } from '../../../services/athletes/djangoAthletesService'
import DialogModal from '../../shared/DialogModal'
import RoundedCard from '../../shared/RoundedCard'
import { IFantasyTeamAthlete } from '../../../types/fantasyTeamAthlete'

type Props = {
    children?: ReactNode,
    player: IProAthlete | IFantasyTeamAthlete
}

/** Provides a players data and stats down to child components */
export default function PlayerDataProvider({ children, player }: Props) {

    const atoms = [
        playerAtom,
        playerSeasonsAtom,
        playerCurrentSeasonAtom
    ]

    return (
        <ScopeProvider atoms={atoms} >
            <ProviderInner
                player={player}
            >
                {children}
            </ProviderInner>
        </ScopeProvider>
    )
}

function ProviderInner({ children, player }: Props) {

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

    }, [player, seasons, fetchedPlayer]);

    if (isLoading) {
        return <DialogModal
            open={true}
            hw='min-h-[95%]'
            className='animate-pulse flex flex-col gap-4'
            title={player.player_name}
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