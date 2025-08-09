import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import RouteErrorBoundary from "../RouteErrorBoundary";
import ScrummyLoadingState from "../ui/ScrummyLoadingState";

// Protected route component with error boundary
export function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const { isAuthenticated, isLoading } = useAuth();
    const {pathname} = useLocation();

    if (isLoading) {
        return (
            <ScrummyLoadingState />
        )
    }

    if (!isAuthenticated) {

        console.log("Whiles hitting route: ", pathname, " user was not authenticated");

        return <Navigate to="/signin" state={{
            fromPathname: pathname
        }} />;
    }

    return (
        <RouteErrorBoundary>
            {children}
        </RouteErrorBoundary>
    );
};