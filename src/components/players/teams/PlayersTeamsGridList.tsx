import { LoadingIndicator } from "../../ui/LoadingIndicator";
import { ITeam } from "../../../types/games";
import { IProSeason } from "../../../types/season";
import { useSeasonTeams } from "../../../hooks/seasons/useSeasonTeams";
import SecondaryText from "../../ui/typography/SecondaryText";
import TeamLogo from "../../team/TeamLogo";
import { useNavigate } from "react-router-dom";
import { useFantasySeasons } from "../../../hooks/dashboard/useFantasySeasons";
import RoundedCard from "../../ui/cards/RoundedCard";
import NoContentCard from "../../ui/typography/NoContentMessage";

type Props = {
  onSuccess?: () => void
}

/** Renders a Grid list of teams to discover players by */
export default function PlayersTeamsGridList({ onSuccess }: Props) {

  const { selectedSeason: firstSeason, isLoading } = useFantasySeasons();


  if (isLoading) {
    return (
      <LoadingSkeleton />
    );
  }

  if (!firstSeason) {
    return;
  }


  return (
    <div className="flex flex-col gap-4 rounded-2xl" >
      <div>
        <p className='font-bold text-md' >By Team</p>
      </div>

      {firstSeason && <SeasonTeamGridList
        season={firstSeason}
        onSuccess={onSuccess}
      />}
    </div>
  )
}

type SeasonTeamListProps = {
  season: IProSeason,
  onSuccess?: () => void
}

function SeasonTeamGridList({ onSuccess }: SeasonTeamListProps) {

  const { selectedSeason } = useFantasySeasons();
  const navigate = useNavigate();
  const { teams: fetchedTeams, isLoading } = useSeasonTeams();
  const teams = fetchedTeams || [];

  const noTeams = teams.length === 0;

  const handleOnClick = (team: ITeam) => {
    navigate(`/players/teams/${team.athstat_id}`);

    if (onSuccess) {
      onSuccess();
    }
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

      {noTeams && (
        <NoContentCard
          message={`Oops! Something wen't wrong. Could not find any ${selectedSeason?.name} teams`}
        />
      )}

      <div className="grid grid-cols-3 gap-4" >
        {teams.map((t) => {
          return (
            <TeamItem
              team={t}
              onClick={handleOnClick}
              key={t.athstat_id}
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
    <RoundedCard onClick={handleOnClick} className="dark:border-none cursor-pointer p-2 h-[90px] flex flex-col items-center justify-center gap-2" >
      <TeamLogo
        url={team.image_url}
        className="w-9 h-9"
      />
      <SecondaryText className="text-[10px] text-center" >{team.athstat_name}</SecondaryText>
    </RoundedCard>
  )
}

function LoadingSkeleton() {
  return (
    <LoadingIndicator />
  )
}