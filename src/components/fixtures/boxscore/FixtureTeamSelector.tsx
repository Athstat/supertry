import { twMerge } from "tailwind-merge"
import { IFixture } from "../../../types/games"
import { IProTeam } from "../../../types/team"
import SecondaryText from "../../shared/SecondaryText"
import TeamLogo from "../../team/TeamLogo"
import { useBoxscoreFilter } from "../../../hooks/fixtures/useBoxscoreFilter"

type Props = {
  fixture: IFixture
}

export default function FixtureTeamSelector({ fixture }: Props) {

  const { selectedTeam: value, setSelectedTeamId } = useBoxscoreFilter(fixture);

  const onSelectTeam = (t: IProTeam) => {
    console.log("Selecting team ", t.athstat_name);
    setSelectedTeamId(t.athstat_id);
  }

  return (
    <div className="bg-white flex border border-slate-700 flex-row items-center gap-2 dark:bg-slate-800/40 shadow-lg rounded-xl overflow-clip" >

      <SingleTeamButton
        team={fixture.team}
        onClick={() => onSelectTeam(fixture.team)}
        value={value}
        fixture={fixture}
      />

      <SingleTeamButton
        team={fixture.opposition_team}
        onClick={() => onSelectTeam(fixture.opposition_team)}
        value={value}
        fixture={fixture}
      />

    </div>
  )
}

type SingleTeamButtonProps = {
  fixture: IFixture,
  team: IProTeam,
  value: IProTeam,
  onClick?: () => void
}

function SingleTeamButton({ value, team, onClick }: SingleTeamButtonProps) {
  return (
    <div

      onClick={onClick}
      className={twMerge(
        "flex flex-1 flex-row justify-center cursor-pointer px-4 py-2.5 border-b-2 border-transparent  items-center gap-2",
        value.athstat_id === team.athstat_id && 'border-blue-500 text-blue-500'
      )}

    >

      <TeamLogo
        url={team.image_url}
        teamName={team.athstat_name}
        className="w-8 h-8"
      />

      <SecondaryText className={twMerge(
        "font-medium text-base",
        value.athstat_id === team.athstat_id && 'border-blue-500 text-blue-500'
      )} >
        {team.athstat_name}
      </SecondaryText>
    </div>
  )
}