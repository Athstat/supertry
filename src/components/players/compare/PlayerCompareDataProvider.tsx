import { ReactNode, useEffect } from "react"
import { RugbyPlayer } from "../../../types/rugbyPlayer"
import { useSetAtom } from "jotai"
import { comparePlayersAtom, comparePlayersStatsAtom } from "../../../state/playerCompare.atoms"
import { SportAction } from "../../../types/sports_actions"
import { athleteService } from "../../../services/athleteService"
import { URC_COMPETIION_ID } from "../../../types/constants"
import { logger } from "../../../services/logger"
import useSWR from "swr"
import { LoadingState } from "../../ui/LoadingState"

type Props = {
    comparePlayers: RugbyPlayer[],
    children?: ReactNode
}

/** Provides data for the player compare modal */
export function PlayerCompareDataProvider({ comparePlayers, children }: Props) {

    // set compare athletes to atom
    // fetch the stats of each player using compare player fetcher
    // use swr for this to enable caching and stuff you know!!

    const setComparePlayers = useSetAtom(comparePlayersAtom);
    const setComparePlayersStats = useSetAtom(comparePlayersStatsAtom);
    
    const fetchKey = 'multiple-players-stats-for/' + 
        comparePlayers.map(p => p.tracking_id).join("-");

    const {data: playersStats, isLoading: loadingPlayerStats, error} = useSWR(fetchKey, () => playerStatsFetcher(comparePlayers));
    const isLoading = loadingPlayerStats;

    useEffect(() => {

        if (comparePlayers) setComparePlayers(comparePlayers);
        if (playersStats) setComparePlayersStats(playersStats);

    }, [comparePlayers, playersStats]);

    if (isLoading) {
        return <LoadingState />
    }

    return (
        <>{children}</>
    )
}

async function playerStatsFetcher(comparePlayers: RugbyPlayer[], competitionId?: string) {
    const playerStatsRecord: Record<string, SportAction[]> = {};

    competitionId = competitionId || URC_COMPETIION_ID;

    const promises = comparePlayers.map(async (p) => {

        try {

            const stats = await athleteService.getAthleteStatsRaw(competitionId);
            const playerId = p.tracking_id

            if (playerId) {
                playerStatsRecord[playerId] = stats;
            }

        } catch (error) {
            logger.error('Error fetching stats for athlete ', p.tracking_id);
        }
    });

    await Promise.all(promises);
}

