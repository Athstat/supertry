import { IFixture } from "../../types/games"
import TabView, { TabViewHeaderItem, TabViewPage } from "../shared/tabs/TabView"
import { LoadingState } from "../ui/LoadingState";
import { FixtureRosterList } from "./FixtureRosterList"
import { useEffect, useState } from "react";
import { IProAthlete } from "../../types/athletes";
import PlayerProfileModal from "../player/PlayerProfileModal";
import NoContentCard from "../shared/NoContentMessage";
import { fixtureSumary } from "../../utils/fixtureUtils";
import { useInView } from "react-intersection-observer";
import { fixtureAnalytics } from "../../services/analytics/fixtureAnalytics";
import { useGameRosters } from "../../hooks/fixtures/useGameRosters";

type Props = {
    fixture: IFixture,
}

export default function FixtureRosters({ fixture }: Props) {

    const {
        rosters, isLoading: loadingRosters,
        awayRoster, homeRoster 
    } = useGameRosters(fixture);

    const [selectedPlayer, setSelectedPlayer] = useState<IProAthlete>();
    const [showModal, setShowModal] = useState<boolean>(false);

    const {game_status} = fixtureSumary(fixture);
    const gameComplete = game_status === "completed";
    
    const {ref, inView} = useInView();

    useEffect(() => {

        if (inView) {
            fixtureAnalytics.trackViewedTeamLineups(fixture);
        }

    }, [fixture, inView]);

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
        <div ref={ref} className="flex flex-col" >
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

