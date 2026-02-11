import { useMemo, useCallback } from "react";
import { Link } from "react-router-dom";
import useSWR from "swr";
import { twMerge } from "tailwind-merge";
import { gamesService } from "../../../../services/gamesService";
import { IFixture } from "../../../../types/games";
import { IProTeam } from "../../../../types/team";
import { fixtureSummary, isGameLive, formatGameStatus } from "../../../../utils/fixtureUtils";
import { swrFetchKeys } from "../../../../utils/swrKeys";
import TeamLogo from "../../../team/TeamLogo";
import RoundedCard from "../../../ui/cards/RoundedCard";
import SecondaryText from "../../../ui/typography/SecondaryText";
import { format } from "date-fns";


type Props = {
  fixture: IFixture
}

/** Renders a team head to head */
export default function PastMatchupsCard({ fixture }: Props) {

  const key = swrFetchKeys.getPastMatchups(fixture.game_id);
  const { data, isLoading } = useSWR(key, () => gamesService.getFixturePastMatchUps(fixture.game_id), {
    revalidateOnFocus: false,
  });

  const { team, opposition_team } = fixture;

  const matchups = useMemo(() => (data ?? []), [data]);

  const getWinTotal = useCallback((inTeam: IProTeam) => {
    
    return matchups.reduce((sum, curr) => {
      const { homeTeamWon, awayTeamWon } = fixtureSummary(curr);

      const wonAsHome = homeTeamWon && curr.team?.athstat_id === inTeam.athstat_id;
      const wonAsAway = awayTeamWon && curr.opposition_team?.athstat_id === inTeam.athstat_id;

      const wonMatch = wonAsAway || wonAsHome;

      return sum + (wonMatch ? 1 : 0);
    }, 0);

  }, [matchups]);

  if (!team || !opposition_team) {
    return;
  }

  if (isLoading) {
    return (
      <RoundedCard className="p-4 h-[130px] animate-pulse border-none" ></RoundedCard>
    )
  }

  return (
    <RoundedCard className={twMerge(
      "p-3 px-4 flex dark:border-none flex-col gap-4",
      
  )} >

      <div className="flex flex-row items-center justify-between w-full" >

        <div className="flex flex-row items-center gap-4 justify-center" >
          <TeamLogo
            url={team?.image_url}
            className="w-8 h-8"
          />
          <p className="font-bold" >{getWinTotal(team)}</p>
        </div>

        <div className="flex flex-row items-center justify-center" >
          <p className="text-sm font-semibold" >Previous Matchups</p>
        </div>

        <div className="flex flex-row gap-4 items-center justify-center" >
          <p className="font-bold" >{getWinTotal(opposition_team)}</p>

          <TeamLogo
            url={opposition_team?.image_url}
            className="w-8 h-8"
          />
        </div>

      </div>

      <div className="flex flex-col gap-2" >
        {matchups.map((m) => {
          return (
            <MatchupItem
              key={m.game_id}
              fixture={m}
            />
          )
        })}
      </div>

      {matchups.length === 0 && (
        <div className="flex pb-4 flex-col items-center justify-center text-center" >
          <SecondaryText>No Previous Matchups Found</SecondaryText>
        </div>
      )}
      
    </RoundedCard>
  )
}

type MatchupItemProps = {
  fixture: IFixture,
  className?: string
}

function MatchupItem({ fixture, className }: MatchupItemProps) {

  const { matchFinal, gameKickedOff, homeTeamWon, awayTeamWon } = fixtureSummary(fixture);

  return (
    <Link to={`/fixtures/${fixture.game_id}`}>
      <div
        className={twMerge(
          'cursor-pointer rounded-xl flex flex-col',
          'hover:bg-slate-100 hover:dark:bg-slate-800 p-2',
          className
        )}
      >

        <div>
          <SecondaryText className="text-xs lg:text-sm">
            {fixture.competition_name} - Week #{fixture.round}
          </SecondaryText>
        </div>

        <div className="flex flex-row items-center gap-2  dark:divide-slate-700">

          <div className="flex flex-col gap-0.5 w-4/5">

            <div className="flex flex-row items-center justify-between">

              <div className="flex flex-row items-center gap-2">
                <TeamLogo
                  url={fixture.team?.image_url}
                  teamName={fixture.team?.athstat_name}
                  className="w-5 h-5"
                />

                <p className={twMerge(
                  "text-xs lg:text-sm",
                  awayTeamWon && "dark:text-slate-400 text-slate-700"
                )}>{fixture.team?.athstat_name}</p>
              </div>

              <div>{gameKickedOff ? <p className={twMerge(
                "text-sm",
                awayTeamWon && "text-slate-700 dark:text-slate-400",
                homeTeamWon && "font-bold"
              )}>{fixture.team_score}</p> : ''}</div>

            </div>

            <div className="flex flex-row items-center justify-between">
              <div className="flex flex-row items-center gap-2">
                <TeamLogo
                  url={fixture.opposition_team?.image_url}
                  teamName={fixture?.opposition_team?.athstat_name}
                  className="w-5 h-5"
                />
                <p className={twMerge(
                  "text-xs lg:text-sm",
                  homeTeamWon && "dark:text-slate-400 text-slate-700"
                )}>{fixture?.opposition_team?.athstat_name}</p>
              </div>

              <div>
                {gameKickedOff ? <p className={twMerge(
                  "text-sm",
                  homeTeamWon && "text-slate-700 dark:text-slate-400",
                  awayTeamWon && "font-bold"
                )}>{fixture.opposition_score}</p> : ''}
              </div>
            </div>
          </div>

          <div className="flex text-[10px] lg:text-xs text-center flex-col w-1/5 p-2 items-center justify-center  gap-1">

            {!matchFinal && fixture.kickoff_time && (
              <SecondaryText className="text-[10px] lg:text-xs">
                {format(fixture.kickoff_time, 'HH:mm')}
              </SecondaryText>
            )}

            {matchFinal && <SecondaryText className="text-[10px] lg:text-xs">FT</SecondaryText>}

            {isGameLive(fixture.game_status) && (
              <div className="flex flex-row items-center gap-1">
                <div className="w-1.5 h-1.5 bg-green-500 animate-pulse dark:bg-green-400 rounded-full" />
                <span className="text-[9px] lg:text-[10px] text-green-600 dark:text-green-400 font-bold">
                  {formatGameStatus(fixture.game_status)}
                </span>
              </div>
            )}

            {fixture.kickoff_time && (
              <SecondaryText className="text-[10px] lg:text-xs">
                {format(fixture.kickoff_time, 'dd/MM/yyyy')}
              </SecondaryText>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}