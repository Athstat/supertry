import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import ScrollToTop from './components/ui/navigation/ScrollToTop';
import { useAuth } from './contexts/AuthContext';
import { Header } from './components/ui/navigation/Header';
import { BottomNav } from './components/ui/navigation/BottomNav';
import RouteErrorBoundary from './components/ui/navigation/RouteErrorBoundary';
import { twMerge } from 'tailwind-merge';
import { AppColours } from './types/constants';

// Layout component to maintain consistent structure across routes
export const Layout = ({ children }: { children: React.ReactNode }) => (
  <div className={twMerge(
    "min-h-screen pb-20",
    AppColours.BACKGROUND
  )}>
    <ScrollToTop />
    <Header />
    <div className={twMerge(AppColours.BACKGROUND)}>{children}</div>
    <BottomNav />
  </div>
);

// Auth route component - redirects to dashboard if already authenticated
export const AuthRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  const { state } = useLocation();

  if (isAuthenticated) {
    const nextRoute = state?.fromPathname ?? '/dashboard';

    console.log('Next route: ', nextRoute);

    return <Navigate to={nextRoute} />;
  }

  return <RouteErrorBoundary>{children}</RouteErrorBoundary>;
};

const AppRoutes = () => {
  return (
    <>
      

    </>
  );
};

export default AppRoutes;
