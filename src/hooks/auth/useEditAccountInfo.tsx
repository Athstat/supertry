import { useState, useMemo, useCallback } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { logger } from "../../services/logger";
import { userService } from "../../services/userService";
import { EditAccountInfoForm } from "../../types/auth";

export function useEditAccountInfo() {
    const { authUser, refreshAuthUser } = useAuth();

    const [form, setForm] = useState<EditAccountInfoForm>({
        username: authUser?.username ?? "",
        firstName: authUser?.first_name,
        lastName: authUser?.last_name
    });

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>();
    const [successMessage, setSuccessMessage] = useState<string>();

    const changesDetected = useMemo(() => {
        const originalHash = `${authUser?.username}---${authUser?.first_name}---${authUser?.last_name}`;
        const newHash = `${form.username}---${form?.firstName}---${form?.lastName}`;

        return newHash !== originalHash
    }, [authUser, form]);

    const userNameError = useMemo(() => {
        const { username } = form;

        if (username === "" || username === undefined) {
            return "Username is required"
        }

        if (username.length < 3) {
            return "Username must be atleast 3 characters long"
        }

        return undefined;
    }, [form]);

    const handleSaveChanges = useCallback(async (onSuccess?: () => void) => {

        if (userNameError) {
            return;
        }

        setIsLoading(true);
        setSuccessMessage(undefined);
        setError(undefined);

        try {

            const res = await userService.updateUserProfile({
                username: form.username ?? "",
                first_name: form.firstName ?? "",
                last_name: form.lastName ?? ""
            });

            if (res) {
                setSuccessMessage("Profile Updated Successfully");
                await refreshAuthUser(res);

                if (onSuccess) {
                    onSuccess();
                }
            } else {
                setError("Whoops! Something wen't wrong, please try again");
            }

        } catch (err) {
            setError("Something wen't wrong updating your user profile");
            logger.error("Error editing account info ", err);
        }

        setIsLoading(false);
    }, [userNameError, form.username, form.firstName, form.lastName, refreshAuthUser]);


    return {
        handleSaveChanges,
        isLoading,
        error,
        successMessage,
        form,
        setForm,
        changesDetected,
        userNameError,
        setError,
        setSuccessMessage
    }
}