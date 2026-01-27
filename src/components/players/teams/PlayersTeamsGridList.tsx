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
import TextHeading from "../../ui/typography/TextHeading";

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
    <RoundedCard className="flex flex-col gap-4 p-4 px-6" >
      <div>
        <TextHeading className='font-[500] text-xl' blue >By Team</TextHeading>
      </div>

      {firstSeason && <SeasonTeamGridList
        season={firstSeason}
        onSuccess={onSuccess}
      />}
    </RoundedCard>
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
    <div className="flex flex-col gap-2 items-center justify-center" >

      {noTeams && (
        <NoContentCard
          message={`Oops! Something wen't wrong. Could not find any ${selectedSeason?.name} teams`}
        />
      )}

      <div className="grid grid-cols-3 gap-6  w-full px-[2%]" >
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
    <div onClick={handleOnClick} className="shadow-[0px_0px_5px_rgba(0,0,0,0.25)] bg-[#F8FAFC80] w-full rounded-md h-[100px] flex flex-col items-center gap-2 justify-center" >
      <TeamLogo
        url={team.image_url}
        className="w-9 h-9"
      />
      <SecondaryText className="text-[12px] font-[400] w-[90%] text-wrap text-center" >{team.athstat_name}</SecondaryText>
    </div>
  )
}

function LoadingSkeleton() {
  return (
    <LoadingIndicator />
  )
}