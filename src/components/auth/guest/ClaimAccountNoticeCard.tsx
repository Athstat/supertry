import { useNavigate } from "react-router-dom";
import { isGuestUser } from "../../../utils/deviceId/deviceIdUtils";
import PrimaryButton from "../../ui/buttons/PrimaryButton";
import SecondaryText from "../../ui/typography/SecondaryText";
import { CircleUserRound } from "lucide-react";
import { authAnalytics } from "../../../services/analytics/authAnalytics";
import RoundedCard from "../../ui/cards/RoundedCard";
import { useAuth } from "../../../contexts/auth/AuthContext";

type Props = {
    reasonNum?: number
}

/** Renders card to alert the user to claim their account */
export default function ClaimAccountNoticeCard({reasonNum = 1} : Props) {

    const { authUser } = useAuth();
    const isGuest = isGuestUser(authUser);

    const navigate = useNavigate();

    if (!isGuest || !authUser) return;

    const handleGoToClaimAccount = () => {
        authAnalytics.trackClickedClaimAccountCTA();
        navigate(`/complete-profile`);
    }

    return (
        <RoundedCard className="p-4 flex flex-col gap-3" >
            
            <div className="flex flex-col gap-2" >
                <div className="flex flex-row items-center gap-1" >
                    <CircleUserRound />
                    <h1 className="font-bold text-lg" >Claim Your Account</h1>
                </div>
                <SecondaryText className="text-sm" >{claimAccountReasons[reasonNum] ?? claimAccountReasons[1]}</SecondaryText>
            </div>

            <PrimaryButton
                className="lg:w-fit"
                onClick={handleGoToClaimAccount}
            >
                Claim Account
            </PrimaryButton>

        </RoundedCard>
    )

}


const claimAccountReasons: Record<number, string> = {
    1: 'Unlock full access and secure your place in the Scrum! Save your progress, sync your data across devices and never miss a ruck!',
    2: "Leave your mark in the Scrum! Claim your account and make sure your mates recognise you on the standings. Your game, your name! Let everyone know who's topping the table."
}
