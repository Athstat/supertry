import { Navigate, useLocation } from "react-router-dom";
import ScrummyLoadingState from "../../ui/ScrummyLoadingState";
import RouteErrorBoundary from "../../ui/navigation/RouteErrorBoundary";
import { useAuth } from "../../../contexts/AuthContext";

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