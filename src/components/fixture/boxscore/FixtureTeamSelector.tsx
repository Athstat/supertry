import { twMerge } from "tailwind-merge"
import { IFixture } from "../../../types/games"
import { IProTeam } from "../../../types/team"
import SecondaryText from "../../ui/typography/SecondaryText"
import TeamLogo from "../../team/TeamLogo"

type Props = {
  fixture: IFixture,
  className?: string,
  value?: IProTeam,
  onChange?: (newTeam?: IProTeam) => void
}

export default function FixtureTeamSelector({ fixture, className, onChange, value }: Props) {

  const {team, opposition_team} = fixture;

  const onSelectTeam = (t?: IProTeam) => {
    if (t && onChange) {
      onChange(t);
    }
  }

  if (!team || !opposition_team) {
    return null;
  }

  return (
    <div className={twMerge(
      "bg-white flex border border-slate-300 dark:border-slate-700 flex-row items-center gap-2 dark:bg-slate-800/40 p-1 shadow-lg rounded-full overflow-clip",
      className
    )} >

      <SingleTeamButton
        team={team}
        onClick={() => onSelectTeam(fixture.team)}
        value={value}
        fixture={fixture}
      />

      <SingleTeamButton
        team={opposition_team}
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
  value?: IProTeam,
  onClick?: () => void
}

function SingleTeamButton({ value, team, onClick }: SingleTeamButtonProps) {
  
  const isCurrent = value?.athstat_id === team.athstat_id;

  return (
    <button
      type="button"
      onClick={onClick}
      className={twMerge(
        "flex flex-1 flex-row truncate justify-center cursor-pointer rounded-full h-[35px] border-b-2 border-transparent  items-center gap-2",
        "hover:bg-slate-100 hover:dark:bg-slate-800/50",
        isCurrent && 'bg-blue-500 dark:bg-blue-600 text-white hover:bg-blue-500 dark:hover:bg-blue-600',
  
      )}

      aria-pressed={isCurrent}

    >

      <TeamLogo
        url={team.image_url}
        teamName={team.athstat_name}
        className="w-5 h-5"
      />

      <SecondaryText className={twMerge(
        "font-medium max-w-[80px] truncate text-nowrap text-xs lg:text-base",
        value?.athstat_id === team.athstat_id && ' text-white dark:text-white'
      )} >
        {team.athstat_name}
      </SecondaryText>

    </button>
  )
}