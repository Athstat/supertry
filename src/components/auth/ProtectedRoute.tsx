import { Navigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import RouteErrorBoundary from "../RouteErrorBoundary";
import ScrummyLoadingState from "../ui/ScrummyLoadingState";

// Protected route component with error boundary
export function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const { isAuthenticated, isLoading } = useAuth();

    if (isLoading) {
        return (
            <ScrummyLoadingState />
        )
    }

    if (!isAuthenticated) {
        return <Navigate to="/signin" />;
    }

    return (
        <RouteErrorBoundary>
            {children}
        </RouteErrorBoundary>
    );
};