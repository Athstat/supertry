import useSWR from "swr";
import { IFixture } from "../../types/games"
import TabView, { TabViewHeaderItem, TabViewPage } from "../shared/tabs/TabView"
import { LoadingState } from "../ui/LoadingState";
import { FixtureRosterList } from "./FixtureRosterList"
import { gamesService } from "../../services/gamesService";
import { useState } from "react";
import { IProAthlete } from "../../types/athletes";
import PlayerProfileModal from "../player/PlayerProfileModal";
import NoContentCard from "../shared/NoContentMessage";
import { fixtureSumary } from "../../utils/fixtureUtils";

type Props = {
    fixture: IFixture,
}

export default function FixtureRosters({ fixture }: Props) {

    const fixtureId = fixture.game_id;
    const rostersKey = fixtureId ? `fixtures/${fixtureId}/rosters` : null;
    const { data: fetchedRosters, isLoading: loadingRosters } = useSWR(rostersKey, () => gamesService.getGameRostersById(fixtureId ?? ""));

    const [selectedPlayer, setSelectedPlayer] = useState<IProAthlete>();
    const [showModal, setShowModal] = useState<boolean>(false);

    const {game_status} = fixtureSumary(fixture);
    const gameComplete = game_status === "completed";

    const toggleModal = () => {
        setShowModal(prev => !prev);
        setSelectedPlayer(undefined);
    };

    if (loadingRosters) {
        return <LoadingState />
    }

    const tabs: TabViewHeaderItem[] = [
        {
            label: fixture?.team?.athstat_name,
            tabKey: "home-team",
            className: "flex-1 w-1/2"
        },

        {
            label: fixture?.opposition_team?.athstat_name,
            tabKey: "away-team",
            className: "flex-1 w-1/2"
        }
    ]

    const rosters = fetchedRosters ?? [];

    const awayRoster = rosters.filter((r) => {
        return r.team_id === fixture?.opposition_team?.athstat_id;
    });


    const homeRoster = rosters.filter((r) => {
        return r.team_id === fixture?.team?.athstat_id;
    })

    const handleClickPlayer = (player: IProAthlete) => {
        setSelectedPlayer(player);
        setShowModal(true);
    }

    if (rosters.length === 0) {
        return <NoContentCard 
            message={gameComplete ? "Rosters were not available for this match" : "Rosters are not yet available for this match"}
        />
    }

    return (
        <div className="flex flex-col" >
            <TabView tabHeaderItems={tabs}>

                <TabViewPage className="p-4" tabKey="home-team">
                    <FixtureRosterList roster={homeRoster} 
                        onClickPlayer={handleClickPlayer}
                    />
                </TabViewPage>

                <TabViewPage className="p-4" tabKey="away-team">
                    <FixtureRosterList roster={awayRoster} 
                        onClickPlayer={handleClickPlayer}
                    />
                </TabViewPage>

                {selectedPlayer && <PlayerProfileModal 
                    player={selectedPlayer}
                    isOpen={showModal}
                    onClose={toggleModal}
                />}
            </TabView>
        </div>
    )
}

