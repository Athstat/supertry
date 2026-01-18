import { useCallback, useContext, useState } from "react";
import { InternalUserProfileContext } from "../../contexts/InternalUserProfileContext";
import { UpdatedUserInternalProfileReq } from "../../types/auth";
import { logger } from "../../services/logger";
import { userService } from "../../services/userService";
import { useAuth } from "../../contexts/AuthContext";

export function useInternalUserProfile() {

    const { authUser } = useAuth();
    const localstorageKey = `USER_ATTEMPTED_ONBOARDING/${authUser?.kc_id || 'default'}`;

    const context = useContext(InternalUserProfileContext);

    const [isLoading, setIsLoading] = useState(false);

    if (context === null) {
        throw Error('useInternalUserProfile() is used outside the InternalUserProfileContext');
    }

    const hasUserAttempted = localStorage.getItem(localstorageKey) !== null;
    const isOnboardingCompleted = context.internalProfile ? context.internalProfile?.completed_onboarding : true;
    const shouldForceOnboarding = !hasUserAttempted && !isOnboardingCompleted;

    const updateProfile = useCallback(async (data: UpdatedUserInternalProfileReq) => {

        if (!authUser) {
            return;
        }

        setIsLoading(true);
        
        try {

            const profile = await userService.updateInternalProfle(authUser?.kc_id, data);

            if (profile) {
                context.refresh(profile);
            }

        } catch (err) {
            logger.error("Error updating user internal profile ", err);
        } finally {
            setIsLoading(false);
            localStorage.setItem(localstorageKey, 'true')
        }

    }, [authUser, context, localstorageKey]);


    return {
        ...context,
        shouldForceOnboarding,
        updateProfile,
        isLoading
    }
}