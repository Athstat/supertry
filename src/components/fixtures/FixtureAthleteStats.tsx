import { djangoAthleteService } from "../../services/athletes/djangoAthletesService"
import { IFixture } from "../../types/games"
import { fixtureSumary } from "../../utils/fixtureUtils"
import { GameSportAction } from "../../types/boxScore"
import { useMemo, useState } from "react"
import { Table2 } from "lucide-react"
import useSWR from "swr"
import RoundedCard from "../shared/RoundedCard"
import PlayerMugshot from "../shared/PlayerMugshot"
import SecondaryText from "../shared/SecondaryText"
import { BoxscoreListRecordItem, BoxscoreTable } from "./boxscore/BoxscoreCategoryList"

type Props = {
    fixture: IFixture,
    sportActions: GameSportAction[]
}

export default function FixtureAthleteStats({ fixture, sportActions }: Props) {

    const { gameKickedOff } = fixtureSumary(fixture);
    const [search, setSearch] = useState<string>("");

    const attackList = useMemo(() => {
        return attackBoxscoreList(sportActions);
    }, [sportActions]);

    const defenseList = useMemo(() => {
        return defenseBoxscoreList(sportActions);
    }, [sportActions]);

    const kickingList = useMemo(() => {
        return kickingBoxscoreList(sportActions);
    }, [sportActions]);


    if (!gameKickedOff) return;

    return (

        <div className="flex flex-col gap-3 w-full" >
            <div className="flex flex-row items-center justify-start gap-2" >
                <Table2 />
                <h1 className="font-bold text-lg" >Boxscore</h1>
            </div>

            <BoxscoreTable
                title="Attacking"
                columnHeaders={[{ lable: "Tries" }, { lable: "Pts" }, { lable: "Carr" }]}
                list={attackList}
            />

            <BoxscoreTable
                title="Defense"
                columnHeaders={[{ lable: "Tkls" }, { lable: "Dom Tkls" }, { lable: "T/0s Won" }]}
                list={defenseList}
            />

            <BoxscoreTable
                title="Kicking"
                columnHeaders={[{ lable: "Convs" }, { lable: "DG" }, { lable: "PK" }]}
                list={kickingList}
            />

        </div>
    )
}

function attackBoxscoreList(bs: GameSportAction[]): BoxscoreListRecordItem[] {
    const athleteIds: string[] = [];

    bs.forEach((b) => {
        if (!athleteIds.includes(b.athlete_id)) {
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


function defenseBoxscoreList(bs: GameSportAction[]): BoxscoreListRecordItem[] {
    const athleteIds: string[] = [];

    bs.forEach((b) => {
        if (!athleteIds.includes(b.athlete_id)) {
            athleteIds.push(b.athlete_id);
        }
    });

    const athleteStats: BoxscoreListRecordItem[] = athleteIds.map((a) => {
        const stats = bs.filter((b) => b.athlete_id === a);

        const tackles = stats.find((b) => b.action === "tackles")?.action_count;
        const dominantTackles = stats.find((b) => b.action === "dominant_tackles")?.action_count;
        const turnoversWon = stats.find((b) => b.action === "turnover_won")?.action_count;

        return {
            stats: [Math.floor(tackles ?? 0), Math.floor(dominantTackles ?? 0), Math.floor(turnoversWon ?? 0)],
            athleteId: a
        }
    }).sort((a, b) => {
        const [tackles] = a.stats;
        const [bTackles] = b.stats;

        return (bTackles ?? 0) - (tackles ?? 0)
    });


    return athleteStats;

}


function kickingBoxscoreList(bs: GameSportAction[]): BoxscoreListRecordItem[] {
    const athleteIds: string[] = [];

    bs.forEach((b) => {
        if (!athleteIds.includes(b.athlete_id)) {
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
    });


    return athleteStats;

}