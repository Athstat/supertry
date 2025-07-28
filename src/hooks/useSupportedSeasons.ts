import useSWR from "swr";
import { swrFetchKeys } from "../utils/swrKeys";
import { seasonService } from "../services/seasonsService";
import { useEffect, useState } from "react";
import { IProSeason } from "../types/season";

/** Provides reusable logic for fetching
 * supported seasons aswell as a season
 * picking funcitonality that can be used
 * for filtering
 */

type Options = {
    wantedSeasonsId?: string[];
};

export function useSupportedSeasons({ wantedSeasonsId = [] }: Options = {}) {
    const key = swrFetchKeys.getAllSuppportedSeasons(wantedSeasonsId);

    const { data, isLoading } = useSWR(key, () => (
        wantedSeasonsId.length > 0 ? wantedSeasonsFetcher(wantedSeasonsId) : seasonService.getAllSupportedSeasons()
    ));

    const seasons = (data ?? []).sort((a, b) => {
        return b.name.localeCompare(a.name);
    });

    const [currSeason, setCurrSeason] = useState<IProSeason>();

    useEffect(() => {
        if (seasons.length > 0) {
            setCurrSeason(seasons[0]);
        }
    }, [seasons]);

    return {
        isLoading,
        seasons,
        currSeason,
        setCurrSeason,
    };
}


async function wantedSeasonsFetcher(wantedSeasons: string[]) {
    const seasons: IProSeason[] = [];

    const promises = wantedSeasons.map(async (id) => {
        const s = await seasonService.getSeasonsById(id);
        if (s) {
            seasons.push(s);
        }
    });

    await Promise.all(promises);

    return seasons;
}