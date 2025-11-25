import { ArrowLeft } from 'lucide-react';
import { IFixture } from '../../types/games';
import TeamLogo from '../team/TeamLogo';
import { useNavigate } from 'react-router-dom';
import { fixtureSummary, isGameLive, formatGameStatus } from '../../utils/fixtureUtils';
import { format } from 'date-fns';
import { twMerge } from 'tailwind-merge';
import { GoTriangleLeft } from 'react-icons/go';
import SecondaryText from '../shared/SecondaryText';
import TeamSeasonRecordText from '../teams/TeamSeasonRecordText';
import { IProTeam } from '../../types/team';

type Props = {
  fixture: IFixture;
};

export default function FixtureHero({ fixture }: Props) {
  const navigate = useNavigate();
  const { team, opposition_team } = fixture;
  const { gameKickedOff } = fixtureSummary(fixture);

  const handleBack = () => {
    navigate('/fixtures');
  }

  return (
    <div className="w-full rounded-none h-44 bg-gradient-to-br ">
      <div
        className={twMerge(
          'flex p-2 cursor-pointer w-full  flex-row items-center justify-start',
          'flex flex-row items-center justify-center relative'
          // " dark:bg-dark-800/30 relative"
        )}
        
      >
        <div 
        
          className="absolute text-slate-700 dark:text-slate-400 left-0 flex hover:text-blue-500 px-2 flex-row items-center gap-1"
          onClick={handleBack}
        >
          <ArrowLeft className="w-4 h-4 " />
          <p className="text-sm">Back</p>
        </div>

        <div>
          <SecondaryText className="text-xs">
            {fixture.competition_name}, Week {fixture.round}
          </SecondaryText>
        </div>
      </div>

      <div
        className={twMerge(
          'flex p-4  dark:bg-[#0D0D0D]  dark:border-slate-700/40 flex-row h-max items-center justify-center w-full '
          // "dark:bg-gradient-to-r dark:from-gray-800/40 dark:via-[#0D0D0D] dark:to-gray-800/40",
          // "bg-gradient-to-r from-slate-100 via-white to-slate-100"
        )}
      >
        <FixtureScreenTeamLogoAndRecord
          team={team}
          fixture={fixture}
        />

        <div className="flex flex-col mx-4 flex-[3]">
          {gameKickedOff && <MatchResultsInformation fixture={fixture} />}
          {!gameKickedOff && <KickOffInformation fixture={fixture} />}
        </div>

        <FixtureScreenTeamLogoAndRecord
          team={opposition_team}
          fixture={fixture}
        />
      </div>
    </div>
  );
}

function KickOffInformation({ fixture }: Props) {
  const { kickoff_time } = fixture;

  return (
    <div className="flex flex-1 text-nowrap flex-col dark:text-white text-center items-center justify-center">
      {kickoff_time && <p className="font-bold">{format(kickoff_time, 'h:mm a')}</p>}
      {kickoff_time && (
        <p className="dark:text-slate-300 text-slate-500">{format(kickoff_time, 'dd MMM yyyy')}</p>
      )}
    </div>
  );
}

function MatchResultsInformation({ fixture }: Props) {
  const { game_status } = fixture;
  const { homeTeamWon, awayTeamWon } = fixtureSummary(fixture);

  return (
    <div className="flex justify-between flex-1 w-full flex-col items-center">
      <div className="flex flex-1 w-full flex-row gap-2 items-center justify-between">
        {/* Home Team Score */}

        <div
          className={twMerge(
            'dark:text-white/50 font-black text-gray-800/40 opacity-70 flex-1 text-3xl lg:text-4xl  flex items-center justify-start',
            homeTeamWon && 'text-black opacity-100 dark:text-white'
          )}
        >
          <p>{fixture?.team_score}</p>
          {homeTeamWon && <GoTriangleLeft />}
        </div>

        <div className="flex flex-1 flex-col dark:text-white text-center items-center justify-center">
          {game_status === 'completed' && <p className="text-sm font-medium">Final</p>}
          {isGameLive(game_status) && (
            <div className="flex flex-row items-center gap-1">
              <div className="w-2 h-2 bg-green-500 animate-pulse dark:bg-green-400 rounded-full" />
              <span className="text-sm text-green-600 dark:text-green-400 font-bold">
                {formatGameStatus(game_status)}
              </span>
            </div>
          )}
          {game_status && !isGameLive(game_status) && game_status !== 'completed' && (
            <p className="text-sm font-medium">{formatGameStatus(game_status)}</p>
          )}
          {!game_status && <p>-</p>}
        </div>

        {/* Away Team Score */}
        <div
          className={twMerge(
            'dark:text-white/50 font-black text-gray-800/40 flex-1 text-3xl lg:text-4xl  flex items-center justify-end',
            awayTeamWon && 'text-black dark:text-white opacity-100'
          )}
        >
          <p>{fixture?.opposition_score}</p>
          {awayTeamWon && <GoTriangleLeft />}
        </div>
      </div>
    </div>
  );
}

type TeamAndRecordProps = {
  team?: IProTeam,
  fixture: IFixture
}

function FixtureScreenTeamLogoAndRecord({ team, fixture }: TeamAndRecordProps) {

  return (
    <div className="flex flex-1 flex-col items-center gap-1 justify-end">
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

      <div className=' flex text-nowrap flex-col items-center justify-center ' >
        <p className="text-[10.5px] max-w-[100px] truncate text-nowrap md:text-xs text-center">{team?.athstat_name}</p>
      </div>

      <div className='min-h-[20px] flex flex-col items-center justify-start h-full' >
        {team?.athstat_id && fixture.league_id && (
          <TeamSeasonRecordText
            teamId={team?.athstat_id}
            seasonId={fixture.league_id}
          />
        )}
      </div>
    </div>
  )
}