import { IFixture } from "../../types/games"
import TitledCard from "../shared/TitledCard"
import { IBoxScore } from "../../types/boxScore"
import { rankByDisciplineStats } from "../../utils/boxScoreUtils"
import PlayerBoxScoreSmallCard from "../player/PlayerSmallCard"
import { useState } from "react"

type Props = {
  fixture: IFixture,
  boxScores: IBoxScore[]
}

export default function FixtureDisciplineLeaders({ boxScores, fixture }: Props) {

  const [showMore, setShowMore] = useState(false);
  const toogle = () => setShowMore(!showMore);

  const sortedList = rankByDisciplineStats(boxScores)
  .filter((a) => a.redcards !== 0 || a.yellowcards !== 0);
  
  let shortList = sortedList;
  const length = showMore ? sortedList.length : 4
  shortList = shortList.slice(0, length);

  return (
    <TitledCard title={'Discipline'} >

      <div className="grid grid-cols-1 gap-2 w-full" >

        {shortList.map((bs, index) => {

          return <div key={index} className="flex flex-row items-center w-full justify-start gap-2" >

            <div className="text-slate-700 dark:text-slate-400 " >{index + 1}</div>

            <PlayerBoxScoreSmallCard
              boxScore={bs}
              fixture={fixture}
            >
              <div className="flex flex-row w-full text-wrap text-slate-600 dark:text-slate-400 text-sm gap-2 items-center justify-start" >
                {bs.redcards !== 0 && <p className="text-nowrap">Red Cards {bs.redcards}</p>}
                {bs.yellowcards !== 0 && <p className="text-nowrap">Yellow Cards {bs.yellowcards}</p>}
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