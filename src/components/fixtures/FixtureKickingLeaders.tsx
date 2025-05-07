import { IFixture } from "../../types/games"
import TitledCard from "../shared/TitledCard"
import { IBoxScore } from "../../types/boxScore"
import { rankByKickingStats } from "../../utils/boxScoreUtils"
import PlayerSmallCard from "../player/PlayerSmallCard"

type Props = {
  fixture: IFixture,
  boxScores: IBoxScore[]
}

export default function FixtureKickingLeaders({ boxScores}: Props) {

  const sortedList = rankByKickingStats(boxScores);
  let shortList = sortedList;
  shortList = shortList.slice(0, 3);

  return (
    <TitledCard title={'Kicking Leaders'} >

      <div className="grid grid-cols-1 gap-2 w-full" >
        
        {shortList.map((bs, index) => {
          const showPlayer = bs.kicksfromhand !== 0 && bs.kicksfromhandmetres;

          if (!showPlayer) return;

          return <div key={index} className="flex flex-row items-center w-full justify-start gap-2" >

            <div className="text-slate-700 dark:text-slate-400 " >{index + 1}</div>

            <PlayerSmallCard
              imageUrl={bs.athlete_image_url}
              firstName={bs.athlete_first_name}
              lastName={bs.athlete_last_name} 
              position={bs.athlete_position}
            >
              <div className="flex flex-row w-full text-wrap text-slate-600 dark:text-slate-400 text-sm gap-2 items-center justify-start" >
                {bs.kicksfromhand !== 0 && <p className="text-nowrap">Kicks From Hand {bs.kicksfromhand}</p>}
                {bs.kicksfromhandmetres !== 0 && <p className="text-nowrap">Metres {bs.kicksfromhandmetres}</p>}
              </div>

            </PlayerSmallCard>

          </div>

        })}
      </div>

    </TitledCard>
  )
}