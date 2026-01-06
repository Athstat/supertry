import { useState, useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { WelcomeScreen } from "../../screens/auth/WelcomeScreen";
import { isFirstAppVisit, markAppVisited } from "../../utils/firstVisitUtils";
import RouteErrorBoundary from "./navigation/RouteErrorBoundary";
import { AuthChoiceScreen } from "../../screens/auth/AuthChoiceScreen";
import { analytics } from "../../services/analytics/anayticsService";

// First Visit handler component
export function FirstVisitHandler() {
  const { isAuthenticated } = useAuth();
  const [, setHasVisitedBefore] = useState<boolean | null>(null);

  const {pathname} = useLocation();

  useEffect(() => {
    // Check if user has visited the app before
    const firstVisit = isFirstAppVisit();
    setHasVisitedBefore(!firstVisit);

    // If this is the first visit, mark it
    if (firstVisit) {
      analytics.trackFirstUserVisit();
      markAppVisited();
    }
  }, []);

  if (isAuthenticated) {
    if (pathname === "/") {
        return <Navigate to="/dashboard" />;
    }
  }

  // First-time visitors see WelcomeScreen, returning visitors see AuthChoiceScreen
  return (
    <RouteErrorBoundary>
      {/* {!hasVisitedBefore ? <WelcomeScreen /> : <AuthChoiceScreen />} */}
      {/* {<AuthChoiceScreen />} */}
      <WelcomeScreen />
    </RouteErrorBoundary>
  );
};