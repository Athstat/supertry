import { useNavigate } from "react-router-dom";
import { ISeasonRound } from "../../types/fantasy/fantasySeason";
import { IFantasyLeagueTeam } from "../../types/fantasyLeague";
import { isSeasonRoundLocked } from "../../utils/leaguesUtils";
import { TranslucentButton } from "../ui/buttons/PrimaryButton";

type CTAButtonProps = {
    leagueRound: ISeasonRound,
    userRoundTeam?: IFantasyLeagueTeam,
    nextRound?: ISeasonRound
}

export function ManageTeamButton({ leagueRound, userRoundTeam, nextRound }: CTAButtonProps) {

    const navigate = useNavigate();

    const isCurrentLocked = isSeasonRoundLocked(leagueRound);
    const isUserHasTeam = Boolean(userRoundTeam);

    const showManageTeam = !isCurrentLocked && isUserHasTeam;
    const showViewTeam = isCurrentLocked && isUserHasTeam;
    const showCreateTeam = !isCurrentLocked && !isUserHasTeam;
    const showSorryMessage = isCurrentLocked && !isUserHasTeam;

    const handleManageTeam = () => {

        if (isCurrentLocked && nextRound?.round_number) {
            navigate(`/my-team?round_number=${nextRound.round_number}`);
            return;
        }

        navigate(`/my-team`);
    }

    return (
        <div className='flex flex-col gap-2 px-4 items-center justify-center' >

            {!showSorryMessage && <TranslucentButton className='bg-gradient-to-tr w-fit border-white rounded-md px-2 py-3 from-[#051635] to-[#143B62]' onClick={handleManageTeam} >
                {showManageTeam && <p>Manage My Team</p>}
                {showViewTeam && <p>View My Team</p>}
                {showCreateTeam && <p>Create My Team</p>}
            </TranslucentButton>}

            {showSorryMessage && (
                <TranslucentButton className='text-xs lg:text-sm w0fit font-normal text-start px-6' >
                    <p>Whoops! You missed the team deadline for <strong>{leagueRound.round_title}</strong>. In the mean time, you can pick your team for the next round.</p>
                </TranslucentButton>
            )}

            {showSorryMessage && nextRound && (
                <TranslucentButton className='bg-gradient-to-tr w-fit border-white rounded-md px-2 py-3 from-[#051635] to-[#143B62]' onClick={handleManageTeam} >
                    <p>Pick Team for {nextRound.round_title}</p>
                </TranslucentButton>
            )}

        </div>
    )
}