import { User } from "lucide-react";
import { ErrorState } from "../../ui/ErrorState";
import PrimaryButton from "../../shared/buttons/PrimaryButton";
import { useGuestLogin } from "../../../hooks/auth/useGuestLogin";
import { useDeviceId } from "../../../hooks/useDeviceId";

export default function GuestLoginBox() {

    const {deviceId} = useDeviceId();
    const {handleGuestLogin, error, isLoading} = useGuestLogin();
    if (!deviceId) return;

    return (
        <div>
            <PrimaryButton
                type="button"
                onClick={handleGuestLogin}
                isLoading={isLoading}
                disbabled={isLoading}
                className="w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-dark-800/40 text-gray-800 dark:text-gray-200 px-6 py-3 rounded-xl font-semibold hover:bg-gray-50 dark:hover:bg-dark-700 transition-colors flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
            >
                    <>
                        <User className="mr-2 h-5 w-5" />
                        <span>{isLoading ? "Signing in as Guest" : "Continue Without Account"}</span>
                    </>

            </PrimaryButton>

            { error && <ErrorState error={error} /> }

        </div>
    )
}
