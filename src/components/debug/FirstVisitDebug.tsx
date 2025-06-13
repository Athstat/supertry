import { useState } from 'react';
import { getFirstVisitState, resetFirstVisitStatus, simulateFreshInstall } from '../../utils/firstVisitUtils';

/**
 * Debug component for testing first visit functionality
 * Only displayed in development mode
 */
export function FirstVisitDebug() {
  const [state, setState] = useState(getFirstVisitState());
  
  // Only show in development mode
  if (import.meta.env.MODE !== 'development') {
    return null;
  }
  
  const updateState = () => {
    setState(getFirstVisitState());
  };
  
  const handleReset = () => {
    resetFirstVisitStatus();
    updateState();
  };
  
  const handleSimulateFreshInstall = () => {
    simulateFreshInstall();
    updateState();
  };
  
  return (
    <div 
      style={{
        position: 'fixed',
        bottom: '70px',
        right: '10px',
        backgroundColor: 'rgba(0,0,0,0.7)',
        color: 'white',
        padding: '10px',
        borderRadius: '5px',
        fontSize: '12px',
        zIndex: 9999,
        maxWidth: '300px'
      }}
    >
      <div style={{ marginBottom: '8px', fontWeight: 'bold' }}>First Visit Debug</div>
      <div style={{ marginBottom: '5px' }}>
        Is First Visit: <span style={{ color: state.isFirstVisit ? '#4ade80' : '#f87171' }}>
          {state.isFirstVisit ? 'Yes' : 'No'}
        </span>
      </div>
      <div style={{ marginBottom: '5px' }}>
        First Visit Completed: <span style={{ color: state.isFirstVisitCompleted ? '#4ade80' : '#f87171' }}>
          {state.isFirstVisitCompleted ? 'Yes' : 'No'}
        </span>
      </div>
      <div style={{ marginBottom: '10px' }}>
        Fresh Install: <span style={{ color: state.isFreshInstall ? '#4ade80' : '#f87171' }}>
          {state.isFreshInstall ? 'Yes' : 'No'}
        </span>
      </div>
      <div style={{ display: 'flex', gap: '5px' }}>
        <button 
          onClick={handleReset}
          style={{
            backgroundColor: '#2563eb',
            color: 'white',
            padding: '4px 8px',
            borderRadius: '3px',
            fontSize: '10px'
          }}
        >
          Reset Flags
        </button>
        <button 
          onClick={handleSimulateFreshInstall}
          style={{
            backgroundColor: '#9333ea',
            color: 'white',
            padding: '4px 8px',
            borderRadius: '3px',
            fontSize: '10px'
          }}
        >
          Simulate Fresh Install
        </button>
        <button 
          onClick={updateState}
          style={{
            backgroundColor: '#65a30d',
            color: 'white',
            padding: '4px 8px',
            borderRadius: '3px',
            fontSize: '10px'
          }}
        >
          Refresh
        </button>
      </div>
    </div>
  );
} 