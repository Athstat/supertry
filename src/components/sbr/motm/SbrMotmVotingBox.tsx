import useSWR from "swr"
import { ISbrFixture, ISbrFixtureRosterItem } from "../../../types/sbr"
import { sbrService } from "../../../services/sbrService";
import TabView, { TabViewHeaderItem, TabViewPage } from "../../shared/tabs/TabView";

type Props = {
    fixture: ISbrFixture
}

export default function SbrMotmVotingBox({ fixture }: Props) {

    // get team rosters
    // get votes
    const fixtureId = fixture.fixture_id;

    const fetchKey = `sbr-fixture-rosters/${fixtureId}`;
    const { data: rosters, isLoading: loadingRosters } = useSWR(fetchKey, () => sbrService.getFixtureRosters(fixtureId));

    const tabItems: TabViewHeaderItem[] = [
        {
            label: `${fixture.home_team}`,
            tabKey: 'home_team',
            className: "flex-1"
        },

        {
            label: `${fixture.away_team}`,
            tabKey: 'away_team',
            className: "flex-1"
        }
    ]

    if (!rosters || rosters.length === 0) return (
        <>
            {!loadingRosters && <div className="text-slate-700 dark:text-slate-400 text-center items-center justify-center flex flex-col p-3 text-sm md:text-sm" >
                <p>Rosters are not yet available for this match</p>
            </div>}
        </>
    )

    const homeRoster = rosters.filter((r) => {
        return r.team_id === fixture.home_team_id
    });

    const awayRoster = rosters.filter((r) => {
        return r.team_id === fixture.away_team_id
    });

    return (
        <div>
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

type VotingCandidateListProps = {
    roster: ISbrFixtureRosterItem[]
}

function SbrMotmVotingCandidateList({ roster }: VotingCandidateListProps) {
    return (
        <div>
            {roster.map((r) => {
                return <SbrMotmVotingCandidateListItem
                    candidate={r}
                    key={r.athlete_id}
                />
            })}
        </div>
    )
}

type VotingCandidateListItemProps = {
    candidate: ISbrFixtureRosterItem
}

function SbrMotmVotingCandidateListItem({ candidate }: VotingCandidateListItemProps) {
    return (
        <div>
            <p>{candidate.athlete_first_name}</p>
        </div>
    )
}