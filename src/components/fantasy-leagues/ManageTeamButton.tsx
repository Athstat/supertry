import { useNavigate } from "react-router-dom";
import { ISeasonRound } from "../../types/fantasy/fantasySeason";
import { IFantasyLeagueTeam } from "../../types/fantasyLeague";
import { isSeasonRoundLocked } from "../../utils/leaguesUtils";
import SecondaryButton from "../ui/buttons/SecondaryButton";

type ManageTeamButtonProps = {
  leagueRound: ISeasonRound,
  userRoundTeam?: IFantasyLeagueTeam,
  previousRound?: ISeasonRound
}

/** Renders a button to manager user team */
export function ManageTeamButton({ leagueRound, userRoundTeam }: ManageTeamButtonProps) {

  const navigate = useNavigate();

  const isCurrentLocked = isSeasonRoundLocked(leagueRound);
  const isUserHasTeam = Boolean(userRoundTeam);

  const showManageTeam = !isCurrentLocked && isUserHasTeam;
  const showViewTeam = isCurrentLocked && isUserHasTeam;
  const showCreateTeam = !isCurrentLocked && !isUserHasTeam;
  const showSorryMessage = isCurrentLocked && !isUserHasTeam;

  const handleManageTeam = () => {
    navigate(`/my-team`);
  }

  return (
    <div className='flex flex-col gap-2' >

      {showManageTeam && <SecondaryButton
        onClick={handleManageTeam}
      >
        Manage My Team
      </SecondaryButton>}

      {showViewTeam && <SecondaryButton
        onClick={handleManageTeam}
      >
        View My Team
      </SecondaryButton>}

      {showCreateTeam && (
        <SecondaryButton onClick={handleManageTeam} >
          Create My Team
        </SecondaryButton>
      )}

      {showSorryMessage && (
        <SecondaryButton className='text-xs lg:text-sm font-normal text-start' >
          <p>Whoops! You missed the team deadline for <strong>{leagueRound.round_title}</strong>. You will have to wait for the next round to create your team</p>
        </SecondaryButton>
      )}

    </div>
  )
}