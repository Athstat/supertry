import { authService } from "../services/authService";
import { logger } from "../services/logger";
import { DjangoAuthUser } from "../types/auth";
import { jwtDecode } from "jwt-decode";
import { TEMP_GUEST_USER_DEVICE_ID } from "../types/constants";

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
export function validatePassword(password: string): [boolean, string?] {
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

// TODO: Mock function return
/** Returns true if a auth token is a keycloak token */
export function isKeycloakToken(token: string): boolean {
  try {
    const decoded = jwtDecode(token);

    // Basic check: issuer contains Keycloak
    if (decoded?.iss && decoded.iss.includes("/auth/realms/")) {
      return true;
    }

    return false;
  } catch (err) {
    logger.error("Error checking if key is keycloak key ", err);
    return false;
  }
}


export function isEmailVerified(user: DjangoAuthUser) {
  return (
    user &&
    user.verification_state === "verified" &&
    user.is_claimed_account === true
  );
}

/** Function that deletes and flushes a temporal guest account */
export function deleteTempGuestAccount () {
  const user = authService.getUserInfoSync();

  if (user?.email === `${TEMP_GUEST_USER_DEVICE_ID}@devices.scrummy-app.ai`) {
    authService.logout();
  }
}