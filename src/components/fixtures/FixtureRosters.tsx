import useSWR from "swr";
import { IFixture } from "../../types/games"
import TabView, { TabViewHeaderItem, TabViewPage } from "../shared/tabs/TabView"
import { LoadingState } from "../ui/LoadingState";
import { FixtureRosterList } from "./FixtureRosterList"
import { gamesService } from "../../services/gamesService";

type Props = {
    fixture: IFixture,
}

export default function FixtureRosters({ fixture }: Props) {

    const fixtureId = fixture.game_id;
    const rostersKey = fixtureId ? `fixtures/${fixtureId}/rosters` : null;
    const { data: fetchedRosters, isLoading: loadingRosters } = useSWR(rostersKey, () => gamesService.getGameRostersById(fixtureId ?? ""));


    if (loadingRosters) {
        return <LoadingState />
    }

    const tabs: TabViewHeaderItem[] = [
        {
            label: fixture.team.athstat_name,
            tabKey: "home-team",
            className: "flex-1 w-1/2"
        },

        {
            label: fixture.opposition_team.athstat_name,
            tabKey: "away-team",
            className: "flex-1 w-1/2"
        }
    ]

    const rosters = fetchedRosters ?? [];

    const awayRoster = rosters.filter((r) => {
        return r.team_id === fixture.opposition_team.athstat_id;
    });


    const homeRoster = rosters.filter((r) => {
        return r.team_id === fixture.team.athstat_id;
    })

    return (
        <div className="flex flex-col" >
            <TabView tabHeaderItems={tabs}>

                <TabViewPage className="p-4" tabKey="home-team">
                    <FixtureRosterList roster={homeRoster} />
                </TabViewPage>

                <TabViewPage className="p-4" tabKey="away-team">
                    <FixtureRosterList roster={awayRoster} />
                </TabViewPage>

            </TabView>
        </div>
    )
}

