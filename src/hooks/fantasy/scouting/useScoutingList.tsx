import { useCallback, useMemo, useState } from "react";
import { logger } from "../../../services/logger";
import { scoutingService } from "../../../services/fantasy/scoutingService";
import useSWR from "swr";
import { ScoutingListPlayer } from "../../../types/fantasy/scouting";

/** API for getting a users scouting list and manipulating it */
export function useScoutingList() {

    const key = `/fantasy/scouting/my-list`;
    const {data, isLoading: loadingList, mutate: mutateList} = useSWR(key, () => scoutingService.getUserList());

    const [isAdding, setIsAdding] = useState(false);
    const [isRemoving, setIsRemoving] = useState(false);

    const [error, setError] = useState<string>();
    const [message, setMessage] = useState<string>();

    const list = useMemo(() => {
        return data ?? [];
    }, [data]);

    const addPlayer = useCallback(async (athleteId: string, callback?: (player: ScoutingListPlayer) => Promise<void>) => {

        setIsAdding(true);
        setMessage(undefined);
        setError(undefined);

        try {
            const res = await scoutingService.addPlayer(athleteId);

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

    }, [mutateList]);

    const removePlayer = useCallback(async (athleteId: string, callback?: () => void) => {

        setIsRemoving(true);
        setMessage(undefined);
        setError(undefined)

        try {
            await scoutingService.removePlayer(athleteId);
            setMessage("Removed Player from scouting list");

            if (callback) callback();

            mutateList();
        } catch (err) {
            logger.error("Error adding player ", err);
            setError("Something wen't wrong");
        } finally {
            setIsAdding(false);
        }

    }, [mutateList]);

    const clearError = () => {
        setError(undefined);
    }

    const clearMessage = () => {
        setMessage(undefined);
    }

    return {
        addPlayer,
        removePlayer,
        isAdding,
        isRemoving,
        error,
        message,
        clearError,
        clearMessage,
        list,loadingList, mutateList
    }
}