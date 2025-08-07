import { Navigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import RouteErrorBoundary from "../RouteErrorBoundary";

// Protected route component with error boundary
export function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const { isAuthenticated } = useAuth();

    if (!isAuthenticated) {
        return <Navigate to="/signin" />;
    }


    return (
        <RouteErrorBoundary>
            {children}
        </RouteErrorBoundary>
    );
};