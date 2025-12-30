import useSWR from "swr";
import { sbrService } from "../../services/sbr/sbrService";
import { useMemo } from "react";

/** Hook that fetches SBR Fixtures */
export function useSbrFixtures() {
    const key = '/sbr/fixtures';
    const { data, isLoading, mutate, error } = useSWR(key, () => sbrService.getAllFixtures());

    const fixtures = useMemo(() => {
        return data || [];
    }, [data]);

    return {
        fixtures,
        isLoading,
        mutate,
        error
    }
}