import { Navigate, useLocation, useSearchParams } from "react-router-dom";
import ScrummyLoadingState from "../../ui/ScrummyLoadingState";
import RouteErrorBoundary from "../../ui/navigation/RouteErrorBoundary";
import { useAuth } from "../../../contexts/AuthContext";

// Protected route component with error boundary
export function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const { isAuthenticated, isLoading } = useAuth();
    const {pathname} = useLocation();
    const [searchParams] = useSearchParams();

    const returnPath = encodeURIComponent(
        pathname + (searchParams.toString() ? `?${searchParams.toString()}` : '')
    );

    if (isLoading) {
        return (
            <ScrummyLoadingState />
        )
    }

    if (!isAuthenticated) {
        return <Navigate to={`/signin?return=${returnPath}`} state={{
            fromPathname: pathname
        }} />;
    }

    return (
        <RouteErrorBoundary>
            {children}
        </RouteErrorBoundary>
    );
};