/* eslint-disable react-refresh/only-export-components */
import { createContext, ReactNode, useMemo, useState } from "react"
import { IProAthlete } from "../types/athletes"
import { IProSeason } from "../types/season"
import useSWR from "swr"
import { djangoAthleteService } from "../services/athletes/djangoAthletesService"
import { swrFetchKeys } from "../utils/swrKeys"

type ContextProps = {
    player: IProAthlete,
    seasons: IProSeason[],
    selectedSeason?: IProSeason,
    switchSeason: (newSeason: IProSeason) => void,
    isLoading?: boolean
}

export const PlayerCompareItemContext = createContext<ContextProps | null>(null);

type Props = {
    player: IProAthlete,
    children?: ReactNode
}

/** Renders a player compare item provider */
export default function PlayerCompareItemProvider({ player, children }: Props) {

    const shouldFetchSeason = Boolean(player);

    const seasonFetchKey = shouldFetchSeason ? swrFetchKeys.getAthleteSeasons(player.tracking_id) : null;
    const { data, isLoading } = useSWR(seasonFetchKey, () =>
        djangoAthleteService.getAthleteSeasons(player.tracking_id)
    );

    const seasons = useMemo(() => {
        return [...(data || []) ].sort((a, b) => {
            const aEnd = new Date(a.end_date);
            const bEnd = new Date(b.end_date);

            return bEnd.valueOf() - aEnd.valueOf();
        });
    }, [data]);

    const firstSeason = useMemo(() => {
        if (seasons.length > 0) {
            return seasons[0];
        }
    }, [seasons]);

    const [selectedSeason, setSeason] = useState(firstSeason);
    const displaySeason = selectedSeason || firstSeason;

    const handleSwitchSeason = (szn: IProSeason) => {
        setSeason(szn);
    }

    return (
        <PlayerCompareItemContext.Provider
            value={{
                selectedSeason: displaySeason,
                isLoading,
                seasons,
                switchSeason: handleSwitchSeason,
                player
            }}
        >
            {children}
        </PlayerCompareItemContext.Provider>
    )
}
