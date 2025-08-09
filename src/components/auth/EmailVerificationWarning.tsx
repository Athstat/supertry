import { DjangoAuthUser } from "../../types/auth";
import PrimaryButton from "../shared/buttons/PrimaryButton";
import WarningCard from "../shared/WarningCard";

type Props = {
    authUser: DjangoAuthUser
}

export default function EmailVerificationWarning({ authUser }: Props) {

    const showWarning = 
        authUser && 
        authUser.verification_state === "pending" &&
        authUser.is_claimed_account === true
    ;

    if (!showWarning) {
        return;
    }

    return (
        <WarningCard className="flex bg-yellow-50 dark:bg-yellow-900/20 dark:border-yellow-700/50 flex-col gap-2 items-start justify-start p-4" >
            
            <h2 className="font-bold" >Email Verfication</h2>

            <p>
                Your email is not verified yet verified. Please verify your email, to get full access to the scrummm!
            </p>

            <PrimaryButton>Verify Email</PrimaryButton>
        </WarningCard>
    )
}
