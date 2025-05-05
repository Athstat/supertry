import { IFixture } from "../../types/games"
import TitledCard from "../shared/TitledCard"
import { IBoxScore } from "../../types/boxScore"
import AthleteBoxScore from "./AthleteBoxScore"

type Props = {
  fixture: IFixture,
  teamName?: string,
  title?: string,
  boxScores: IBoxScore[]
}

export default function AthleteBoxScoreList({ title, boxScores }: Props) {

  return (
    <TitledCard title={title} >
      <table className="w-full" >
        <thead className="bg-gray-100 text-slate-600 dark:text-white  dark:bg-gray-700/20" >
          <tr>
            <th>Name</th>
            <th>Tries</th>
            <th>Passes</th>
            <th>Tackles %</th>
            <th>Carries</th>
          </tr>
        </thead>

        <tbody >
          
          {boxScores.map((bs, index) => {
            return <AthleteBoxScore boxScoreRecord={bs} key={index} />
          })}
          
        </tbody>
      </table>

    </TitledCard>
  )
}