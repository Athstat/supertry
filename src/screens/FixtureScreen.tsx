import { useLocation, useParams } from "react-router-dom";
import { IFixture } from "../types/games";
import TeamLogo from "../components/team/TeamLogo";
import { format } from "date-fns";
import { fixtureSumary, summerizeGameStatus } from "../utils/fixtureUtils";
import { Minus } from "lucide-react";
import { FixtureScreenHeader } from "../components/fixtures/FixtureScreenHeader";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "../hooks/useRoter";

export default function FixtureScreen() {

  const { fixtureId } = useParams();
  const { state } = useLocation();


  if (!state || state.game_id !== fixtureId) {
    return <div>
      <p>Fixture was not found</p>
    </div>
  }

  const fixture = state as IFixture;
  const { gameKickedOff } = fixtureSumary(fixture);

  const { back } = useRouter();

  return (
    <div className="dark:text-white" >

      <div className="p-4 w-full h-56 bg-gradient-to-tr from-blue-700 to-blue-900 text-white" >

        <div onClick={() => back()} className="flex mb-5 cursor-pointer w-full hover:text-blue-500 flex-row items-center justify-start" >
          <ArrowLeft />
          <p>Go Back</p>
        </div>

        <FixtureScreenHeader fixture={fixture} />

        <div className="flex flex-row h-max items-center justify-center w-full" >

          <div className="flex flex-1 flex-col items-center justify-start" >
            <TeamLogo className="w-16 h-16 dark:text-slate-200" teamId={fixture.team_id} />
            <p className="text text-wrap text-center" >{fixture.home_team}</p>
          </div>

          <div className="flex flex-col flex-1" >
            {gameKickedOff && <MatchResultsInformation fixture={fixture} />}
            {!gameKickedOff && <KickOffInformation fixture={fixture} />}
          </div>

          <div className="flex flex-1 flex-col items-center justify-end" >
            <TeamLogo className="w-16 h-16 dark:text-slate-200" teamId={fixture.opposition_team_id} />
            <p className="text text-wrap text-center" >{fixture.away_team}</p>
          </div>

        </div>
      </div>

    </div>
  )
}


type Props = {
  fixture: IFixture
}

function KickOffInformation({ fixture }: Props) {

  const { kickoff_time } = fixture;

  return (
    <div className='flex flex-1 text-nowrap flex-col dark:text-white text-center items-center justify-center' >
      {kickoff_time && <p className='font-medium' >{format(kickoff_time, "h:mm a")}</p>}
      {kickoff_time && <p className='dark:text-slate-300 text-slate-800' >{format(kickoff_time, "dd MMM yyyy")}</p>}
    </div>
  )
}

function MatchResultsInformation({ fixture }: Props) {

  const { kickoff_time, game_status } = fixture;


  return (
    <div className='flex justify-center  flex-1 w-full flex-col items-center' >

      <div>
        {game_status && <span className='text text-slate-500 font-semibold dark:text-slate-400' >{summerizeGameStatus(fixture)}</span>}
      </div>

      <div className='flex flex-1 flex-row gap-2 items-center justify-between' >
        {/* Home Team Score */}

        <div className='dark:text-white flex-1 text-4xl font-bold flex items-center justify-end' >
          <p>{fixture.team_score}</p>
        </div>

        <div className='flex flex-1 flex-col dark:text-white text-center items-center justify-center' >
          <Minus />
        </div>

        {/* Away Team Score */}
        <div className='dark:text-white  text-wrap flex-1 text-4xl font-bold flex items-center justify-start' >
          <p>{fixture.opposition_score}</p>
        </div>
      </div>
    </div>
  )
}