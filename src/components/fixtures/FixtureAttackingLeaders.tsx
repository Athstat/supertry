import { IFixture } from "../../types/games"
import TitledCard from "../shared/TitledCard"
import { IBoxScoreItem } from "../../types/boxScore"
import { rankByAttackingStats } from "../../utils/boxScoreUtils"
import PlayerBoxScoreSmallCard from "../player/PlayerSmallCard"
import { Bomb } from "lucide-react"
import { useState } from "react"

type Props = {
  fixture: IFixture,
  boxScores: IBoxScoreItem[]
}

export default function FixtureAttackingLeaders({ boxScores, fixture }: Props) {

  const [showMore, setShowMore] = useState(false);
  const toogle = () => setShowMore(!showMore);

  const sortedList = rankByAttackingStats(boxScores);

  let shortList = sortedList;
  const length = showMore ? sortedList.length : 4
  shortList = shortList.slice(0, length);


  return (
    <TitledCard icon={Bomb} title={'Attacking Leaders'} >

      <div className="grid grid-cols-1 gap-3 w-full" >

        {shortList.map((bs, index) => {

          return <div key={index} className="flex flex-row items-center w-full justify-start gap-2" >

            <div className="text-slate-700 dark:text-slate-400 " >{index + 1}</div>

            <PlayerBoxScoreSmallCard
              boxScore={bs}
              fixture={fixture}
            >
              <div className="flex flex-row w-full text-slate-600 dark:text-slate-400 text-xs lg:text-sm gap-2 items-center justify-start" >
                
                {bs.athlete_match_power_ranking !== 0 && <p>PR {bs.athlete_match_power_ranking?.toFixed(1)}</p>}
                {bs.points !== 0 && <p>Points {bs.points}</p>}
                {bs.tries !== 0 && <p> Tries {bs.tries}</p>}
                {bs.carries !== 0 && <p>Carries {bs.carries}</p>}
                {bs.passes !== 0 && <p>Passes {bs.passes}</p>}
              </div>
            </PlayerBoxScoreSmallCard>

          </div>

        })}

      </div>

      {sortedList.length > 4 && <div className="mt-3" >
        <p onClick={toogle} className="text-blue-500 hover:text-blue-600 font-bold cursor-pointer dark:hover:text-blue-400 " >{showMore ? "Show Less" : "Show More"}</p>
      </div>}

    </TitledCard>
  )
}