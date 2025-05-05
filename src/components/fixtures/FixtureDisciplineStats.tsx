import { useState } from "react";
import { IFixture } from "../../types/games"
import TitledCard from "../shared/TitledCard";
import AthleteFixtureStatsModal from "./AthleteFixtureStatsModal";

type Props = {
    fixture: IFixture
}
export default function FixtureDisciplineStats({ fixture }: Props) {

    const [showModal, setShowModal] = useState(false);
    const toogle = () => setShowModal(!showModal);

    return (
        <TitledCard title="Discipline" >
            <table className="w-full" >
                <thead>
                    <tr className="bg-gray-100 text-slate-600 dark:text-white  dark:bg-gray-700/20" >
                        <th>Name</th>
                        <th >Red Cards</th>
                        <th>Yellow Cards</th>
                        <th>Penalties Conceded</th>
                    </tr>
                </thead>

                <tbody onClick={toogle} >
                    <tr className="dark:hover:bg-slate-700/30 hover:bg-slate-100" >
                        <td>J. Doe</td>
                        <td>1</td>
                        <td>1</td>
                        <td>0</td>
                    </tr>

                    <tr className="dark:hover:bg-slate-700/30 hover:bg-slate-100" >
                        <td>S. Kolisi</td>
                        <td>0</td>
                        <td>1</td>
                        <td>0</td>
                    </tr>
                </tbody>
            </table>

            <AthleteFixtureStatsModal onClose={toogle} open={showModal} fixture={fixture} />
        </TitledCard>
    )
}
