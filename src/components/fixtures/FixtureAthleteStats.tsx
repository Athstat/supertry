import { IFixture } from "../../types/games"
import { fixtureSumary } from "../../utils/fixtureUtils"
import { GameSportAction } from "../../types/boxScore"
import { useEffect, useMemo } from "react"
import { Table2 } from "lucide-react"
import { BoxscoreTable } from "./boxscore/BoxscoreCategoryList"
import FixtureTeamSelector from "./boxscore/FixtureTeamSelector"
import { useBoxscoreFilter } from "../../hooks/fixtures/useBoxscoreFilter"
import { fixtureAnalytics } from "../../services/analytics/fixtureAnalytics"
import { useInView } from "react-intersection-observer"
import { attackBoxscoreList, defenseBoxscoreList, kickingBoxscoreList, disciplineBoxscoreList } from "../../utils/boxScoreUtils"

type Props = {
    fixture: IFixture,
    sportActions: GameSportAction[]
}

export default function FixtureAthleteStats({ fixture, sportActions }: Props) {

    const { gameKickedOff } = fixtureSumary(fixture);
    // const [search, setSearch] = useState<string>("");

    const { selectedTeamId } = useBoxscoreFilter(fixture);
    const {ref, inView} = useInView({triggerOnce: true});

    useEffect(() => {
        
        if (inView) {
            fixtureAnalytics.trackViewedBoxscore(fixture);
        }

    }, [fixture, inView]);


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

        <div ref={ref} className="flex flex-col gap-8 w-full" >

            <div className="flex flex-col gap-4" >
                <div className="flex flex-row items-center justify-start gap-2" >
                    <Table2 />
                    <h1 className="font-bold text-lg" >Boxscore</h1>
                </div>

                <FixtureTeamSelector
                    fixture={fixture}
                />
            </div>

            <BoxscoreTable
                title="Attacking"
                columnHeaders={[{ lable: "Tries" }, { lable: "Pts" }, { lable: "Carr" }]}
                list={attackList}
            />

            <BoxscoreTable
                title="Defense"
                columnHeaders={[{ lable: "Tkls" }, { lable: "DT" }, { lable: "T/0s Won" }]}
                list={defenseList}
            />

            <BoxscoreTable
                title="Kicking"
                columnHeaders={[{ lable: "Convs" }, { lable: "DG" }, { lable: "PK" }]}
                list={kickingList}
            />

            <BoxscoreTable
                title="Discipline"
                columnHeaders={[{ lable: "Red" }, { lable: "Yellow" }]}
                list={disciplineList}
                noContentMessage="Whoops, clean game detected"
            />

        </div>
    )
}

