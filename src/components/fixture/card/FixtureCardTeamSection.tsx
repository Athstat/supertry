import { twMerge } from "tailwind-merge";
import { IFixture } from "../../../types/games";
import { IProTeam } from "../../../types/team";
import { fixtureSummary } from "../../../utils/fixtureUtils";
import TeamLogo from "../../team/TeamLogo";

type TeamLogoAndScoreProps = {
  team?: IProTeam,
  score?: number,
  fixture: IFixture,
  showLogos?: boolean
}

export function FixtureCardTeamSection({ team, score, fixture, showLogos }: TeamLogoAndScoreProps) {


  const {
    team_score,
    game_status,
    opposition_score,
  } = fixture;

  const matchFinal = game_status === 'completed' && team_score && opposition_score;

  const homeTeamWon = matchFinal ? team_score > opposition_score : false;
  const awayTeamWon = matchFinal ? team_score < opposition_score : false;

  const { gameKickedOff } = fixtureSummary(fixture);
  const showGameScore = gameKickedOff && fixture.team_score !== null && fixture.opposition_score !== null;

  const isAway = team?.athstat_id === fixture.opposition_team?.athstat_id;


  return (
    <div className="flex-1 flex text-slate-700 dark:text-white flex-col items-end justify-center">

      <div className="flex flex-row gap-2 items-center w-full justify-start">

        {isAway && showGameScore ? (
          <div
            className={twMerge(
              'flex items-center justify-start px-2 py-1 rounded-full text-slate-700 dark:text-slate-200 text-md',
              homeTeamWon && 'font-bold'
            )}
          >
            {score}
          </div>
        ) : null}

        <div className="flex flex-col gap-4 items-center w-full justify-start">
          {showLogos && (
            <TeamLogo
              url={team?.image_url}
              teamName={team?.athstat_name}
              className="w-10 h-10"
            />
          )}

          <p className={twMerge('text-xs md:text-sm w-fit text-center', awayTeamWon && '')}>
            {team?.athstat_name}
          </p>
        </div>

        {!isAway && showGameScore ? (
          <div
            className={twMerge(
              'flex items-center justify-start px-2 py-1 rounded-full text-slate-700 dark:text-slate-200 text-md',
              homeTeamWon && 'font-bold'
            )}
          >
            {score}
          </div>
        ) : null}
      </div>

    </div>
  )
}