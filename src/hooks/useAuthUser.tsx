import { useNavigate } from "react-router-dom";
import { authService } from "../services/authService";

export function useAuthUser() {
    const user = authService.getUserInfo();
    const navigate = useNavigate();

    if (!user) {
        navigate('/signin');
    }  

    const authUser = user!;

    return authUser;
}