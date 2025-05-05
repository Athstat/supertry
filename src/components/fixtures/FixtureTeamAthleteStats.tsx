import { useState } from "react"
import { IFixture } from "../../types/games"
import TitledCard from "../shared/TitledCard"
import AthleteFixtureStatsModal from "./AthleteFixtureStatsModal"

type Props = {
  fixture: IFixture,
  teamName?: string,
  title?: string
}

export default function FixtureAthletesScoreBoard({ fixture, title }: Props) {

  const [showModal, setShowModal] = useState(false);
  const toogle = () => setShowModal(!showModal);

  return (
    <TitledCard title={title} >
      <table className="w-full" >
        <thead className="bg-gray-100 text-slate-600 dark:text-white  dark:bg-gray-700/20" >
          <tr>
            <th>Name</th>
            <th>Tries</th>
            <th>Assits</th>
            <th>Tackes %</th>
            <th>Carries</th>
          </tr>
        </thead>

        <tbody onClick={toogle} >
          <tr className="dark:hover:bg-slate-700/30 hover:bg-slate-100" >
            <td>J. Doe</td>
            <td>1</td>
            <td>0</td>
            <td>88%</td>
            <td>3</td>
          </tr>

          <tr className="dark:hover:bg-slate-700/30 hover:bg-slate-100" >
            <td>S. Kolisi</td>
            <td>0</td>
            <td>1</td>
            <td>90%</td>
            <td>5</td>
          </tr>

          <tr className="dark:hover:bg-slate-700/30 hover:bg-slate-100" >
            <td>J. Watt</td>
            <td>2</td>
            <td>0</td>
            <td>79%</td>
            <td>15</td>
          </tr>
        </tbody>
      </table>

      <AthleteFixtureStatsModal onClose={toogle} open={showModal} fixture={fixture} />
    </TitledCard>
  )
}