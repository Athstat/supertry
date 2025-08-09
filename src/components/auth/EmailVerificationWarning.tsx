import { useAuth } from "../../contexts/AuthContext"
import PrimaryButton from "../shared/buttons/PrimaryButton";
import WarningCard from "../shared/WarningCard";

type Props = {

}

export default function EmailVerificationWarning({ }: Props) {

    const {authUser} = useAuth();

    if (authUser?.verification_state === "verified") {
        return;
    }

    return (
        <WarningCard className="flex bg-yellow-50 flex-col gap-1 items-start justify-start p-4" >
            
            <h2 className="font-bold" >Email Verfication</h2>

            <p>
                Your email is not verified yet verified. Please verify your email, to get full access to the scrummm!
            </p>

            <PrimaryButton>Verify Email</PrimaryButton>
        </WarningCard>
    )
}
