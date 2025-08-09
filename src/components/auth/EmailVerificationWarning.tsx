import { useState } from "react";
import { DjangoAuthUser } from "../../types/auth";
import PrimaryButton from "../shared/buttons/PrimaryButton";
import WarningCard from "../shared/WarningCard";
import { authService } from "../../services/authService";
import { CheckCircle2 } from "lucide-react";

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

    const [error, setError] = useState<string>();
    const [isLoading, setLoading] = useState<boolean>(false);
    const [successMessage, setSuccessMessage] = useState<string>();

    const handleRequestVerification =  async () => {
        
        setLoading(true);

        try {
            
            const res = await authService.requestEmailVerification();

            if (res.data) {
                setSuccessMessage(res.data.message);
            } else {
                setError(res.error?.message);
            }

            
        } catch (err) {
            setError("Something wen't wrong trying to request for email verification. Please try again");
        }

        setLoading(true);
    }

    return (
        <WarningCard className="flex bg-yellow-50 text-yellow-700 dark:bg-yellow-900/20 dark:border-yellow-700/50 flex-col gap-2 items-start justify-start p-4" >
            
            <h2 className="font-bold" >Email Verfication</h2>

            {!successMessage && !error && <p>
                Your email is not verified yet verified. Please verify your email, to get full access to the scrummm!
            </p>}

            
            {successMessage && (
                <div className="flex-row w-full flex items-center gap-2" >
                    <CheckCircle2 />
                    <p>{successMessage}</p>
                </div>
            )}

            {error && <p>{error}</p>}

            {!successMessage && <PrimaryButton
                onClick={handleRequestVerification}
                isLoading={isLoading}
                disabled={isLoading}
            >
                Verify Email
            </PrimaryButton>}
        </WarningCard>
    )
}
