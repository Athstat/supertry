import { ReactNode, useEffect } from "react"
import { ISbrFixture } from "../../../types/sbr";
import { useSetAtom } from "jotai";
import { sbrFixtureMotmCandidatesAtom, userSbrMotmVoteAtom } from "../../../state/sbrMotm.atoms";
import useSWR from "swr";
import { sbrMotmService } from "../../../services/sbrMotmService";
import { sbrService } from "../../../services/sbrService";
import { LoadingState } from "../../ui/LoadingState";
import { swrFetchKeys } from "../../../utils/swrKeys";
import { currentSbrFixtureAtom } from "../../../state/sbrFixtures.atoms";

type Props = {
    children?: ReactNode,
    fixture: ISbrFixture
}

/** Fetches voting data and makes it available through atoms */
export default function SbrMotmVotingDataProvider({ children, fixture }: Props) {

    // candidates
    // user vote

    const setUserVote = useSetAtom(userSbrMotmVoteAtom);
    const setVotingCandiates = useSetAtom(sbrFixtureMotmCandidatesAtom)
    const setFixture = useSetAtom(currentSbrFixtureAtom);

    const fixtureId = fixture.fixture_id;

    const rostersFetchKey = `sbr-fixture-rosters/${fixtureId}`;
    const { data: rosters, isLoading: loadingRosters } = useSWR(rostersFetchKey, () => sbrService.getFixtureRosters(fixtureId));

    const userVoteFetchKey = swrFetchKeys.getSbrUserMotmVoteKey(fixtureId);
    const { data: userVote, isLoading: loadingUserVote } = useSWR(userVoteFetchKey, () => sbrMotmService.getUserVote(fixtureId));

    const isLoading = loadingUserVote || loadingRosters;

    useEffect(() => {
        if (rosters !== undefined) setVotingCandiates(rosters);
        if (userVote) setUserVote(userVote);
        if (fixture) setFixture(fixture);
    }, [fixture, rosters, userVote]);

    if (isLoading) return <LoadingState />

    return (
        <>
            {children}
        </>
    )
}
