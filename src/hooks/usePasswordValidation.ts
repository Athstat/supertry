import { useEffect, useState } from "react";
import { validatePassword } from "../utils/authUtils";

export function usePasswordValidation(password: string) {

    const [isValid, setIsValid] = useState<boolean>(false);
    const [reason, setReason] = useState<string>();

    useEffect(() => {

        const [result, message] = validatePassword(password);

        setIsValid(result);
        setReason(message);

    }, [password]);

    return { isValid, reason };

}