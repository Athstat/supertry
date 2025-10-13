import { BoxscoreHeader } from "../../../types/boxScore"

type Props = {
    tableTitle?: string,
    columns: BoxscoreHeader[]
}

/** Renders an ESPN like boxscore Table */
export default function BoxscoreTable2({tableTitle} : Props) {
  return (
    <div>
        <p>{tableTitle}</p>
    </div>
  )
}
