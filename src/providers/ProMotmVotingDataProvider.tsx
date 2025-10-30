import { ReactNode, useEffect } from "react";
import { useSetAtom } from "jotai";
import useSWR from "swr";
import { LoadingState } from "../components/ui/LoadingState";
import { gamesService } from "../services/gamesService";
import { proMotmService } from "../services/proMotmService";
import { proGameMotmCandidatesAtom, currentProGameAtom, proGameMotmVotesAtom } from "../state/proMotm.atoms";
import { IFixture } from "../types/games";

type Props = {
    children?: ReactNode;
    fixture: IFixture;
}

/** Fetches PRO MOTM voting data and makes it available through atoms */
export default function ProMotmVotingDataProvider({ children, fixture }: Props) {
    const setVotingCandidates = useSetAtom(proGameMotmCandidatesAtom);
    const setCurrentGame = useSetAtom(currentProGameAtom);
    const setAllMotmVotes = useSetAtom(proGameMotmVotesAtom);

    const gameId = fixture.game_id;

    const rostersFetchKey = `pro-game-rosters/${gameId}`;
    const { data: rosters, isLoading: loadingRosters } = useSWR(
        rostersFetchKey, 
        () => gamesService.getGameRostersById(gameId)
    );

    const allVotesKey = `pro-game-motm-votes/${gameId}`;
    const { data: allVotes, isLoading: loadingAllVotes } = useSWR(
        allVotesKey, 
        () => proMotmService.getGameVote(gameId)
    );

    const isLoading = loadingRosters || loadingAllVotes;

    useEffect(() => {
        if (rosters !== undefined) setVotingCandidates(rosters);
        if (allVotes) setAllMotmVotes(allVotes);
        if (gameId) setCurrentGame(gameId);
    }, [gameId, rosters, allVotes, setVotingCandidates, setAllMotmVotes, setCurrentGame]);

    if (isLoading) return <LoadingState message="Loading MOTM data..." />;

    return (
        <>
            {children}
        </>
    );
}
