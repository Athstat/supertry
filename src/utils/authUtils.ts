import { DjangoAuthUser } from "../types/auth";

export function validateUsername(username: string) {
    const usernameRegex = /^[a-zA-Z0-9_]{3,30}$/;
    return usernameRegex.test(username)
}

export function validateUsernameOrThrow(username: string) {
    const isValid = validateUsername(username);

    if (!isValid) {
        throw new Error("Username is invalid");
    }
}

/** Returns an array the first element being a boolean representing whether 
 * the password is valid or not and the second being a string with a reason
 * for why the validation failed
 */
export function validatePassword(password: string) : [boolean, string?] {
    const passesLength = password.length >= 8;
    if (passesLength) {
        return [true, undefined]
    }
    return [false, 'Password must be 8 characters or longer'];
}

export function validatePasswordOrThrow(password: string) {
    const [isValid, reason] = validatePassword(password);

    if (!isValid) {
        throw new Error(reason ? `Password valdiation failed because: ${reason}` : "Email is invalid");
    }
}


/** Removes the `guest_` from the guest user as a username suggestion */
export function guestNewUsernameSuggestion(guestUser: DjangoAuthUser) {
    const oldUsername = guestUser.username

    if (oldUsername) {
        return oldUsername.replace("guest_", "");
    }

    return undefined;
}