import AppRoutes from './Routes';
import { twMerge } from 'tailwind-merge';
import { AppColours } from './types/constants';
import RootProviders from './RootProviders';
import { useEffect } from 'react';

// The Activity Component has been added to the latest release
// of react 19.2.0, please check the docs

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
