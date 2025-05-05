import { useState } from "react"
import { IFixture } from "../../types/games"
import DialogModal from "../shared/DialogModal"
import TitledCard from "../shared/TitledCard"
import PlayerMugshot from "../shared/PlayerMugshot"
import { GroupedStatsGrid } from "../shared/GroupedStatsGrid"
import { StatCard } from "../shared/StatCard"
import AthleteFixtureStatsModal from "./AthleteFixtureStatsModal"

type Props = {
  fixture: IFixture,
  teamName?: string,
  title?: string
}

export default function FixtureAthletesScoreBoard({ teamName, fixture, title }: Props) {

  const [showModal, setShowModal] = useState(false);
  const toogle = () => setShowModal(!showModal);

  return (
    <TitledCard title={title} >
      <table className="w-full" >
        <thead>
          <tr>
            <th>Name</th>
            <th>Tries</th>
            <th>Assits</th>
            <th>Tackes %</th>
            <th>Carries</th>
          </tr>
        </thead>

        <tbody onClick={toogle} >
          <tr className="hover:bg-slate-700/30" >
            <td>J. Doe</td>
            <td>1</td>
            <td>0</td>
            <td>88%</td>
            <td>3</td>
          </tr>

          <tr className="hover:bg-slate-700/30" >
            <td>S. Kolisi</td>
            <td>0</td>
            <td>1</td>
            <td>90%</td>
            <td>5</td>
          </tr>

          <tr className="hover:bg-slate-700/30" >
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