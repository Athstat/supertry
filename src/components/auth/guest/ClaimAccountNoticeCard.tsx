import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext"
import { isGuestUser } from "../../../utils/deviceIdUtils";
import PrimaryButton from "../../shared/buttons/PrimaryButton";
import RoundedCard from "../../shared/RoundedCard";
import SecondaryText from "../../shared/SecondaryText";
import { CircleUserRound } from "lucide-react";

/** Renders card to alert the user to claim their account */
export default function ClaimAccountNoticeCard() {

    const { authUser } = useAuth();
    const isGuest = isGuestUser(authUser);

    const navigate = useNavigate();

    if (!isGuest || !authUser) return;

    const handleGoToClaimAccount = () => {
        navigate(`/complete-profile`);
    }

    return (
        <RoundedCard className="p-4 flex flex-col gap-3" >
            
            <div className="flex flex-col gap-2" >
                <div className="flex flex-row items-center gap-1" >
                    <CircleUserRound />
                    <h1 className="font-bold text-lg" >Claim Your Account</h1>
                </div>
                <SecondaryText className="text-sm" >Unlock full access and secure your place in the Scrum! Save your progress, sync your data across devices and never miss a ruck!</SecondaryText>
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
