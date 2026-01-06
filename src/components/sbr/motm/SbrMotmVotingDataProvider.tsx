import { ReactNode, useEffect } from "react"
import { ISbrFixture } from "../../../types/sbr";
import { useSetAtom } from "jotai";
import { sbrFixtureMotmCandidatesAtom, sbrFixtureMotmVotesAtom } from "../../../state/sbrMotm.atoms";
import useSWR from "swr";
import { sbrMotmService } from "../../../services/sbrMotmService";
import { sbrService } from "../../../services/sbr/sbrService";
import { LoadingIndicator } from "../../ui/LoadingIndicator";
import { swrFetchKeys } from "../../../utils/swrKeys";
import { currentSbrFixtureAtom } from "../../../state/sbrFixtures.atoms";

type Props = {
    children?: ReactNode,
    fixture: ISbrFixture
}

/** Fetches voting data and makes it available through atoms */
export default function SbrMotmVotingDataProvider({ children, fixture }: Props) {

    const setVotingCandiates = useSetAtom(sbrFixtureMotmCandidatesAtom)
    const setFixture = useSetAtom(currentSbrFixtureAtom);
    const setAllMotmVotes = useSetAtom(sbrFixtureMotmVotesAtom);

    const fixtureId = fixture.fixture_id;

    const rostersFetchKey = `sbr-fixture-rosters/${fixtureId}`;
    const { data: rosters, isLoading: loadingRosters } = useSWR(rostersFetchKey, () => sbrService.getFixtureRosters(fixtureId));

    const allVotesKey = swrFetchKeys.getAllFixtureMotmVotesKey(fixtureId);
    const {data: allVotes, isLoading: loadingAllVotes} = useSWR(allVotesKey, () => sbrMotmService.getFixtureMotmVotes(fixtureId));

    const isLoading = loadingRosters || loadingAllVotes;

    useEffect(() => {
        if (rosters !== undefined) setVotingCandiates(rosters);
        if (allVotes) setAllMotmVotes(allVotes);
        if (fixture) setFixture(fixture);
    }, [fixture, rosters, allVotes, setVotingCandiates, setAllMotmVotes, setFixture]);

    if (isLoading) return <LoadingIndicator />

    return (
        <>
            {children}
        </>
    )
}
