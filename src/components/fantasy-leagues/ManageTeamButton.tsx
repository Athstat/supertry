import { useNavigate } from "react-router-dom";
import { ISeasonRound } from "../../types/fantasy/fantasySeason";
import { IFantasyLeagueTeam } from "../../types/fantasyLeague";
import { isSeasonRoundTeamsLocked } from "../../utils/leaguesUtils";
import { TranslucentButton } from "../ui/buttons/PrimaryButton";

type CTAButtonProps = {
    leagueRound: ISeasonRound,
    userRoundTeam?: IFantasyLeagueTeam,
    nextRound?: ISeasonRound
}

export function ManageTeamButton({ leagueRound, userRoundTeam, nextRound }: CTAButtonProps) {

    const navigate = useNavigate();

    const isCurrentLocked = isSeasonRoundTeamsLocked(leagueRound);
    const isUserHasTeam = Boolean(userRoundTeam);

    const showManageTeam = !isCurrentLocked && isUserHasTeam;
    const showCreateTeam = !isCurrentLocked && !isUserHasTeam;
    const showSorryMessage = isCurrentLocked && !isUserHasTeam && nextRound;

    const handleManageTeam = () => {

        if (isCurrentLocked && nextRound?.round_number && !userRoundTeam) {
            navigate(`/my-team?round_number=${nextRound.round_number}`);
            return;
        }

        navigate(`/my-team`);
    }

    return (
        <div className='flex flex-col gap-3 px-4 items-center justify-center' >

            {!showSorryMessage && <TranslucentButton className='bg-gradient-to-tr capitalize w-fit border-white rounded-md px-2 py-3 from-[#051635] to-[#143B62]' onClick={handleManageTeam} >
                {showManageTeam && <p>MANAGE MY TEAM</p>}
                {showCreateTeam && <p>CREATE MY TEAM</p>}
                {isCurrentLocked && userRoundTeam && (
                    <p>VIEW TEAM</p>
                )}
            </TranslucentButton>}

            {showSorryMessage && (
                <TranslucentButton className='text-[13px] text-center lg:text-sm font-normal px-6' >
                    <p>Whoops! You missed the team deadline for <strong>{leagueRound.round_title}</strong>. In the mean time, you can pick your team for the next round.</p>
                </TranslucentButton>
            )}

            {showSorryMessage && nextRound && (
                <TranslucentButton className='bg-gradient-to-tr capitalize w-fit border-white rounded-md px-4 py-3 from-[#051635] to-[#143B62]' onClick={handleManageTeam} >
                    <p className="" >PICK TEAM FOR {nextRound.round_title.toUpperCase()}</p>
                </TranslucentButton>
            )}

        </div>
    )
}