import { ScopeProvider } from 'jotai-scope'
import { playerProfileCareerSeasons, playerProfileCareerStarRatings, playerProfileCareerStatsAtom, playerProfileCurrSeason, playerProfileCurrStarRatings, playerProfileCurrStatsAtom, playerProfilePlayerAtom, playerProfileStatsLoadingAtom } from '../../../state/playerProfile.atoms'
import { Fragment, ReactNode, useEffect } from 'react'
import useSWR from 'swr'
import { djangoAthleteService } from '../../../services/athletes/djangoAthletesService'
import { swrFetchKeys } from '../../../utils/swrKeys'
import { IProAthlete } from '../../../types/athletes'
import { useSetAtom } from 'jotai'

type Props = {
    children?: ReactNode,
    player: IProAthlete
}

/** Provides a players data and stats down to child components */
export default function PlayerDataProvider({ children, player }: Props) {

    const atoms = [
        playerProfilePlayerAtom,
        playerProfileCareerStarRatings,
        playerProfileCareerStatsAtom,
        playerProfileCareerSeasons,
        playerProfileCurrSeason,
        playerProfileCurrStatsAtom,
        playerProfileCurrStarRatings,
        playerProfileStatsLoadingAtom
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

    const setCareerStars = useSetAtom(playerProfileCareerStarRatings);
    const setCareerStats = useSetAtom(playerProfileCareerStatsAtom);
    const setLoading = useSetAtom(playerProfileStatsLoadingAtom);

    const careerStatsKey = swrFetchKeys.getAthleteAggregatedStats(player.tracking_id);
    let { data: careerStats, isLoading: loadingStats } = useSWR(careerStatsKey, () => djangoAthleteService.getAthleteSportsActions(player.tracking_id));

    const careerStarsKey = swrFetchKeys.getAthleteCareerStarRatings(player.tracking_id);
    const { data: careerStars, isLoading: loadingStars } = useSWR(careerStarsKey, () =>
        djangoAthleteService.getAthleteCareerStarRatings(player.tracking_id)
    );

    useEffect(() => {
        if (careerStars) setCareerStars(careerStars);
        if (careerStats) setCareerStats(careerStats);

        setLoading(loadingStars || loadingStats);

    }, [careerStars, careerStats, loadingStars, loadingStats]);


    return (
        <Fragment>
            {children}
        </Fragment>
    )
}