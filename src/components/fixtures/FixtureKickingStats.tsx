import { useState } from "react";
import { IFixture } from "../../types/games"
import TitledCard from "../shared/TitledCard"

type Props = {
    fixture: IFixture
}

export default function FixtureKickingStats({}: Props) {
    

      const [showModal, setShowModal] = useState(false);
      const toogle = () => setShowModal(!showModal);
    
    return (
        <TitledCard title="Kicking" >
            <table className="w-full" >
                <thead>
                    <tr>
                        <th>Name</th>
                        <th className="" >Conversion Atts.</th>
                        <th>Penalty Kicks</th>
                        <th>Drop Goals</th>
                    </tr>
                </thead>

                <tbody onClick={toogle} >
                    <tr className="hover:bg-slate-700/30" >
                        <td>J. Doe</td>
                        <td>1</td>
                        <td>0</td>
                        <td>3</td>
                    </tr>

                    <tr className="hover:bg-slate-700/30" >
                        <td>S. Kolisi</td>
                        <td>0</td>
                        <td>1</td>
                        <td>5</td>
                    </tr>

                    <tr className="hover:bg-slate-700/30" >
                        <td>J. Watt</td>
                        <td>2</td>
                        <td>0</td>
                        <td>15</td>
                    </tr>
                </tbody>
            </table>

            {/* <AthleteFixtureStatsModal onClose={toogle} open={showModal} fixture={fixture} /> */}
        </TitledCard>
    )
}
