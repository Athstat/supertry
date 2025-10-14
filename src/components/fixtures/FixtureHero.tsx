import { ArrowLeft } from "lucide-react"
import { IFixture } from "../../types/games"
import TeamLogo from "../team/TeamLogo"
import { useNavigate } from "react-router-dom"
import { fixtureSumary, summerizeGameStatus } from "../../utils/fixtureUtils"
import { format } from "date-fns"
import { twMerge } from "tailwind-merge"
import { GoTriangleLeft } from "react-icons/go"
import SecondaryText from "../shared/SecondaryText"

type Props = {
  fixture: IFixture
}

export default function FixtureHero({ fixture }: Props) {

  const navigate = useNavigate();
  const { team, opposition_team } = fixture;
  const { gameKickedOff } = fixtureSumary(fixture);

  return (
    <div className="w-full rounded-none h-40 bg-gradient-to-br ">
      <div
        className={twMerge(
          "flex p-2 cursor-pointer w-full  flex-row items-center justify-start",
          "flex flex-row items-center justify-center",
          // " dark:bg-dark-800/30 relative"
        )}
        onClick={() => navigate(-1)}
      >
        <div className="absolute text-slate-700 dark:text-slate-400 left-0 flex hover:text-blue-500 px-2 flex-row items-center gap-1" >
          <ArrowLeft className="w-4 h-4 " />
          <p className="text-sm" >Back</p>
        </div>

        <div>
          <SecondaryText>{fixture.competition_name}, Week {fixture.round}</SecondaryText>
        </div>
      </div>

      <div className={twMerge(
        "flex p-4  dark:bg-[#0D0D0D]  dark:border-slate-700/40 flex-row h-max items-center justify-center w-full ",
        // "dark:bg-gradient-to-r dark:from-gray-800/40 dark:via-[#0D0D0D] dark:to-gray-800/40",
        // "bg-gradient-to-r from-slate-100 via-white to-slate-100"
      )}>
        <div className="flex flex-1 flex-col items-center justify-start gap-3">
          <TeamLogo
            className="lg:hidden w-12 h-12 dark:text-slate-200 "
            url={team?.image_url}
            teamName={team?.athstat_name}
          />
          <TeamLogo
            className="lg:block hidden w-12 h-12 dark:text-slate-200 "
            url={team?.image_url}
            teamName={team?.athstat_name}
          />
          <p className="text-xs text-wrap text-center">{team?.athstat_name}</p>
        </div>

        <div className="flex flex-col mx-4 flex-[3]">
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
            className="lg:block hidden w-12 h-12 dark:text-slate-200 "
            url={opposition_team?.image_url}
            teamName={opposition_team?.athstat_name}
          />
          <p className="text-xs text-wrap text-center">{opposition_team?.athstat_name}</p>
        </div>
      </div>
    </div>
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
  const { homeTeamWon, awayTeamWon } = fixtureSumary(fixture);

  return (
    <div className="flex justify-between flex-1 w-full flex-col items-center">

      <div className="flex flex-1 w-full flex-row gap-2 items-center justify-between">
        {/* Home Team Score */}

        <div className={twMerge(
          "dark:text-white/50 font-black text-gray-800/40 opacity-70 flex-1 text-3xl lg:text-4xl  flex items-center justify-start",
          homeTeamWon && "text-black opacity-100 dark:text-white"
        )}>
          <p>{fixture?.team_score}</p>
          {homeTeamWon && (<GoTriangleLeft />)}
        </div>

        <div className="flex flex-1 flex-col dark:text-white text-center items-center justify-center">
          {game_status ? <p>{summerizeGameStatus(fixture)}</p> : "-"}
        </div>

        {/* Away Team Score */}
        <div className={twMerge(
          "dark:text-white/50 font-black text-gray-800/40 flex-1 text-3xl lg:text-4xl  flex items-center justify-end",
          awayTeamWon && "text-black dark:text-white opacity-100"
        )}>
          <p>{fixture?.opposition_score}</p>
          {awayTeamWon && (<GoTriangleLeft />)}
        </div>
      </div>
    </div>
  );
}
