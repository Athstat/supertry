import { IRosterItem } from "../../../../types/games"

type Props = {
    bench: IRosterItem[]
}

/** Renders game roster bench */
export default function FixtureRosterBench({bench} : Props) {
  return (
    <div>
        <p>{bench.length}</p>
    </div>
  )
}
