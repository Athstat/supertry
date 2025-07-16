import { User } from "lucide-react";
import { useState } from "react";
import { authService } from "../../../services/authService";
import { useDeviceId } from "../../../hooks/useDeviceId";
import { ErrorState } from "../../ui/ErrorState";
import { useNavigate } from "react-router-dom";
import PrimaryButton from "../../shared/buttons/PrimaryButton";


export default function GuestLoginBox() {

    const navigate = useNavigate();
    const [isGuestLoading, setIsGuestLoading] = useState(false);
    const [error, setError] = useState<string>();
    const {deviceId} = useDeviceId();

    const handleGuestLogin = async () => {
        
        setError(undefined);
        
        if (!deviceId) return;
        
        try {

            setIsGuestLoading(true);
            const {data, error} = await authService.authenticateAsGuestUser(deviceId);

            if (data) {
                navigate('/dashboard');
            } else {
                setError(error?.message);
            }

        } catch (err) {
            console.error('Guest login error:', err);
            setError('Failed to sign in as guest. Please try again.');
        } finally {
            setIsGuestLoading(false);
        }
    };

    if (!deviceId) return;

    return (
        <div>
            <PrimaryButton
                type="button"
                onClick={handleGuestLogin}
                isLoading={isGuestLoading}
                disbabled={isGuestLoading}
                className="w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-dark-800/40 text-gray-800 dark:text-gray-200 px-6 py-3 rounded-xl font-semibold hover:bg-gray-50 dark:hover:bg-dark-700 transition-colors flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
            >
                    <>
                        <User className="mr-2 h-5 w-5" />
                        <span>{isGuestLoading ? "Signing in as Guest" : "Continue as Guest"}</span>
                    </>

            </PrimaryButton>

            { error && <ErrorState error={error} /> }

        </div>
    )
}
