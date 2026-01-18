import { useInternalUserProfile } from '../../hooks/auth/useInternalUserProfile'
import { Navigate } from 'react-router-dom';

/** Renders component that checks if user completed onboarding else it pushes user to onboarding screen */
export default function OnboardingChecker() {

    const {shouldForceOnboarding, isLoading} = useInternalUserProfile();

    if (isLoading) {
        return;
    }

    if (shouldForceOnboarding === true) {
        return (
            <Navigate 
                to={'/post-signup-welcome'}
            />
        )
    }

    return null;
}
