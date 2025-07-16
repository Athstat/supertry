import useSWR from "swr";
import { userService } from "../services/userService";

/** Hook that validates a email and it changes in real time
 * good for form fields where you need to make sure that an
 * email is not already taken by another user
 */

export function useEmailUniqueValidator(email: string) {

    const key = `/user-by-email/${email}`;
    const {data: user, isLoading} = useSWR(key, () => userService.getUserByEmail(email));

    const emailTaken = user !== undefined && user.email === email

    return {emailTaken, user, isLoading};
}