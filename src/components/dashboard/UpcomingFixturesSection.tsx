import { format } from 'date-fns';
import { gamesService } from '../../services/gamesService';
import { IFixture } from '../../types/games';
import useSWR, { mutate } from 'swr';
import { LoadingState } from '../ui/LoadingState';
import { ErrorState } from '../ui/ErrorState';
import { Calendar } from 'lucide-react';
import { useRouter } from '../../hooks/useRoter';
import TeamLogo from '../team/TeamLogo';
import { useState } from 'react';
import DialogModal from '../shared/DialogModal';
import { useGameVotes } from '../../hooks/useGameVotes';
import { VotingOptionBar } from '../shared/bars/VotingOptionBar';
import { fixtureSumary } from '../../utils/fixtureUtils';
import { useNavigate } from 'react-router-dom';
import SecondaryText from '../shared/SecondaryText';
import { useSupportedSeasons } from '../../hooks/useSupportedSeasons';
import { PilledSeasonFilterBar } from '../match_center/MatcheSeasonFilterBar';

export default function UpcomingFixturesSection() {
  let {
    data: fixtures,
    isLoading,
    error,
  } = useSWR('pro-fixtures', () => gamesService.getAllSupportedGames());
  const { push } = useRouter();

  const seasonIds = [
    'b5cae2ff-d123-5f12-a771-5faa6d40e967',
    'd313fbf5-c721-569b-975d-d9ec242a6f19',
  ];

  const { seasons, currSeason, setCurrSeason } = useSupportedSeasons({ wantedSeasonsId: seasonIds });

  const [selectedFixture, setSelectedFixture] = useState<IFixture | null>(null);
  const [showPredictModal, setShowPredictModal] = useState(false);

  if (isLoading) return <LoadingState />;

  if (error) {
    return <ErrorState message="Failed to fetch upcoming matches" />;
  }

  fixtures = (fixtures ?? []).filter(f => {
    return currSeason ? f.league_id === currSeason?.id : true;
  }).sort((a, b) =>
    a.kickoff_time && b.kickoff_time
      ? new Date(a.kickoff_time).valueOf() - new Date(b.kickoff_time).valueOf()
      : 0
  );

  // Sort fixtures by date and time
  const sortedFixtures = Array.isArray(fixtures)
    ? fixtures
      .filter(f => {
        const notCompleted = f.game_status !== 'completed';

        return notCompleted;
      })
      .slice(0, 5)
    : [];

  const last10 = [...fixtures].slice(
    fixtures.length - 11, fixtures.length
  ).sort((a, b) =>
    a.kickoff_time && b.kickoff_time
      ? new Date(b.kickoff_time).valueOf() - new Date(a.kickoff_time).valueOf()
      : 0
  );

  const handleClickPredict = (fixture: IFixture) => {
    setSelectedFixture(fixture);
    setShowPredictModal(true);
  }

  if (last10.length === 0 && sortedFixtures.length == 0) {
    return;
  }

  console.log("Seasons from fixtures", seasons);

  return (
    <div className='flex flex-col gap-2' >
      
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-base font-medium flex items-center gap-2 text-gray-900 dark:text-gray-100">
          <Calendar className="w-4 h-4 text-primary-700 dark:text-primary-400" />
          Fixtures
        </h3>
        <button
          onClick={() => push('/fixtures#upcoming-matches')}
          className="text-sm text-primary-700 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-300"
        >
          View All
        </button>
      </div>

      <PilledSeasonFilterBar
        seasons={seasons}
        onChange={(sId?: string) => {
          const szn = seasons.find((f) => f.id === sId);
          setCurrSeason(szn)
        }}
        value={currSeason?.id}
        sortDesc
        hideAllOption
      />

      {sortedFixtures.length === 0 ? (

        <div className="flex space-x-4 overflow-x-auto pb-2">
          {last10.map((fixture) => {
            return (
              <UpcomingFixtureCard
                fixture={fixture}
                onClickPredict={handleClickPredict}
                key={fixture.game_id}
              />
            );
          })}
        </div>
      ) : (
        <div className="flex space-x-4 overflow-x-auto pb-2">
          {sortedFixtures.map((fixture) => {
            return (
              <UpcomingFixtureCard
                fixture={fixture}
                onClickPredict={handleClickPredict}
                key={fixture.game_id}
              />
            );
          })}
        </div>
      )}

      {/* Prediction Modal */}
      {selectedFixture && (
        <PredictionModal
          fixture={selectedFixture}
          showModal={showPredictModal}
          onClose={() => {
            setShowPredictModal(false);
            setSelectedFixture(null);
          }}
        />
      )}
    </div>
  );
}

type Props = {
  fixture: IFixture,
  onClickPredict?: (fixture: IFixture) => void
}

function UpcomingFixtureCard({ fixture, onClickPredict }: Props) {

  const { push } = useRouter();

  const handleClickChat = () => {
    push(`/fixtures/${fixture.game_id}#chat`)
  }

  const handleClickPredict = () => {
    if (onClickPredict) {
      onClickPredict(fixture);
    }
  }

  const { game_status } = fixtureSumary(fixture);
  const gameCompleted = game_status === "completed";

  return (
    <div
      className="min-w-[320px] cursor-pointer  bg-white hover:bg-slate-200 border border-slate-300 dark:border-slate-700 dark:bg-gray-800/40 hover:dark:bg-gray-800/70 rounded-xl overflow-hidden text-white"
      onClick={() => {
        if (gameCompleted && onClickPredict) {
          onClickPredict(fixture)
        }
      }}
    >
      <div className="p-4">
        <div className="text-center mb-3 text-sm text-slate-700 dark:text-gray-300">
          {fixture.competition_name && (
            <p className="text-[10px]">
              {fixture.competition_name}, {fixture.venue}
            </p>
          )}
        </div>

        <div className="flex justify-between items-center mb-4">
          {/* Home Team */}
          <div className="flex flex-col items-center min-w-0 w-28">
            <div className="w-12 h-12 rounded-full mb-2 flex items-center justify-center">
              <TeamLogo
                url={fixture.team.image_url}
                teamName={fixture.team.athstat_name}
                className="w-10 h-10"
              />
            </div>
            <p
              className="text-sm font-medium truncate w-full text-center whitespace-nowrap overflow-hidden text-gray-900 dark:text-white"
              title={fixture.team.athstat_name}
            >
              {fixture.team.athstat_name}
            </p>
            {!gameCompleted && <p className="text-xs text-gray-600 dark:text-gray-400">Home</p>}
            <SecondaryText className='' >{fixture.team_score}</SecondaryText>
          </div>

          {/* Match Info (centered) */}
          <div className="flex flex-col items-center flex-shrink-0 mx-4 min-w-[90px]">
            {fixture.kickoff_time && (
              <>
                <p className="text-xs text-gray-700 dark:text-gray-300 text-center">
                  {format(new Date(fixture.kickoff_time), 'E, d MMM')}
                </p>
                {!gameCompleted && <p className="text-lg font-bold my-1 text-center text-gray-900 dark:text-white">
                  {format(new Date(fixture.kickoff_time), 'HH:mm')}
                </p>}
                {!gameCompleted && <p className="text-xs text-gray-600 dark:text-gray-400 text-center">vs</p>}
                {gameCompleted && <SecondaryText>Final</SecondaryText>}
              </>
            )}
          </div>

          {/* Away Team */}
          <div className="flex flex-col items-center min-w-0 w-28">
            <div className="w-12 h-12  rounded-full mb-2 flex items-center justify-center">
              <TeamLogo
                url={fixture.opposition_team.image_url}
                teamName={fixture.opposition_team.athstat_name}
                className="w-10 h-10"
              />
            </div>
            <p
              className="text-sm font-medium truncate w-full text-center whitespace-nowrap overflow-hidden text-gray-900 dark:text-white"
              title={fixture.opposition_team.athstat_name}
            >
              {fixture.opposition_team.athstat_name}
            </p>
            {!gameCompleted && <p className="text-xs text-gray-600 dark:text-gray-400">Away</p>}
            <SecondaryText className='' >{fixture.opposition_score}</SecondaryText>
          </div>
        </div>

        <div className="flex space-x-2">
          {!gameCompleted && <button
            className="flex-1 bg-primary-600 border border-primary-600 hover:bg-primary-700 dark:bg-primary-600 dark:hover:bg-primary-600 text-white py-2 rounded-md text-sm font-medium transition-colors"
            onClick={handleClickPredict}
          >
            Predict
          </button>}
          <button
            className="flex-1 bg-gray-100 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 border border-slate-300 dark:border-slate-700 text-gray-900 dark:text-white py-2 rounded-md text-sm font-medium flex items-center justify-center gap-2 transition-colors"
            onClick={handleClickChat}
          >
            <span>Chat</span>
            {/* <span className="w-2 h-2 bg-blue-500 rounded-full"></span> */}
          </button>
        </div>

        { }
      </div>
    </div>
  )
}

// Prediction Modal Component
function PredictionModal({
  fixture,
  showModal,
  onClose,
}: {
  fixture: IFixture;
  showModal: boolean;
  onClose: () => void;
}) {
  const navigate = useNavigate();
  const { gameKickedOff } = fixtureSumary(fixture);
  const { homeVotes, awayVotes, userVote } = useGameVotes(fixture);
  const [isVoting, setIsVoting] = useState(false);

  // Calculate voting percentages
  const totalVotes = homeVotes.length + awayVotes.length;
  const homePerc = totalVotes === 0 ? 0 : Math.round((homeVotes.length / totalVotes) * 100);
  const awayPerc = totalVotes === 0 ? 0 : Math.round((awayVotes.length / totalVotes) * 100);

  const votedHomeTeam = userVote?.vote_for === 'home_team';
  const votedAwayTeam = userVote?.vote_for === 'away_team';
  const hasUserVoted = votedHomeTeam || votedAwayTeam;

  const handleVote = async (voteFor: 'home_team' | 'away_team') => {
    if (gameKickedOff) return;

    setIsVoting(true);

    try {
      if (!userVote) {
        await gamesService.postGameVote(fixture.game_id, voteFor);
      } else {
        await gamesService.putGameVote(fixture.game_id, voteFor);
      }

      // Refresh the votes data
      await mutate(`game-votes-${fixture.game_id}`);
    } catch (error) {
      console.error('Error voting:', error);
    } finally {
      setIsVoting(false);
    }
  };

  const title = `${fixture.team.athstat_name} vs ${fixture.opposition_team.athstat_name}`;

  const goToFixturePage = () => {
    navigate(`/fixtures/${fixture.game_id}`);
  };

  return (
    <DialogModal
      onClose={onClose}
      open={showModal}
      title={title}
      className="text-black dark:text-white flex flex-col gap-3"
      hw="lg:w-[50%]"
    >
      <div className="flex p-2 text-slate-600 dark:text-slate-400 border border-slate-300 dark:border-slate-700 text-xs text-wrap text-center rounded-xl bg-slate-100 dark:bg-slate-800 flex-row items-center justify-center">
        <p>
          {fixture.competition_name} 𐄁 {fixture.venue}
        </p>
      </div>

      <div className="flex flex-row items-center justify-center dark:text-white">
        <div className="flex flex-1 gap-5 flex-col items-center justify-center">
          <TeamLogo
            className="w-20 h-20" url={fixture.team.image_url}
            teamName={fixture.team.athstat_name}
          />
          <p className="text-xs md:text-sm lg:text-base dark:text-white text-wrap text-center">
            {fixture.team.athstat_name}
          </p>
        </div>

        <div className="flex flex-1 flex-col items-center justify-center">
          {fixture.kickoff_time && (
            <>
              <p className="font-medium text-sm">
                {format(new Date(fixture.kickoff_time), 'h:mm a')}
              </p>
              <p className="dark:text-slate-300 text-sm text-slate-800">
                {format(new Date(fixture.kickoff_time), 'dd MMM yyyy')}
              </p>
            </>
          )}
        </div>

        <div className="flex flex-1 gap-5 flex-col items-center justify-center">
          <TeamLogo
            className="w-20 h-20"
            url={fixture.opposition_team.image_url ?? fixture.opposition_team.image_url}
            teamName={fixture.opposition_team.athstat_name}
          />
          <p className="text-xs md:text-sm lg:text-base dark:text-white text-wrap text-center">
            {fixture.opposition_team.athstat_name}
          </p>
        </div>
      </div>

      {/* Voting Section */}
      <div className="flex mt-4 flex-col w-full gap-2 items-center justify-center">
        {/* Voting UI - Before kickoff and before voting */}
        {!hasUserVoted && !gameKickedOff && (
          <div className="flex flex-col w-full gap-2 items-center text-sm justify-center text-slate-700 dark:text-slate-400">
            <p className="text-xs">Who you got winning?</p>
            <div className="flex flex-row gap-2 w-full">
              <button
                onClick={() => handleVote('home_team')}
                className="border dark:border-slate-700 flex-1 px-2 rounded-lg bg-slate-200 py-1.5 text-xs hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700"
                disabled={isVoting}
              >
                {fixture.team.athstat_name}
              </button>
              <button
                onClick={() => handleVote('away_team')}
                className="border dark:border-slate-700 flex-1 px-2 rounded-lg bg-slate-200 py-1.5 text-xs hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700"
                disabled={isVoting}
              >
                {fixture.opposition_team.athstat_name}
              </button>
            </div>
          </div>
        )}

        {/* Show voting bars after user has voted or after kickoff */}
        {(hasUserVoted || gameKickedOff) && (
          <>
            <VotingOptionBar
              hasUserVoted={votedHomeTeam}
              voteCount={homeVotes.length}
              votePercentage={homePerc}
              title={`${fixture.team.athstat_name}`}
              onClick={() => handleVote('home_team')}
              isGreen={false}
              isRed={false}
              disable={isVoting || gameKickedOff}
            />
            <VotingOptionBar
              hasUserVoted={votedAwayTeam}
              voteCount={awayVotes.length}
              votePercentage={awayPerc}
              title={`${fixture.opposition_team.athstat_name}`}
              onClick={() => handleVote('away_team')}
              isGreen={false}
              isRed={false}
              disable={isVoting || gameKickedOff}
            />
          </>
        )}

        <div className="flex flex-row items-center justify-center p-3">
          <button
            onClick={goToFixturePage}
            className="underline text-sm text-blue-400 dark:text-blue-200 hover:text-blue-500"
          >
            View Full Match Details
          </button>
        </div>
      </div>
    </DialogModal>
  );
}
