import { IFixture, IRosterItem } from "../../types/games"
import { formatPosition } from "../../utils/athleteUtils"
import PlayerMugshot from "../shared/PlayerMugshot"
import TabView, { TabViewHeaderItem, TabViewPage } from "../shared/tabs/TabView"
import { FixtureRosterList } from "./FixtureRosterList"

type Props = {
    fixture: IFixture,
    rosters: IRosterItem[]
}

export default function FixtureRosters({ rosters, fixture }: Props) {

    const tabs: TabViewHeaderItem[] = [
        {
            label: fixture.team_name,
            tabKey: "home-team",
            className: "flex-1 w-1/2"
        },

        {
            label: fixture.opposition_team_name,
            tabKey: "away-team",
            className: "flex-1 w-1/2"
        }
    ]

    const awayRoster = rosters.filter((r) => {
        return r.team_id === fixture.opposition_team_id;
    });


    const homeRoster = rosters.filter((r) => {
        return r.team_id === fixture.team_id;
    })

    return (
        <div className="flex flex-col p-4" >
            <TabView tabHeaderItems={tabs}>
                
                <TabViewPage className="" tabKey="home-team">
                    <FixtureRosterList roster={homeRoster} />
                </TabViewPage>

                <TabViewPage className="" tabKey="away-team">
                    <FixtureRosterList roster={awayRoster} />
                </TabViewPage>

            </TabView>
        </div>
    )
}

