import React from "react";
import { AuthProvider } from "./contexts/AuthContext";
import AppRoutes from "./Routes";
import { ThemeProvider } from "./contexts/ThemeContext";

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
