import AppRoutes from './Routes';
import { twMerge } from 'tailwind-merge';
import { AppColours } from './types/constants';
import RootProviders from './RootProviders';
import { useEffect } from 'react';


function App() {

  // Fixes white overflow when pulling the screen up from the top
  
  useEffect(() => {
    document.body.className = twMerge(
      AppColours.BACKGROUND,
      "w-screen h-screen"
    );
  }, []);

  return (
    <RootProviders>
      <AppRoutes />
    </RootProviders>
  );
}

export default App;
