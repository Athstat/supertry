import { useState, useEffect } from 'react';
import { Trophy } from 'lucide-react';
import LeagueTabs from '../components/fantasy-leagues/LeagueTabs';
import MyLeaguesTab from '../components/fantasy-leagues/join_league_screen/MyLeaguesTab';
import DiscorverLeaguesTab from '../components/fantasy-leagues/join_league_screen/DiscorverLeaguesTab';
import JoinLeagueByCodeTab from '../components/fantasy-leagues/join_league_screen/JoinByCodeTab';

export function FantasyLeaguesScreen() {
  // Tabs state (persist between visits)
  const [activeTab, setActiveTab] = useState<'my' | 'discover' | 'code'>(() => {
    const saved = localStorage.getItem('league_tab');
    return (saved as 'my' | 'discover' | 'code') || 'my';
  });

  useEffect(() => {
    localStorage.setItem('league_tab', activeTab);
  }, [activeTab]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="container dark:text-white mx-auto px-4 sm:px-6 py-6 max-w-3xl">
      <div className="flex items-center mb-4 gap-2 sm:mb-6 justify-between">

        <div className='flex flex-row gap-2 items-center justify-center' >
          <Trophy className='dark:text-white' />
          <h1 className="text-2xl sm:text-3xl font-bold dark:text-white flex-1">Fantasy Leagues</h1>
        </div>

        <div>
          {/* <FantasyLeagueScreenCTA /> */}
        </div>
      </div>

      <LeagueTabs value={activeTab} onChange={setActiveTab} className="mb-4 sm:mb-6" />

      {/* {leagueOnTheClock && (
        <div className="mb-4 sm:mb-6">
          <JoinLeagueDeadlineCountdown league={leagueOnTheClock} onViewLeague={handleLeagueClick} />
        </div>
      )} */}

      {activeTab === 'my' && (
        <MyLeaguesTab />
      )}

      {activeTab === 'discover' && (
        <DiscorverLeaguesTab />
      )}

      {activeTab === 'code' && <JoinLeagueByCodeTab />}
    </div>
  );
}
