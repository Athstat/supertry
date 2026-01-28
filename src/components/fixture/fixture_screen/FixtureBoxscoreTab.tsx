import { useEffect, useMemo } from "react";
import { useBoxscoreFilter } from "../../../hooks/fixtures/useBoxscoreFilter";
import { fixtureAnalytics } from "../../../services/analytics/fixtureAnalytics";
import { GameSportAction } from "../../../types/boxScore";
import { IFixture } from "../../../types/fixtures";
import { fixtureSummary } from "../../../utils/fixtureUtils";
import BoxscoreTable2 from "../boxscore/BoxscoreTable2";
import FixtureTeamSelector from "../boxscore/FixtureTeamSelector";
import { useInView } from "react-intersection-observer";
import { allStatsBoxscoreList } from "../../../utils/boxScoreUtils";


type Props = {
    fixture: IFixture,
    sportActions: GameSportAction[]
}

export default function FixtureBoxscoreTab({ fixture, sportActions }: Props) {

    const { gameKickedOff } = fixtureSummary(fixture);
    // const [search, setSearch] = useState<string>("");

    const { selectedTeamId, selectedTeam, setSelectedTeamId } = useBoxscoreFilter(fixture);
    const { ref, inView } = useInView({ triggerOnce: true });

    useEffect(() => {

        if (inView) {
            fixtureAnalytics.trackViewedBoxscore(fixture);
        }

    }, [fixture, inView]);

    const allStatsList = useMemo(() => {
        return allStatsBoxscoreList(sportActions, selectedTeamId);
    }, [sportActions, selectedTeamId]);

    // const attackList = useMemo(() => {
    //     return attackBoxscoreList(sportActions, selectedTeamId);
    // }, [sportActions, selectedTeamId]);

    // const defenseList = useMemo(() => {
    //     return defenseBoxscoreList(sportActions, selectedTeamId);
    // }, [sportActions, selectedTeamId]);

    // const kickingList = useMemo(() => {
    //     return kickingBoxscoreList(sportActions, selectedTeamId);
    // }, [sportActions, selectedTeamId]);

    // const disciplineList = useMemo(() => {
    //     return disciplineBoxscoreList(sportActions, selectedTeamId);
    // }, [sportActions, selectedTeamId]);


    if (!gameKickedOff) return;

    return (

        <div ref={ref} className="flex flex-col w-full gap-4 px-2" >

            <div className="flex flex-col w-full items-center justify-center gap-4" >
                {/* <div className="flex flex-row items-center justify-start gap-2" >
                    <Table2 />
                    <h1 className="font-bold text-lg" >Boxscore</h1>
                </div> */}

                <FixtureTeamSelector
                    fixture={fixture}
                    value={selectedTeam}
                    onChange={(t) => setSelectedTeamId(t?.athstat_id)}
                    className="w-2/3"
                />
            </div>

            <BoxscoreTable2
                title={selectedTeam?.athstat_name}
                columns={[
                    { lable: "Player", title: "Player", tooltip: "Player Name" },
                    { lable: "Tries", title: "Tries", tooltip: "The total number of tries scored by the player." },
                    { lable: "Pts", title: "Points Scored", tooltip: "The total points scored by the player in the match" },
                    { lable: "Asst", title: "Assits", tooltip: "Total passes provided by the player leading to a try." },
                    { lable: "Carr", title: "Carries", tooltip: "Total number of carries made by a player" },
                    { lable: "Tckls", title: "Title", tooltip: "The total number of tackles made by the player" },
                    { lable: "Tckl%", title: "Tackle Success", tooltip: "Successful tackles made as a percentage of total tackles made" },
                    { lable: "PCM", title: "Post Contact Metres", tooltip: "Metres gained after making contact with an opponent"},
                    { lable: "Ruck Arr", title: "Ruck Arrivals", tooltip: "The number of times a player arrived at a ruck to contest for the ball." },
                    {lable: "D.Beaten", title: "Defenders Beaten", tooltip: "Total number of defenders successfully evaded by the player."}
                ]}
                records={allStatsList}
            />

            {/* <BoxscoreTable2
                title="Attacking"
                columns={[
                    { lable: "Player", title: "Player", tooltip: "Player Name" },
                    { lable: "Tries", title: "Tries", tooltip: "The total number of tries scored by the player." },
                    { lable: "Pts", title: "Points Scored", tooltip: "The total points scored by the player in the match" },
                    { lable: "Carr", title: "Carries", tooltip: "Total number of carries made by a player" },
                ]}
                records={attackList}
            />

            <BoxscoreTable2
                title="Defense"
                columns={[
                    { lable: "Player", title: "Player", tooltip: "Player Name" },
                    { lable: "Tckls", title: "Title", tooltip: "The total number of tackles made by the player" },
                    { lable: "Tckl%", title: "Tackle Success", tooltip: "Successful tackles made as a percentage of total tackles made" },
                    { lable: "DT", title: "Dominant Tackles", tooltip: "The number of tackles made that were deemed dominant by the referee." },
                    { lable: "T/0s Won", title: "Turnovers Won",tooltip: "The number of times the team wins possession from the opposition." }
                ]}
                records={defenseList}
            />

            <BoxscoreTable2
                title="Kicking"
                columns={[
                    { lable: "Player", title: "Player", tooltip: "Player Name" },
                    { lable: "Convs", title: "Conversions", tooltip: "The total number of successful conversion kicks after tries." },
                    { lable: "DG", title: "Drop Goals Scored", tooltip: "The number of drop goal attempts that were successfully converted." },
                    { lable: "PK", title: "Successful Penalty Kicks", tooltip: "The number of penalty kicks successfully converted by the player." }
                ]}
                records={kickingList}
            />

            <BoxscoreTable2
                title="Discipline"
                columns={[
                    { lable: "Player", title: "Player", tooltip: "Player Name" },
                    { lable: "Red", title: "Red Cards", tooltip: "The number of red cards received by the player or team." },
                    { lable: "Yellow", title: "Yellow Cards", tooltip: "The total number of yellow cards shown to the player." }
                ]}
                records={disciplineList}
                noContentMessage="Whoops, clean game detected"
            /> */}

        </div>
    )
}


