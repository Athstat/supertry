import React from "react";
import { AuthProvider } from "./contexts/AuthContext";
import AppRoutes from "./Routes";
import { ThemeProvider } from "./contexts/ThemeContext";
import { AthleteProvider } from "./contexts/AthleteContext";

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AthleteProvider>
          <AppRoutes />
        </AthleteProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
