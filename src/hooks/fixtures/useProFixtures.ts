import useSWR from "swr";
import { gamesService } from "../../services/gamesService";
import { useMemo } from "react";

/** Hook that fetches pro fixtures */
export function useProFixtures() {
    const key = 'pro-fixtures';
    const { data, isLoading, error, mutate } = useSWR(key, () => gamesService.getAllSupportedGames());

    const fixtures = useMemo(() => {
        return data || [];
    }, [data]);

    return {
        fixtures,
        isLoading,
        error,
        mutate
    }

}