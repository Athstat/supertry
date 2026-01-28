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

  const trimmedTeamName = team?.athstat_name
    .replace("Rugby", "")
    .replace("Glasgow", "");


  return (
    <div className={twMerge(
        "flex-1 flex text-slate-700 dark:text-white flex-col items-end justify-center",
        !isAway && "items-start"
    )}>

      <div className={twMerge(
        "flex flex-row gap-3 pr-2 items-center w-fit justify-start",
        isAway && "pr-0 pl-2"
      )}>

        {isAway && showGameScore ? (
          <div
            className={twMerge(
              'flex items-center justify-start px-2 py-1 rounded-full text-slate-700 dark:text-slate-200 text-md',
              awayTeamWon && 'font-bold'
            )}
          >
            {score}
          </div>
        ) : null}

        <div className="flex flex-col gap-4 items-center  justify-start">
          {showLogos && (
            <TeamLogo
              url={team?.image_url}
              teamName={team?.athstat_name}
              className="w-11 h-11"
            />
          )}

          <p className={twMerge('text-[10px] md:text-sm w-fit text-center', awayTeamWon && '')}>
            {trimmedTeamName}
          </p>
        </div>

        {!isAway && showGameScore ? (
          <div
            className={twMerge(
              'flex items-center text-sm justify-start px-2 py-1 rounded-full text-slate-700 dark:text-slate-200 text-md',
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