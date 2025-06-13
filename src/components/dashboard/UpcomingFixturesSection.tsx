import { addDays, eachDayOfInterval, format } from 'date-fns';
import { gamesService } from '../../services/gamesService';
import { IFixture } from '../../types/games';
import useSWR from 'swr';
import { LoadingState } from '../ui/LoadingState';
import { ErrorState } from '../ui/ErrorState';
import { Calendar, MessageCircle } from 'lucide-react';
import { useRouter } from '../../hooks/useRoter';
import TeamLogo from '../team/TeamLogo';
import { leagueService } from '../../services/leagueService';
import { IFantasyLeague } from '../../types/fantasyLeague';
import { activeLeaguesFilter } from '../../utils/leaguesUtils';

export default function UpcomingFixturesSection() {
  const today = new Date();
  const nextDayWeek = addDays(today, 7);
  const dates = eachDayOfInterval({
    start: today,
    end: nextDayWeek,
  });

  const { data: fixtures, isLoading, error } = useSWR(dates, fetcher);
  const { push, navigateToLeagueScreen } = useRouter();
  const { data: leagues, isLoading: isLoadingLeagues } = useSWR(
    'all-leagues',
    leagueService.getAllLeagues
  );
  const activeLeague = activeLeaguesFilter(leagues || [])[0];

  if (isLoading || isLoadingLeagues) return <LoadingState />;

  if (!fixtures || error || !leagues) {
    return <ErrorState message="Failed to fetch upcoming matches" />;
  }

  // Sort fixtures by date and time
  const sortedFixtures = fixtures
    .sort((a, b) =>
      a.kickoff_time && b.kickoff_time
        ? new Date(a.kickoff_time).valueOf() - new Date(b.kickoff_time).valueOf()
        : 0
    )
    .filter(f => {
      return f.game_status !== 'completed';
    })
    .slice(0, 5);

  return (
    <div>
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-base font-medium flex items-center gap-2">
          <Calendar className="w-4 h-4 text-primary-700" />
          UPCOMING FIXTURES
        </h3>
        <button
          onClick={() => push('/fixtures#upcoming-matches')}
          className="text-sm text-primary-700"
        >
          View All
        </button>
      </div>

      <div className="flex space-x-4 overflow-x-auto pb-2">
        {sortedFixtures.map((fixture, index) => {
          const league = leagues.find(
            (l: IFantasyLeague) =>
              l.id === fixture.league_id || l.official_league_id === fixture.league_id
          );
          return (
            <div
              key={index}
              className="min-w-[280px] bg-gray-900 rounded-xl overflow-hidden text-white"
            >
              <div className="p-4">
                <div className="text-center mb-3 text-sm text-gray-300">
                  {fixture.competition_name && <p>{fixture.competition_name} Semi Finals</p>}
                  {fixture.venue && <p className="text-xs mt-1">{fixture.venue}</p>}
                </div>

                <div className="flex justify-between items-center mb-4">
                  {/* Home Team */}
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 bg-gray-800 rounded-full mb-2 flex items-center justify-center">
                      <TeamLogo url={fixture.team_image_url} className="w-10 h-10" />
                    </div>
                    <p className="text-sm font-medium">{fixture.team_name}</p>
                    <p className="text-xs text-gray-400">Home</p>
                  </div>

                  {/* Match Info */}
                  <div className="text-center">
                    {fixture.kickoff_time && (
                      <>
                        <p className="text-sm text-gray-300">
                          {format(new Date(fixture.kickoff_time), 'E, d MMM')}
                        </p>
                        <p className="text-xl font-bold my-1">
                          {format(new Date(fixture.kickoff_time), 'HH:mm')}
                        </p>
                        <p className="text-xs text-gray-400">vs</p>
                      </>
                    )}
                  </div>

                  {/* Away Team */}
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 bg-gray-800 rounded-full mb-2 flex items-center justify-center">
                      <TeamLogo
                        url={fixture.opposition_team_image_url ?? fixture.opposition_image_url}
                        className="w-10 h-10"
                      />
                    </div>
                    <p className="text-sm font-medium">{fixture.opposition_team_name}</p>
                    <p className="text-xs text-gray-400">Away</p>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <button
                    className="flex-1 bg-gradient-to-r from-white to-gray-200 via-gray-50 text-primary-800 py-2 rounded-md text-sm font-medium"
                    onClick={() => {
                      if (activeLeague) {
                        navigateToLeagueScreen(activeLeague, 'fixtures');
                      }
                    }}
                  >
                    Predict
                  </button>
                  <button
                    className="flex-1 bg-gray-800 text-white py-2 rounded-md text-sm font-medium flex items-center justify-center"
                    onClick={() => push(`/fixtures/${fixture.game_id}#chat`)}
                  >
                    <span>Chat</span>
                    <span className="ml-1 bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      24
                    </span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

async function fetcher(dates: Date[]) {
  let matches: IFixture[] = [];

  const fetchMatches = async (date: Date) => {
    const res = await gamesService.getGamesByDate(date);
    matches = [...matches, ...res];
  };

  const promises = dates.map(date => {
    return fetchMatches(date);
  });

  await Promise.all(promises);

  return matches;
}
