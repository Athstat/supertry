import { IFixture } from "../../types/games"
import TitledCard from "../shared/TitledCard"
import { IBoxScore } from "../../types/boxScore"
import AthleteBoxScore from "./AthleteBoxScore"
import { attackBias, rankByAttackingStats } from "../../utils/boxScoreUtils"
import PlayerMugshot from "../shared/PlayerMugshot"
import PlayerSmallCard from "../player/PlayerSmallCard"

type Props = {
  fixture: IFixture,
  boxScores: IBoxScore[]
}

export default function FixtureAttackingLeaders({ boxScores, fixture }: Props) {

  const sortedList = rankByAttackingStats(boxScores);
  let shortList = sortedList;
  shortList = shortList.slice(0, 4);


  return (
    <TitledCard title={'Attacking Leaders'} >

      <div className="grid grid-cols-1 gap-2 w-full" >
        
        {shortList.map((bs, index) => {

          const isHomePlayer = fixture.team_id === bs.athlete_team_id;

          return <div key={index} className="flex flex-row items-center w-full justify-start gap-2" >

            <div className="text-slate-700 dark:text-slate-400 " >{index + 1}</div>

            <PlayerSmallCard
              imageUrl={bs.athlete_image_url}
              firstName={bs.athlete_first_name}
              lastName={bs.athlete_last_name} 
              position={bs.athlete_position}
            >
              <div className="flex flex-row w-full text-slate-600 dark:text-slate-400 text-sm gap-2 items-center justify-start" >
                {bs.points !== 0 && <p>Points {bs.points}</p>}
                {bs.tries !== 0 && <p> Tries {bs.tries}</p>}
                {bs.carries !== 0 && <p>Carries {bs.carries}</p>}
                {bs.passes !== 0 && <p>Passes {bs.passes}</p>}
              </div>
            </PlayerSmallCard>

          </div>

        })}
      </div>

    </TitledCard>
  )
}