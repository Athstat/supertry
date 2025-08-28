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

type Props = {
    fixture: IFixture,
    sportActions: GameSportAction[]
}

export default function FixtureAthleteStats({ fixture, sportActions }: Props) {

    const { gameKickedOff } = fixtureSumary(fixture);
    const [search, setSearch] = useState<string>("");

    const athleteIds = useMemo(() => {
        const ids: string[] = [];
        sportActions.forEach((sa) => {

            if (!ids.includes(sa.athlete_id)) {
                ids.push(sa.athlete_id);
            }

        });

        return ids;
    }, [sportActions]);

    const athleteActions: AthleteBoxscoreItem[] = useMemo(() => {

        return athleteIds.map((id) => {
            return {
                athlete_id: id,
                actions: sportActions.filter((sa) => {
                    return sa.athlete_id === id
                })
            }
        }).sort((a, b) => {
            const pointsA = a.actions.find(p => p.action === 'points')?.action_count;
            const pointsB = b.actions.find(p => p.action === 'points')?.action_count;

            return (pointsB ? Number(pointsB) : 0) - (pointsA ? Number(pointsA) : 0);
        });
    }, [athleteIds, sportActions]);



    if (!gameKickedOff) return;

    if (athleteActions.length === 0) return;

    return (

        <div className="flex flex-col gap-3 w-full" >
            <div className="flex flex-row items-center justify-start gap-2" >
                <Table2 />
                <h1 className="font-bold text-lg" >Boxscore</h1>
            </div>

            <div className="flex flex-row items-center justify-between" >
                <div>
                    <p>Athlete</p>
                </div>

                <div className="flex flex-row items-center gap-2" >
                    <p className="w-[40px] text-end" >Pts</p>
                    <p className="w-[40px] text-end" >Tries</p>
                    <p className="w-[40px] text-end" >Mins</p>
                </div>
            </div>

            <div className="flex flex-col gap-4" >
                {athleteActions.map((a, index) => {
                    return (
                        <AthleteBoxscoreRecord
                            athlete={a}
                            index={index}
                        />
                    )
                })}
            </div>
        </div>
    )
}

