 
import { createContext, ReactNode, useMemo, useState } from "react"
import { IProAthlete } from "../types/athletes"
import { IProSeason } from "../types/season"
import useSWR from "swr"
import { athleteService } from "../services/athletes/athletesService"
import { swrFetchKeys } from "../utils/swrKeys"
import { IFixture } from "../types/games"

type ContextProps = {
    player: IProAthlete,
    seasons: IProSeason[],
    selectedSeason?: IProSeason,
    switchSeason: (newSeason: IProSeason) => void,
    isLoading?: boolean,
    selectedFixture?: IFixture,
    setFixture: (fixture?: IFixture) => void
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
        athleteService.getAthleteSeasons(player.tracking_id)
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
    const [selectedFixture, setFixture] = useState<IFixture>();
    const displaySeason = selectedSeason || firstSeason;

    const handleSwitchSeason = (szn: IProSeason) => {
        setSeason(szn);
    }

    const handleChangeFixture = (fixture?: IFixture) => {
        setFixture(fixture);
    }

    return (
        <PlayerCompareItemContext.Provider
            value={{
                selectedSeason: displaySeason,
                isLoading,
                seasons,
                switchSeason: handleSwitchSeason,
                player,
                setFixture: handleChangeFixture,
                selectedFixture: selectedFixture
            }}
        >
            {children}
        </PlayerCompareItemContext.Provider>
    )
}
