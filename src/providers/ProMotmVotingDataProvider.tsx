import { ReactNode, useEffect } from "react";
import { useSetAtom } from "jotai";
import useSWR from "swr";
import { LoadingIndicator } from "../components/ui/LoadingIndicator";
import { proMotmService } from "../services/proMotmService";
import { proGameMotmCandidatesAtom, currentProGameAtom, proGameMotmVotesAtom } from "../state/proMotm.atoms";
import { IFixture } from "../types/games";
import { useGameRosters } from "../hooks/fixtures/useGameRosters";

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
    const {rosters, isLoading: loadingRosters} = useGameRosters(fixture);

    const allVotesKey = `/fixtures/${fixture.game_id}/pro-game-motm-votes`;

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

    if (isLoading) return <LoadingIndicator message="Loading MOTM data..." />;

    return (
        <>
            {children}
        </>
    );
}
