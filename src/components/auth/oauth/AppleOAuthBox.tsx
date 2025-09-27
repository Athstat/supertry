/* eslint-disable @typescript-eslint/no-explicit-any */
import { Fragment, useState } from 'react'
import { authService } from '../../../services/authService';
import { isFirstVisitCompleted, markFirstVisitCompleted } from '../../../utils/firstVisitUtils';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import AppleSignin from "react-apple-signin-auth";
import { ErrorMessage } from '../../ui/ErrorState';
import PrimaryButton from '../../shared/buttons/PrimaryButton';
import { isInProduction } from '../../../utils/webUtils';
import WarningCard from '../../shared/WarningCard';
import { TriangleAlert } from 'lucide-react';
import { twMerge } from 'tailwind-merge';

type Props = {
    className?: string
}

export default function AppleOAuthBox({className} : Props) {

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>();

    const navigate = useNavigate();
    const { setAuth } = useAuth();

    const handleAppleSuccess = async (response: any) => {
        if (!response.authorization || !response.authorization.id_token) {
            setError('Apple sign-in failed. Please try again.');
            return;
        }

        try {
            setIsLoading(true);
            setError(null);
            const result = await authService.appleOAuth(response.authorization.id_token);

            if (result.error || !result.data) {
                setError(result?.error?.message || 'Apple sign-in failed');
                setIsLoading(false);
                return;
            }

            // Update auth context
            // await checkAuth();

            const { token, user } = result.data;
            setAuth(token, user);

            // Check if this is the first completed visit
            const firstVisitCompleted = isFirstVisitCompleted();

            // Navigate to appropriate screen
            if (firstVisitCompleted) {
                navigate('/dashboard');
            } else {
                markFirstVisitCompleted();
                navigate('/post-signup-welcome');
            }
        } catch (err) {
            console.error('Apple OAuth error:', err);
            setError('Apple sign-in failed. Please try again.');
            setIsLoading(false);
        }
    };

    const handleAppleError = (error: Error) => {
        console.error('Apple sign-in failed', error);
        setError('Whoops! Failed to Sign In with Apple. Please try again');
    };

    const authOptions = {
        clientId: import.meta.env.VITE_APPLE_CLIENT_ID || 'your-apple-client-id',
        scope: 'name email',
        redirectURI: window.location.origin,
        state: 'login',
        nonce: 'scrummy-nonce',
        usePopup: true,
    }

    console.log('Auth Options ', authOptions);

    if (!authOptions.clientId) {
        if (!isInProduction()) {
            return (
                <WarningCard className='flex flex-row items-center gap-2' >
                    <TriangleAlert className='min-w-4 h-4' />
                    <p className='text-xs' >
                        Apple OAuth is not properly configured. Please check if all ENVs have been set properly. In Production apple sign in option
                        will he hidden when misconfigured. Error only showing up on QA or Local
                    </p>
                </WarningCard>
            )
        }
        return;
    }

    return (
        <Fragment>
            <AppleSignin
                authOptions={authOptions}
                uiType="dark"
                onSuccess={handleAppleSuccess}
                onError={handleAppleError}
                skipScript={false}
                render={(renderProps: any) => (
                    <PrimaryButton
                        onClick={renderProps.onClick}
                        disabled={renderProps.disabled || isLoading}
                        className={twMerge(
                            "w-full bg-white dark:bg-gray-900 text-gray-900 dark:text-white flex items-center justify-center space-x-2 px-4 py-3 rounded-xl hover:shadow-md hover:bg-gray-50 dark:hover:bg-slate-800 font-medium border border-gray-300 dark:border-gray-800 transition-all duration-200",
                            className
                        )}
                    >
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                        </svg>
                        <span>Continue with Apple</span>
                    </PrimaryButton>
                )}
            />

            {error && (
                <ErrorMessage message={error} />
            )}
        </Fragment>
    )
}
