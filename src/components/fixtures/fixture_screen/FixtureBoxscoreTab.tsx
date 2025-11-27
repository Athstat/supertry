import { useEffect, useMemo } from "react";
import { useBoxscoreFilter } from "../../../hooks/fixtures/useBoxscoreFilter";
import { fixtureAnalytics } from "../../../services/analytics/fixtureAnalytics";
import { BoxscoreListRecordItem, GameSportAction } from "../../../types/boxScore";
import { IFixture } from "../../../types/games";
import { fixtureSummary } from "../../../utils/fixtureUtils";
import BoxscoreTable2 from "../boxscore/BoxscoreTable2";
import FixtureTeamSelector from "../boxscore/FixtureTeamSelector";
import { useInView } from "react-intersection-observer";


type Props = {
    fixture: IFixture,
    sportActions: GameSportAction[]
}

export default function FixtureBoxscoreTab({ fixture, sportActions }: Props) {

    const { gameKickedOff } = fixtureSummary(fixture);
    // const [search, setSearch] = useState<string>("");

    const { selectedTeamId, selectedTeam } = useBoxscoreFilter(fixture);
    const { ref, inView } = useInView({ triggerOnce: true });

    useEffect(() => {

        if (inView) {
            fixtureAnalytics.trackViewedBoxscore(fixture);
        }

    }, [fixture, inView]);

    const allStatsList = useMemo(() => {
        return allStatsBoxscoreList(sportActions, selectedTeamId);
    }, [sportActions, selectedTeamId]);

    const attackList = useMemo(() => {
        return attackBoxscoreList(sportActions, selectedTeamId);
    }, [sportActions, selectedTeamId]);

    const defenseList = useMemo(() => {
        return defenseBoxscoreList(sportActions, selectedTeamId);
    }, [sportActions, selectedTeamId]);

    const kickingList = useMemo(() => {
        return kickingBoxscoreList(sportActions, selectedTeamId);
    }, [sportActions, selectedTeamId]);

    const disciplineList = useMemo(() => {
        return disciplineBoxscoreList(sportActions, selectedTeamId);
    }, [sportActions, selectedTeamId]);


    if (!gameKickedOff) return;

    return (

        <div ref={ref} className="flex flex-col w-full gap-4" >

            <div className="flex flex-col w-full gap-4" >
                {/* <div className="flex flex-row items-center justify-start gap-2" >
                    <Table2 />
                    <h1 className="font-bold text-lg" >Boxscore</h1>
                </div> */}

                <FixtureTeamSelector
                    fixture={fixture}
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

            <BoxscoreTable2
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
            />

        </div>
    )
}


function allStatsBoxscoreList(bs: GameSportAction[], teamId: string): BoxscoreListRecordItem[] {
    const athleteIds: string[] = [];

    bs.forEach((b) => {
        if (!athleteIds.includes(b.athlete_id) && b.team_id === teamId) {
            athleteIds.push(b.athlete_id);
        }
    });

    const athleteStats: BoxscoreListRecordItem[] = athleteIds.map((a) => {
        const stats = bs.filter((b) => b.athlete_id === a);

        const tries = stats.find((b) => b.action === "tries")?.action_count;
        const points = stats.find((b) => b.action === "points")?.action_count;
        const tryAssits = stats.find((b) => b.action === "try_assits")?.action_count;
        const carries = stats.find((b) => b.action === "carry_dominant")?.action_count;
        const tackles = stats.find((b) => b.action === "tackles")?.action_count;
        const tackleSuccess = stats.find((b) => b.action === "tackle_success")?.action_count;
        const postContactMetres = stats.find((b) => b.action === "post_contact_metres")?.action_count;
        const ruckArrivals = stats.find((b) => b.action === "ruck_arrival")?.action_count;
        const defendersBeaten = stats.find((b) => b.action === "defenders_beaten")?.action_count;

        const tacklingPerc = Math.floor((tackleSuccess ?? 0) * 100)

        return {
            stats: [
                Math.floor(tries ?? 0),
                Math.floor(points ?? 0),
                Math.floor(tryAssits ?? 0),
                Math.floor(carries ?? 0),
                `${Math.floor(tackles ?? 0)}`,
                tacklingPerc + "%",
                Math.floor(postContactMetres ?? 0),
                Math.floor(ruckArrivals ?? 0),
                Math.floor(defendersBeaten ?? 0)
            ],
            athleteId: a
        }
    }).sort((a, b) => {
        const [, points] = a.stats;
        const [, bPoints] = b.stats;

        return ((bPoints as number) ?? 0) - ((points as number) ?? 0)
    });


    return athleteStats;

}

function attackBoxscoreList(bs: GameSportAction[], teamId: string): BoxscoreListRecordItem[] {
    const athleteIds: string[] = [];

    bs.forEach((b) => {
        if (!athleteIds.includes(b.athlete_id) && b.team_id === teamId) {
            athleteIds.push(b.athlete_id);
        }
    });

    const athleteStats: BoxscoreListRecordItem[] = athleteIds.map((a) => {
        const stats = bs.filter((b) => b.athlete_id === a);

        const tries = stats.find((b) => b.action === "tries")?.action_count;
        const points = stats.find((b) => b.action === "points")?.action_count;
        const passes = stats.find((b) => b.action === "carry_dominant")?.action_count;

        return {
            stats: [Math.floor(tries ?? 0), Math.floor(points ?? 0), Math.floor(passes ?? 0)],
            athleteId: a
        }
    }).sort((a, b) => {
        const [, points] = a.stats;
        const [, bPoints] = b.stats;

        return (bPoints ?? 0) - (points ?? 0)
    });


    return athleteStats;

}


function defenseBoxscoreList(bs: GameSportAction[], teamId: string): BoxscoreListRecordItem[] {
    const athleteIds: string[] = [];

    bs.forEach((b) => {
        if (!athleteIds.includes(b.athlete_id) && b.team_id === teamId) {
            athleteIds.push(b.athlete_id);
        }
    });

    const athleteStats: BoxscoreListRecordItem[] = athleteIds.map((a) => {
        const stats = bs.filter((b) => b.athlete_id === a);

        const tackles = stats.find((b) => b.action === "tackles")?.action_count;
        const tackleSuccess = stats.find((b) => b.action === "tackle_success")?.action_count;
        const dominantTackles = stats.find((b) => b.action === "dominant_tackles")?.action_count;
        const turnoversWon = stats.find((b) => b.action === "turnover_won")?.action_count;

        const tacklingPerc = Math.floor((tackleSuccess ?? 0) * 100)

        return {
            stats: [
                Math.floor(tackles ?? 0),
                `${tacklingPerc}%`,
                Math.floor(dominantTackles ?? 0),
                Math.floor(turnoversWon ?? 0)
            ],
            athleteId: a
        }
    }).sort((a, b) => {
        const [tackles] = a.stats;
        const [bTackles] = b.stats;

        return ((bTackles as number) ?? 0) - ((tackles as number) ?? 0)
    }).filter((a) => {
        const [x] = a.stats;

        return (x as number) > 0;
    });


    return athleteStats;

}


function kickingBoxscoreList(bs: GameSportAction[], teamId: string): BoxscoreListRecordItem[] {
    const athleteIds: string[] = [];

    bs.forEach((b) => {
        if (!athleteIds.includes(b.athlete_id) && teamId === b.team_id) {
            athleteIds.push(b.athlete_id);
        }
    });

    const athleteStats: BoxscoreListRecordItem[] = athleteIds.map((a) => {
        const stats = bs.filter((b) => b.athlete_id === a);

        const conversion_goals = stats.find((b) => b.action === "conversion_goals")?.action_count;
        const drop_goals_scored = stats.find((b) => b.action === "drop_goals_converted")?.action_count;
        const penalty_goals = stats.find((b) => b.action === "kick_penalty_good")?.action_count;

        return {
            stats: [Math.floor(conversion_goals ?? 0), Math.floor(drop_goals_scored ?? 0), Math.floor(penalty_goals ?? 0)],
            athleteId: a
        }
    }).sort((a, b) => {
        const [conversion_goals] = a.stats;
        const [bConversion_goals] = b.stats;

        return (bConversion_goals ?? 0) - (conversion_goals ?? 0)
    }).filter((a) => {
        const [x, b, c] = a.stats;

        return (x > 0) || (b > 0) || (c > 0)
    });


    return athleteStats;

}

function disciplineBoxscoreList(bs: GameSportAction[], teamId: string): BoxscoreListRecordItem[] {
    const athleteIds: string[] = [];

    bs.forEach((b) => {
        if (!athleteIds.includes(b.athlete_id) && teamId === b.team_id) {
            athleteIds.push(b.athlete_id);
        }
    });

    const athleteStats: BoxscoreListRecordItem[] = athleteIds.map((a) => {
        const stats = bs.filter((b) => b.athlete_id === a);

        const red_cards = stats.find((b) => b.action === "red_cards")?.action_count;
        const yellow_cards = stats.find((b) => b.action === "yellow_cards")?.action_count;

        return {
            stats: [Math.floor(red_cards ?? 0), Math.floor(yellow_cards ?? 0)],
            athleteId: a
        }
    }).sort((a, b) => {
        const [redCards] = a.stats;
        const [bRedCards] = b.stats;

        return (bRedCards ?? 0) - (redCards ?? 0)

    }).filter((a) => {
        const [x, b] = a.stats;

        return (x > 0) || (b > 0);
    });


    return athleteStats;

}
