import { useCallback, useContext } from "react";
import { InternalUserProfileContext } from "../../contexts/InternalUserProfileContext";
import { UpdatedUserInternalProfileReq } from "../../types/auth";
import { logger } from "../../services/logger";
import { userService } from "../../services/userService";
import { useAuth } from "../../contexts/AuthContext";

export function useInternalUserProfile() {
    const {authUser} = useAuth();
    const context = useContext(InternalUserProfileContext);

    if (context === null) {
        throw Error('useInternalUserProfile() is used outside the InternalUserProfileContext');
    }

    const isOnboardingCompleted = context.internalProfile?.completed_onboarding;

    const updateProfile = useCallback(async (data: UpdatedUserInternalProfileReq) => {
        try {

            if (!authUser) {
                return;
            }

            const profile = await userService.updateInternalProfle(authUser?.kc_id, data);

            if (profile) {
                context.refresh(profile);
            }

        } catch(err) {
            logger.error("Error updating user internal profile ", err);
        }

    }, [authUser, context])

    return {
        ...context,
        isOnboardingCompleted,
        updateProfile
    }
}