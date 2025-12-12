import { LoadingState } from "../../ui/LoadingState";
import { useMemo } from "react";
import { ITeam } from "../../../types/games";
import { useActiveFantasySeasons } from "../../../hooks/fantasy/useActiveFantasySeasons";
import { IProSeason } from "../../../types/season";
import { useSeasonTeams } from "../../../hooks/seasons/useSeasonTeams";
import RoundedCard from "../../shared/RoundedCard";
import SecondaryText from "../../shared/SecondaryText";
import TeamLogo from "../../team/TeamLogo";
import { useNavigate } from "react-router-dom";


/** Renders a Grid list of teams to discover players by */
export default function PlayersTeamsGridList() {

  const { seasons: fantasySeasons, isLoading } = useActiveFantasySeasons();


  const firstSeason = useMemo(() => {
    const seasons = fantasySeasons || [];

    if (seasons.length > 0) {
      return seasons[0];
    }

    return undefined;
  }, [fantasySeasons]);

  if (isLoading) {
    return (
      <LoadingSkeleton />
    );
  }

  if (!firstSeason) {
    return;
  }


  return (
    <div>
      {firstSeason && <SeasonTeamGridList
        season={firstSeason}
      />}
    </div>
  )
}

type SeasonTeamListProps = {
  season: IProSeason
}

function SeasonTeamGridList({ season }: SeasonTeamListProps) {

  const navigate = useNavigate();
  const { teams: fetchedTeams, isLoading } = useSeasonTeams(season.id);
  const teams = fetchedTeams || [];

  const handleOnClick = (team: ITeam) => {
    navigate(`/players/teams/${team.athstat_id}`);
  }

  if (isLoading) {
    return (
      <LoadingSkeleton />
    )
  }

  return (
    <div className="flex flex-col gap-2" >

      {/* <div>
        <p className="font-semibold" >{season.name}</p>
      </div> */}

      <div className="grid grid-cols-3 gap-2" >
        {teams.map((t) => {
          return (
            <TeamItem
              team={t}
              onClick={handleOnClick}
            />
          )
        })}
      </div>
    </div>
  )
}

type TeamItemProps = {
  team: ITeam,
  onClick?: (team: ITeam) => void
}

function TeamItem({ team, onClick }: TeamItemProps) {

  const handleOnClick = () => {
    if (onClick) {
      onClick(team);
    }
  }


  return (
    <RoundedCard onClick={handleOnClick} className="border-none cursor-pointer p-2 h-[90px] flex flex-col items-center justify-center gap-2" >
      <TeamLogo
        url={team.image_url}
        className="w-8 h-8"
      />
      <SecondaryText className="text-[10px] text-center" >{team.athstat_name}</SecondaryText>
    </RoundedCard>
  )
}

function LoadingSkeleton() {
  return (
    <LoadingState />
  )
}