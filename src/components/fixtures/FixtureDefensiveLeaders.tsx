import { IFixture } from "../../types/games"
import TitledCard from "../shared/TitledCard"
import { IBoxScore } from "../../types/boxScore"
import { rankByDeffensiveStats } from "../../utils/boxScoreUtils"
import PlayerSmallCard from "../player/PlayerSmallCard"
import { Shield } from "lucide-react"

type Props = {
  fixture: IFixture,
  boxScores: IBoxScore[]
}

export default function FixtureDefensiveLeaders({ boxScores}: Props) {

  const sortedList = rankByDeffensiveStats(boxScores);
  let shortList = sortedList;
  shortList = shortList.slice(0, 4);


  return (
    <TitledCard icon={Shield} title={'Defensive Leaders'} >

      <div className="grid grid-cols-1 gap-2 w-full" >
        
        {shortList.map((bs, index) => {

          return <div key={index} className="flex flex-row items-center w-full justify-start gap-2" >

            <div className="text-slate-700 dark:text-slate-400 " >{index + 1}</div>

            <PlayerSmallCard
              imageUrl={bs.athlete_image_url}
              firstName={bs.athlete_first_name}
              lastName={bs.athlete_last_name} 
              position={bs.athlete_position}
            >
              <div className="flex flex-row w-full text-wrap text-slate-600 dark:text-slate-400 text-sm gap-2 items-center justify-start" >
                {bs.tacklesuccess !== 0 && <p className="text-nowrap">Tackles {bs.tacklesmade}/{bs.tacklesmade + bs.tacklesmissed}</p>}
                {bs.turnoverswon !== 0 && <p className="text-nowrap">T/Os Won {bs.turnoverswon}</p>}
              </div>
            </PlayerSmallCard>

          </div>

        })}
      </div>

    </TitledCard>
  )
}