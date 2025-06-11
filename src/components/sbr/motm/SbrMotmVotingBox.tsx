import useSWR from "swr"
import { ISbrFixture } from "../../../types/sbr"
import { sbrService } from "../../../services/sbrService";
import TabView, { TabViewHeaderItem, TabViewPage } from "../../shared/tabs/TabView";
import SecondaryText from "../../shared/SecondaryText";
import { sbrMotmService } from "../../../services/sbrMotmService";
import { SbrMotmVotingCandidateList } from "./SbrMotmVotingCandidateList";

type Props = {
    fixture: ISbrFixture
}

export default function SbrMotmVotingBox({ fixture }: Props) {

    // get team rosters
    // get votes
    const fixtureId = fixture.fixture_id;

    const rostersFetchKey = `sbr-fixture-rosters/${fixtureId}`;
    const { data: rosters, isLoading: loadingRosters } = useSWR(rostersFetchKey, () => sbrService.getFixtureRosters(fixtureId));
    
    const userVoteFetchKey = `user-sbr-fixture-motm-vote/${fixtureId}`;
    const {data: userVote, isLoading: loadingUserVote} = useSWR(userVoteFetchKey, () => sbrMotmService.getUserVote(fixtureId));
    

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
    
    if (!rosters || rosters.length === 0) return (
        <>
            {!loadingRosters && <div className="text-slate-700 dark:text-slate-400 text-center items-center justify-center flex flex-col p-3 text-sm md:text-sm" >
                <p>Rosters are not yet available for this match</p>
            </div>}
        </>
    )
    
    const hasUserVoted = userVote !== undefined;

    const homeRoster = rosters.filter((r) => {
        return r.team_id === fixture.home_team_id
    });

    const awayRoster = rosters.filter((r) => {
        return r.team_id === fixture.away_team_id
    });

    return (
        <div className="flex flex-col gap gap-1" >
            <div className="flex flex-row items-center gap-1" >
                <h2 className="text-md font-semibold" >Top Dawg Of The Match</h2>
            </div>

            <SecondaryText className="mb-2" >Vote for the player who was your Top Dawg of the Match 😤</SecondaryText>
            
            <TabView tabHeaderItems={tabItems} >
                <TabViewPage tabKey="home_team" >

                    <SbrMotmVotingCandidateList
                        roster={homeRoster}
                    />
                </TabViewPage>

                <TabViewPage tabKey="away_team" >
                    <SbrMotmVotingCandidateList
                        roster={awayRoster}
                    />
                </TabViewPage>

            </TabView>
        </div>
    )
}