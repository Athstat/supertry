import { ISbrFixture } from "../../../types/sbr"
import TabView, { TabViewHeaderItem, TabViewPage } from "../../shared/tabs/TabView";
import SecondaryText from "../../shared/SecondaryText";
import { SbrMotmVotingCandidateList } from "./SbrMotmVotingCandidateList";
import { useAtomValue } from "jotai";
import { hasUserSubmittedSbrMotmAtom, sbrFixtureMotmCandidatesAtom, sbrFixtureMotmVotesAtom, userSbrMotmVoteAtom } from "../../../state/sbrMotm.atoms";
import { ScopeProvider } from "jotai-scope";
import SbrMotmVotingDataProvider from "./SbrMotmVotingDataProvider";
import { currentSbrFixtureAtom } from "../../../state/sbrFixtures.atoms";
import NoContentCard from "../../shared/NoContentMessage";
import { hasMotmVotingEnded } from "../../../utils/sbrUtils";
import SbrTopDawgOfTheMatchCard from "./SbrMotmWinnerCard";

type Props = {
    fixture: ISbrFixture
}

export default function SbrMotmVotingBox({ fixture }: Props) {


    const atoms = [
        sbrFixtureMotmCandidatesAtom, hasUserSubmittedSbrMotmAtom, 
        userSbrMotmVoteAtom, sbrFixtureMotmVotesAtom, currentSbrFixtureAtom
    ]

    return (
        <ScopeProvider atoms={atoms} >
            <SbrMotmVotingDataProvider fixture={fixture} >
                <SbrMotmVotingBoxContent fixture={fixture} />
            </SbrMotmVotingDataProvider>
        </ScopeProvider>
    )
}

type ContentProps = {
    fixture: ISbrFixture
}

export function SbrMotmVotingBoxContent({fixture} : ContentProps) {
    // get team rosters
    // get votes


    const candidates = useAtomValue(sbrFixtureMotmCandidatesAtom);
    const hasVotingEnded = hasMotmVotingEnded(fixture.kickoff_time);

    const tabItems: TabViewHeaderItem[] = [
        {
            label: `${fixture.home_team}`,
            tabKey: 'home_team',
            className: "flex-1 text-xs md:text-sm"
        },

        {
            label: `${fixture.away_team}`,
            tabKey: 'away_team',
            className: "flex-1 text-xs md:text-sm"
        }
    ]

    const homeCandidates = candidates.filter((r) => {
        return r.team_id === fixture.home_team_id
    });

    const awayCandidates = candidates.filter((r) => {
        return r.team_id === fixture.away_team_id
    });


    if (candidates.length === 0) return (
        <>
            <NoContentCard message={
                `Top Dawg Of The Match voting ${hasVotingEnded ? "was" : "is"} not available for this game`
            } />
        </>
    )

    if (hasVotingEnded) {
        return (
            <SbrTopDawgOfTheMatchCard />
        )
    }


    return (
        <div className="flex flex-col gap gap-1" >
            <div className="flex flex-row items-center gap-1" >
                <h2 className="text-md font-semibold" >Top Dawg Of The Match</h2>
            </div>

            <SecondaryText className="mb-2" >Vote for the player who was your Top Dawg of the Match 😤</SecondaryText>

            <TabView tabHeaderItems={tabItems} >
                <TabViewPage tabKey="home_team" >

                    <SbrMotmVotingCandidateList
                        roster={homeCandidates}
                    />
                </TabViewPage>

                <TabViewPage tabKey="away_team" >
                    <SbrMotmVotingCandidateList
                        roster={awayCandidates}
                    />
                </TabViewPage>

            </TabView>
        </div>
    )
}