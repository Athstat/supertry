import { Fragment, useEffect, useState } from "react";
import ScrummyLogo from "../../components/branding/scrummy_logo";
import PageView from "../PageView";
import { CheckCircle2, Loader } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import PrimaryButton from "../../components/ui/buttons/PrimaryButton";
import { useNavigate, useSearchParams } from "react-router-dom";
import { authService } from "../../services/authService";
import { ErrorState } from "../../components/ui/ErrorState";


export default function VerifyEmailScreen() {

    const { authUser } = useAuth();
    const [error, setError] = useState<string>();
    const [successMessage, setSuccessMessage] = useState<string>();
    const [isLoading, setLoading] = useState<boolean>(false);

    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');

    const shouldSkipVerification = false;
    const navigate = useNavigate();

    const handleVerifyEmail = async () => {

        setLoading(true);

        try {
            if (token) {
                const res = await authService.verifyEmailWithToken(token);

                if (res.data) {
                    setSuccessMessage(res.data.message);
                    setLoading(false);
                    return;
                } else {
                    setError(res.error?.message);
                }
            } else {
                setError("Email verification is either invalid or has expired, there is no token");
            }
        } catch {
            setError("Email verification is either invalid or has expired");
        }

        setLoading(false);
    }

    useEffect(() => {
        handleVerifyEmail();
    }, [token]);

    const navigateToSignIn = () => {
        navigate('/signin');
    }

    const navigateToDashboard = () => {
        navigate('/dashboard');
    }

    return (
        <PageView className="flex flex-col gap-2 items-center justify-start h-screen overflow-hidden p-4" >
            <ScrummyLogo className="w-52 h-52" />

            {!shouldSkipVerification && (
                <Fragment>
                    {isLoading && (
                        <div className="flex flex-row items-center gap-2 text-blue-700 font-medium" >
                            <Loader className="animate-spin" />
                            <p className="text-lg" >Verifying your Email</p>
                        </div>
                    )}

                    {successMessage && !isLoading && (
                        <div className="w-full flex flex-col items-center justify-center gap-4" >
                            <div className="flex text-green-500 flex-row items-center justify-center gap-2 w-full" >
                                <CheckCircle2 />
                                <p>{successMessage}</p>
                            </div>


                            {authUser && (
                                <div>
                                    <PrimaryButton onClick={navigateToDashboard} className="w-fit" >Go to Dashboard</PrimaryButton>
                                </div>
                            )}

                            {!authUser && (
                                <div>
                                    <PrimaryButton onClick={navigateToSignIn} className="w-fit" >Sign In</PrimaryButton>
                                </div>
                            )}
                        </div>
                    )}

                    {error && (
                        <div className="flex flex-col items-center gap-4 justify-center" >
                            <ErrorState
                                error="Whoops"
                                message={error}
                            />

                            <div>
                                <PrimaryButton onClick={navigateToDashboard} className="w-fit" >Go Back to App</PrimaryButton>
                            </div>

                        </div>
                    )}
                </Fragment>
            )}

            {shouldSkipVerification && authUser && (
                <div className="flex flex-col gap-4 items-center justify-center" >
                    <p>Your email, <strong>{authUser.email}</strong> has already been verified</p>

                    {authUser && (
                        <div>
                            <PrimaryButton onClick={navigateToDashboard} className="w-fit" >Go to Dashboard</PrimaryButton>
                        </div>
                    )}

                    {!authUser && (
                        <div>
                            <PrimaryButton onClick={navigateToSignIn} className="w-fit" >Sign In</PrimaryButton>
                        </div>
                    )}

                </div>
            )}
        </PageView>
    )
}
