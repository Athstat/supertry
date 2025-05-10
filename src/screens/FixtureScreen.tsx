import { useNavigate, useParams } from "react-router-dom";
import { IFixture } from "../types/games";
import TeamLogo from "../components/team/TeamLogo";
import { format } from "date-fns";
import { fixtureSumary, summerizeGameStatus } from "../utils/fixtureUtils";
import { Minus } from "lucide-react";
import { ArrowLeft } from "lucide-react";
import FixtureScreenOverview from "../components/fixtures/FixtureScreenOverview";
import { ErrorState } from "../components/ui/ErrorState";
import useSWR from "swr";
import { gamesService } from "../services/gamesService";
import { LoadingState } from "../components/ui/LoadingState";
import FixtureAthleteStats from "../components/fixtures/FixtureAthleteStats";
import { boxScoreService } from "../services/boxScoreService";
import { FixtureScreenHeader } from "../components/fixtures/FixtureScreenHeader";
import TabView, { TabViewHeaderItem, TabViewPage } from "../components/shared/tabs/TabView";
import FixtureHeadToHeadStats from "../components/fixtures/FixtureHeadToHeadStats";

export default function FixtureScreen() {

  const navigate = useNavigate();
  const { fixtureId } = useParams();

  if (!fixtureId) return <ErrorState message="Match was not found" />

  const {data: fetchedFixture, isLoading} = useSWR(["games", fixtureId], async ([, gameId]) =>  await gamesService.getGameById(gameId))
  const {data: boxScore, isLoading: loadingBoxScore} = useSWR(["boxscores", fixtureId], ([, gameId]) => boxScoreService.getBoxScoreByGameId(gameId));
  
  if (isLoading) return <LoadingState />

  if (!fetchedFixture) return <ErrorState message="Failed to load match information" />

  const fixture = fetchedFixture as IFixture;
  const { gameKickedOff } = fixtureSumary(fixture);

  const tabItems: TabViewHeaderItem[] = [
    {
      label: "Athlete Stats",
      tabKey: "athletes-stats",
      disabled: !boxScore || boxScore.length === 0
    },

    {
      label: "Team Stats",
      tabKey: "team-stats",
      disabled: !boxScore || boxScore.length === 0
    },

    {
      label: "Kick Off",
      tabKey: "kick-off",
      disabled: false
    }

  ]


  return (
    <div className="dark:text-white flex flex-col" >

      <div className="p-4 w-full h-56 bg-gradient-to-br  from-blue-800 to-blue-900 dark:from-blue-800 dark:to-blue-950 text-white" >

        <div onClick={() => navigate(-1)} className="flex mb-5 cursor-pointer w-full hover:text-blue-500 flex-row items-center justify-start" >
          <ArrowLeft />
          <p>Go Back</p>
        </div>


        <div className="flex flex-row h-max items-center justify-center w-full" >

          <div className="flex flex-1 flex-col items-center justify-start gap-3" >
            <TeamLogo className="lg:hidden w-12 h-12 dark:text-slate-200 " url={fixture.team_image_url} />
            <TeamLogo className="lg:block hidden w-16 h-16 dark:text-slate-200 " url={fixture.team_image_url} />
            <p className="text text-wrap text-center" >{fixture.team_name}</p>
          </div>

          <div className="flex flex-col flex-1" >
            {gameKickedOff && <MatchResultsInformation fixture={fixture} />}
            {!gameKickedOff && <KickOffInformation fixture={fixture} />}
          </div>

          <div className="flex flex-1 flex-col items-center gap-3 justify-end" >
          <TeamLogo className="lg:hidden w-12 h-12 dark:text-slate-200 " url={fixture.opposition_image_url} />
          <TeamLogo className="lg:block hidden w-16 h-16 dark:text-slate-200 " url={fixture.opposition_image_url} />
            <p className="text text-wrap text-center" >{fixture.opposition_team_name}</p>
          </div>

        </div>

      </div>

      {/* {boxScore && <FixtureScreenTab />} */}
      <FixtureScreenHeader fixture={fixture} />

      { !loadingBoxScore &&  <TabView tabHeaderItems={tabItems}  >

        <TabViewPage className="flex flex-col p-4 gap-5" tabKey="athletes-stats" >
          {boxScore && <FixtureAthleteStats boxScore={boxScore} fixture={fixture} />}
        </TabViewPage>

        <TabViewPage className="flex flex-col p-4 gap-5" tabKey="kick-off" >
          <FixtureScreenOverview fixture={fixture} />
        </TabViewPage>

        <TabViewPage className="flex flex-col p-4 gap-5" tabKey="team-stats" >
          {boxScore && <FixtureHeadToHeadStats boxScore={boxScore} fixture={fixture} />}
        </TabViewPage>
      
      </TabView>}

      <div className="flex flex-col p-4 gap-5" >

        {/* Overview Component */}
        {loadingBoxScore && <LoadingState />}
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
      {kickoff_time && <p className='font-bold' >{format(kickoff_time, "h:mm a")}</p>}
      {kickoff_time && <p className='dark:text-slate-300 text-slate-200' >{format(kickoff_time, "dd MMM yyyy")}</p>}
    </div>
  )
}

function MatchResultsInformation({ fixture }: Props) {

  const { game_status } = fixture;


  return (
    <div className='flex justify-center  flex-1 w-full flex-col items-center' >

      <div>
        {game_status && <span className='text text-slate-white font-semibold dark:text-slate-100' >{summerizeGameStatus(fixture)}</span>}
      </div>

      <div className='flex flex-1 flex-row gap-2 items-center justify-between' >
        {/* Home Team Score */}

        <div className='dark:text-white flex-1 text-3xl lg:text-4xl font-bold flex items-center justify-end' >
          <p>{fixture.team_score}</p>
        </div>

        <div className='flex flex-1 flex-col dark:text-white text-center items-center justify-center' >
          <Minus />
        </div>

        {/* Away Team Score */}
        <div className='dark:text-white  text-wrap flex-1 text-3xl lg:text-4xl font-bold flex items-center justify-start' >
          <p>{fixture.opposition_score}</p>
        </div>
      </div>
    </div>
  )
}