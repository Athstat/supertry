import { useNavigate } from 'react-router-dom';
import BlueGradientCard2 from '../shared/BlueGradientCard2';
import { SELECTED_FANTASY_SEASON_QUERY_PARAM_KEY } from '../../state/fantasy/fantasyLeagueScreen.atoms';

export function HeroSection2() {
  const navigate = useNavigate();
  const onClick = () => {
    const key = SELECTED_FANTASY_SEASON_QUERY_PARAM_KEY;
    const seasonId = 'c4c29ce1-8669-5f51-addc-cbed01ce9bd0';
    navigate(`/leagues?${key}=${seasonId}`);
  };

  return (
    <BlueGradientCard2
      onClick={onClick}
      className="cursor-pointer from-purple-900 to-blue-800 dark:from-violet-700 dark:to-blue-800 hover:dark:from-primary-700 hover:dark:to-violet-700 overflow-clip transition-all ease-in duration-1000"
    >
      <div className="flex flex-col gap-4 p-3">
        <div className="flex flex-col gap-1">
          <div>
            <h1 className="text-lg lg:text-xl font-bold">
              WWC 2025 still ongoing! You dominating??? 🤩
            </h1>
          </div>

          <p className="text-sm opacity-90">
            Scrum up for the Women's World Rugby Cup—build your epic squad and battle your mates!
          </p>
        </div>
      </div>

      {/* {leagueOnTheClock && (
        <JoinDeadlineCountdown
        onViewLeague={onViewLeague}
        league={leagueOnTheClock}
        />
        )} */}
    </BlueGradientCard2>
  );
}
