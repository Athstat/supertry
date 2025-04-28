import React from "react";
import { AuthProvider } from "./contexts/AuthContext";
import AppRoutes from "./Routes";
import { ThemeProvider } from "./contexts/ThemeContext";
import { AthleteProvider } from "./contexts/AthleteContext";
import { PlayerProfileProvider } from "./hooks/usePlayerProfile";

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AthleteProvider>
          <PlayerProfileProvider>
            <AppRoutes />
          </PlayerProfileProvider>
        </AthleteProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
