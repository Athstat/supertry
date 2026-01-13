/* eslint-disable @typescript-eslint/no-explicit-any */
import { createContext, ReactNode, useCallback, useMemo } from "react"
import { IProTeam } from "../types/team"
import useSWR from "swr";
import { seasonService } from "../services/seasonsService";
import { useFantasySeasons } from "../hooks/dashboard/useFantasySeasons";
import ScrummyLoadingState from "../components/ui/ScrummyLoadingState";
import { CACHING_CONFIG } from "../types/constants";
import { IProSeason } from "../types/season";

type ContextProps = {
    teams: IProTeam[],
    refresh: () => void,
    error?: any,
    isLoading?: boolean,
    season?: IProSeason
}

export const SeasonTeamsContext = createContext<ContextProps | null>(null);

type ProviderProps = {
    children?: ReactNode
}

export default function SeasonTeamsProvider({children} : ProviderProps) {

    const { selectedSeason } = useFantasySeasons();
    const seasonId = selectedSeason?.id;

    const seasonTeamsKey = seasonId ? `seasons-teams/${seasonId}` : null;
    const { data, isLoading, mutate, error } = useSWR(seasonTeamsKey, () => seasonService.getSeasonTeams(seasonId ?? ""), {
        revalidateOnFocus: false,
        revalidateIfStale: true,
        dedupingInterval: CACHING_CONFIG.seasonTeamsCachePeriod
    });

    const teams = useMemo(() => {
        return [...(data || [])].sort((a, b) => {
            return a.athstat_name.localeCompare(b.athstat_name)
        })
    }, [data]);

    const refresh = useCallback(() => {
        mutate();
    }, [mutate])

    if (isLoading) {
        return (
            <ScrummyLoadingState />
        )
    }

    return (
        <SeasonTeamsContext.Provider
            value={{ teams, refresh, isLoading, error, season: selectedSeason }}
        >
            {children}
        </SeasonTeamsContext.Provider>
    )
}
