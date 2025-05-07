import { AuthProvider } from "./contexts/AuthContext";
import AppRoutes from "./Routes";
import { ThemeProvider } from "./contexts/ThemeContext";
import { AthleteProvider } from "./contexts/AthleteContext";
import { PlayerProfileProvider } from "./hooks/usePlayerProfile";
import PageVisitsTracker from "./components/analytics/RouterAnalytics";

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AthleteProvider>
          <PlayerProfileProvider>
            <PageVisitsTracker />
            <AppRoutes />
          </PlayerProfileProvider>
        </AthleteProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
