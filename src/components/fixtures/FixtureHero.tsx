import { ArrowLeft, Minus } from "lucide-react"
import { IFixture } from "../../types/games"
import BlueGradientCard from "../shared/BlueGradientCard"
import TeamLogo from "../team/TeamLogo"
import { useNavigate } from "react-router-dom"
import { fixtureSumary, summerizeGameStatus } from "../../utils/fixtureUtils"
import { format } from "date-fns"

type Props = {
    fixture: IFixture
}

export default function FixtureHero({ fixture }: Props) {

    const navigate = useNavigate();
    const {team, opposition_team} = fixture;
    const {gameKickedOff} = fixtureSumary(fixture);

    return (
        <BlueGradientCard className="p-4 w-full rounded-none h-56 bg-gradient-to-br lg:px-[15%] ">
            <div
                onClick={() => navigate(-1)}
                className="flex mb-5 lg:px-4 cursor-pointer w-full hover:text-blue-500 flex-row items-center justify-start"
            >
                <ArrowLeft />
                <p>Go Back</p>
            </div>

            <div className="flex flex-row h-max items-center justify-center w-full ">
                <div className="flex flex-1 flex-col items-center justify-start gap-3">
                    <TeamLogo
                        className="lg:hidden w-12 h-12 dark:text-slate-200 "
                        url={team?.image_url}
                        teamName={team?.athstat_name}
                    />
                    <TeamLogo
                        className="lg:block hidden w-16 h-16 dark:text-slate-200 "
                        url={team?.image_url}
                        teamName={team?.athstat_name}
                    />
                    <p className="text text-wrap text-center">{team?.athstat_name}</p>
                </div>

                <div className="flex flex-col flex-1">
                    {gameKickedOff && <MatchResultsInformation fixture={fixture} />}
                    {!gameKickedOff && <KickOffInformation fixture={fixture} />}
                </div>

                <div className="flex flex-1 flex-col items-center gap-3 justify-end">
                    <TeamLogo
                        className="lg:hidden w-12 h-12 dark:text-slate-200 "
                        url={opposition_team?.image_url}
                        teamName={opposition_team?.athstat_name}
                    />
                    <TeamLogo
                        className="lg:block hidden w-16 h-16 dark:text-slate-200 "
                        url={opposition_team?.image_url}
                        teamName={opposition_team?.athstat_name}
                    />
                    <p className="text text-wrap text-center">{opposition_team?.athstat_name}</p>
                </div>
            </div>
        </BlueGradientCard>
    )
}



function KickOffInformation({ fixture }: Props) {
  const { kickoff_time } = fixture;

  return (
    <div className="flex flex-1 text-nowrap flex-col dark:text-white text-center items-center justify-center">
      {kickoff_time && <p className="font-bold">{format(kickoff_time, 'h:mm a')}</p>}
      {kickoff_time && (
        <p className="dark:text-slate-300 text-slate-200">{format(kickoff_time, 'dd MMM yyyy')}</p>
      )}
    </div>
  );
}

function MatchResultsInformation({ fixture }: Props) {
  const { game_status } = fixture;

  return (
    <div className="flex justify-center  flex-1 w-full flex-col items-center">
      <div>
        {game_status && (
          <span className="text text-slate-white font-semibold dark:text-slate-100">
            {summerizeGameStatus(fixture)}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-row gap-2 items-center justify-between">
        {/* Home Team Score */}

        <div className="dark:text-white flex-1 text-3xl lg:text-4xl font-bold flex items-center justify-end">
          <p>{fixture?.team_score}</p>
        </div>

        <div className="flex flex-1 flex-col dark:text-white text-center items-center justify-center">
          <Minus />
        </div>

        {/* Away Team Score */}
        <div className="dark:text-white  text-wrap flex-1 text-3xl lg:text-4xl font-bold flex items-center justify-start">
          <p>{fixture?.opposition_score}</p>
        </div>
      </div>
    </div>
  );
}
