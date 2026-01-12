import { CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { twMerge } from "tailwind-merge";
import { authService } from "../../../services/authService";
import { DjangoAuthUser } from "../../../types/auth";
import PrimaryButton from "../../ui/buttons/PrimaryButton";
import WarningCard from "../../ui/cards/WarningCard";
import { logger } from "../../../services/logger";

type Props = {
    authUser: DjangoAuthUser
}

export default function EmailVerificationWarning({ authUser }: Props) {

    const showWarning =
        authUser &&
        authUser.verification_state === "pending" &&
        authUser.is_claimed_account === true
        ;

    const [error, setError] = useState<string>();
    const [isLoading, setLoading] = useState<boolean>(false);
    const [successMessage, setSuccessMessage] = useState<string>();

    const handleRequestVerification = async () => {

        setLoading(true);

        try {

            const res = await authService.requestEmailVerification();

            if (res.data) {
                setSuccessMessage(res.data.message);
                setError(undefined);
            } else {
                setError(res.error?.message);
            }


        } catch (err) {
            setError("Something wen't wrong trying to request for email verification. Please try again");
            logger.error("Error handling email verification ", err);
        }

        setLoading(false);
    }

    if (!showWarning) {
        return;
    }

    return (
        <WarningCard className={twMerge(
            "flex bg-yellow-50 text-yellow-700 dark:bg-yellow-900/20 dark:border-yellow-700/50 flex-col gap-2 items-start justify-start p-4",
            error && "bg-red-100 dark:bg-red-900/20 border-red-300 text-red-900 dark:text-red-500"
        )} >

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
                className={twMerge(
                    error && ""
                )}
            >
                {error ? "Try Again" : "Verify Email"}
            </PrimaryButton>}
        </WarningCard>
    )
}
