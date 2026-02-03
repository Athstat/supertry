import { useLocation, Navigate } from "react-router-dom";
import { twMerge } from "tailwind-merge";
import { BottomNav } from "../components/ui/navigation/BottomNav";
import { Header } from "../components/ui/navigation/Header";
import RouteErrorBoundary from "../components/ui/navigation/RouteErrorBoundary";
import ScrollToTop from "../components/ui/navigation/ScrollToTop";
import { AppColours } from "../types/constants";
import { ReactNode } from "react";
import { useAuth } from "../contexts/auth/AuthContext";

type LayoutProps = {
    children?: ReactNode
}

// Layout component to maintain consistent structure across routes
export function MainAppLayout({ children }: LayoutProps) {
    return (
        <div className={twMerge(
            "min-h-screen pb-20",
            AppColours.BACKGROUND
        )}>
            <ScrollToTop />
            <Header />
            <div className={twMerge(AppColours.BACKGROUND)}>{children}</div>
            <BottomNav />
        </div>
    )
}

// Auth route component - redirects to dashboard if already authenticated
export const AuthRoute = ({ children }: { children: React.ReactNode }) => {
    const { isAuthenticated } = useAuth();
    const { state } = useLocation();

    if (isAuthenticated) {
        const nextRoute = state?.fromPathname || '/dashboard';
        return <Navigate to={nextRoute} />;
    }

    return <RouteErrorBoundary>{children}</RouteErrorBoundary>;
};