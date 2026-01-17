import { useCallback, useMemo, useState } from "react";
import { logger } from "../../../services/logger";
import { scoutingService } from "../../../services/fantasy/scoutingService";
import useSWR from "swr";
import { ScoutingListPlayer } from "../../../types/fantasy/scouting";
import { useFantasySeasons } from "../../dashboard/useFantasySeasons";

/** API for getting a users scouting list and manipulating it */
export function useScoutingList() {

    const {selectedSeason} = useFantasySeasons();

    const seasonId = selectedSeason?.id;

    const key = seasonId ? `/fantasy/scouting/my-list/seasons/${seasonId}` : null;
    const {data, isLoading: loadingList, mutate: mutateList} = useSWR(key, () => scoutingService.getUserList(seasonId));

    const [isAdding, setIsAdding] = useState(false);
    const [isRemoving, setIsRemoving] = useState(false);

    const [error, setError] = useState<string>();
    const [message, setMessage] = useState<string>();

    const list = useMemo(() => {
        return (data ?? []).sort((a, b) => {
            const aDate = new Date(a.created_at);
            const bDate = new Date(b.created_at);

            return bDate.valueOf() - aDate.valueOf();
        });
    }, [data]);

    const addPlayer = useCallback(async (athleteId: string, callback?: (player: ScoutingListPlayer) => Promise<void>) => {

        setIsAdding(true);
        setMessage(undefined);
        setError(undefined);

        if (list.length >= 5) {
            setIsAdding(false);
            setError("Whoops, limit reached! You can only scout up to 5 players at a time");
            return;
        } 

        try {
            const res = await scoutingService.addPlayer(athleteId, seasonId);

            if (res) {
                setMessage("Player Added to Scouting List");
                if (callback) await callback(res);
                mutateList()
            }

        } catch (err) {
            logger.error("Error adding player ", err);
            setError("Something wen't wrong");
        } finally {
            setIsAdding(false);
        }

    }, [list.length, mutateList, seasonId]);

    const removePlayer = useCallback(async (athleteId: string, callback?: () => void) => {

        setIsRemoving(true);
        setMessage(undefined);
        setError(undefined)

        try {
            await scoutingService.removePlayer(athleteId, seasonId);
            setMessage("Removed Player from scouting list");

            if (callback) callback();
            mutateList();
        } catch (err) {
            logger.error("Error adding player ", err);
            setError("Something wen't wrong");
        } finally {
            setIsRemoving(false);
        }

    }, [mutateList, seasonId]);

    const clearError = () => {
        setError(undefined);
    }

    const clearMessage = () => {
        setMessage(undefined);
    }

    const checkPlayerIsOnList = useCallback((athleteId?: string) => {
        const matches = list.filter((s) => {
            return s.athlete.tracking_id === athleteId;
        });

        return matches.length >= 1;
    }, [list])

    return {
        addPlayer,
        removePlayer,
        isAdding,
        isRemoving,
        error,
        message,
        clearError,
        clearMessage,
        list,loadingList, mutateList,
        checkPlayerIsOnList,
    }
}