import useSWR from "swr"
import { ISbrFixture, ISbrFixtureRosterItem } from "../../../types/sbr"
import { sbrService } from "../../../services/sbrService";
import TabView, { TabViewHeaderItem, TabViewPage } from "../../shared/tabs/TabView";
import SecondaryText from "../../shared/SecondaryText";
import PrimaryButton from "../../shared/buttons/PrimaryButton";

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

        <div className="flex gap-3 p-2 flex-row items-center" >

            <div className="w-[10%]" >
                <p>{candidate.jersey_number || "-"}</p>
            </div>

            <div className="flex  w-[50%] flex-col items-start" >
                <p>{candidate.athlete_first_name}</p>
                <SecondaryText className="text-xs md:text-sm" >{candidate.position ?? ""}</SecondaryText>
            </div>

            <div className="w-[40%] flex flex-row items-center justify-end" >
                <PrimaryButton className="text-xs w-fit py-1 px-2.5" >
                    Vote
                </PrimaryButton>
            </div>
        </div>

    )
}