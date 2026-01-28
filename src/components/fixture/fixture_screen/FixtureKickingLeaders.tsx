import { useState } from "react"
import { IBoxScoreItem } from "../../../types/boxScore";
import { IFixture } from "../../../types/fixtures";
import { rankByKickingStats } from "../../../utils/boxScoreUtils";
import PlayerBoxScoreSmallCard from "../../player/PlayerSmallCard";
import TitledCard from "../../ui/cards/TitledCard";

type Props = {
  fixture: IFixture,
  boxScores: IBoxScoreItem[]
}

export default function FixtureKickingLeaders({ boxScores, fixture }: Props) {
  const [showMore, setShowMore] = useState(false);
  const toogle = () => setShowMore(!showMore);

  const sortedList = rankByKickingStats(boxScores)
  .filter(a => a.kicksfromhand !== 0 || a.kicksfromhandmetres);

  let shortList = sortedList;
  const length = showMore ? sortedList.length : 4
  shortList = shortList.slice(0, length);

  return (
    <TitledCard title={'Kicking Leaders'} >

      <div className="grid grid-cols-1 gap-2 w-full" >

        {shortList.map((bs, index) => {
          
          return <div key={index} className="flex flex-row items-center w-full justify-start gap-2" >

            <div className="text-slate-700 dark:text-slate-400 " >{index + 1}</div>

            <PlayerBoxScoreSmallCard
              boxScore={bs}
              fixture={fixture}
            >
              <div className="flex flex-row w-full text-wrap text-slate-600 dark:text-slate-400 text-xs lg:text-sm gap-2 items-center justify-start" >
                {bs.kicksfromhand !== 0 && <p className="text-nowrap">Kicks From Hand {bs.kicksfromhand}</p>}
                {bs.kicksfromhandmetres !== 0 && <p className="text-nowrap">Metres {bs.kicksfromhandmetres}</p>}
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