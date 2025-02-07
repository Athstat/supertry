import React, { useState, useEffect } from 'react';
import { LeagueHeader } from '../components/league/LeagueHeader';
import { LeagueStandings } from '../components/league/LeagueStandings';
import { FixturesList } from '../components/league/FixturesList';
import { LeagueInsights } from '../components/league/LeagueInsights';
import { LeagueSettings } from '../components/league/LeagueSettings';
import { ChatFeed } from '../components/league/chat/ChatFeed';
import { TeamStats, Fixture, LeagueInfo } from '../types/league';
import { ChatMessage, ChatUser } from '../types/chat';

export function LeagueScreen() {
  const [showSettings, setShowSettings] = useState(false);
  const [showJumpButton, setShowJumpButton] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      userId: '2',
      userName: 'Sarah Johnson',
      userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
      content: 'Great game this weekend! My team performed really well 🎉',
      timestamp: '2:30 PM',
      reactions: [{ emoji: '👍', count: 2, userIds: ['1', '3'] }],
    },
    {
      id: '2',
      userId: '3',
      userName: 'Mike Wilson',
      userAvatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&h=100&fit=crop',
      content: 'Anyone watching the Crusaders match tonight?',
      timestamp: '2:35 PM',
      reactions: [],
    },
    {
      id: '3',
      userId: '1',
      userName: 'You',
      userAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
      content: "I'll be watching! Should be an exciting match 🏉",
      timestamp: '2:40 PM',
      reactions: [{ emoji: '🔥', count: 1, userIds: ['2'] }],
    },
  ]);

  const currentUser: ChatUser = {
    id: '1',
    name: 'You',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
    isAdmin: true,
  };

  const leagueInfo: LeagueInfo = {
    name: 'Premier Weekly League',
    type: 'Public',
    currentGameweek: 12,
    totalGameweeks: 38,
    totalTeams: 256,
    prizePool: '$1,000'
  };

  const teams: TeamStats[] = [
    { id: '1', rank: 1, teamName: 'Thunder Warriors', managerName: 'John Smith', totalPoints: 876, weeklyPoints: 64, lastRank: 2 },
    { id: '2', rank: 2, teamName: 'Rugby Legends', managerName: 'Sarah Johnson', totalPoints: 854, weeklyPoints: 58, lastRank: 1 },
    { id: '3', rank: 3, teamName: 'Mighty Dragons', managerName: 'Mike Wilson', totalPoints: 842, weeklyPoints: 72, lastRank: 4 },
    { id: '4', rank: 4, teamName: 'Phoenix Rising', managerName: 'Emma Davis', totalPoints: 835, weeklyPoints: 55, lastRank: 3 },
    { id: '5', rank: 5, teamName: 'Storm Chasers', managerName: 'Alex Turner', totalPoints: 821, weeklyPoints: 61, lastRank: 5 },
    { id: '6', rank: 6, teamName: 'Iron Titans', managerName: 'Daniel Brown', totalPoints: 805, weeklyPoints: 60, lastRank: 7 },
    { id: '7', rank: 7, teamName: 'Shadow Strikers', managerName: 'Olivia Martinez', totalPoints: 793, weeklyPoints: 54, lastRank: 6 },
    { id: '8', rank: 8, teamName: 'Blazing Bulls', managerName: 'Ethan Wright', totalPoints: 780, weeklyPoints: 50, lastRank: 9 },
    { id: '9', rank: 9, teamName: 'Furious Falcons', managerName: 'Sophia Lee', totalPoints: 775, weeklyPoints: 52, lastRank: 8 },
    { id: '42', rank: 42, teamName: 'Your Team Name', managerName: 'You', totalPoints: 654, weeklyPoints: 48, lastRank: 45, isUserTeam: true },
  ];

  const fixtures: Fixture[] = [
    {
      id: '1',
      homeTeam: 'Crusaders',
      awayTeam: 'Blues',
      date: '2025-03-15',
      time: '19:45',
      venue: 'Eden Park',
      competition: 'Super Rugby'
    },
    {
      id: '2',
      homeTeam: 'Hurricanes',
      awayTeam: 'Chiefs',
      date: '2025-03-16',
      time: '17:30',
      venue: 'Sky Stadium',
      competition: 'Super Rugby'
    },
  ];

  useEffect(() => {
    const userTeam = teams.find(team => team.isUserTeam);
    setShowJumpButton(userTeam?.rank && userTeam.rank > 5);
  }, []);

  const handleSendMessage = (content: string) => {
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      userId: currentUser.id,
      userName: currentUser.name,
      userAvatar: currentUser.avatar,
      content,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      reactions: [],
      isAdmin: currentUser.isAdmin,
    };
    setMessages((prev) => [...prev, newMessage]);
  };

  const handleDeleteMessage = (messageId: string) => {
    setMessages((prev) => prev.filter((msg) => msg.id !== messageId));
  };

  const handleReactToMessage = (messageId: string, emoji: string) => {
    setMessages((prev) =>
      prev.map((msg) => {
        if (msg.id === messageId) {
          const existingReaction = msg.reactions.find((r) => r.emoji === emoji);
          if (existingReaction) {
            if (existingReaction.userIds.includes(currentUser.id)) {
              return {
                ...msg,
                reactions: msg.reactions.map((r) =>
                  r.emoji === emoji
                    ? {
                        ...r,
                        count: r.count - 1,
                        userIds: r.userIds.filter((id) => id !== currentUser.id),
                      }
                    : r
                ).filter((r) => r.count > 0),
              };
            } else {
              return {
                ...msg,
                reactions: msg.reactions.map((r) =>
                  r.emoji === emoji
                    ? {
                        ...r,
                        count: r.count + 1,
                        userIds: [...r.userIds, currentUser.id],
                      }
                    : r
                ),
              };
            }
          } else {
            return {
              ...msg,
              reactions: [
                ...msg.reactions,
                { emoji, count: 1, userIds: [currentUser.id] },
              ],
            };
          }
        }
        return msg;
      })
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-850">
      <LeagueHeader 
        leagueInfo={leagueInfo}
        onOpenSettings={() => setShowSettings(true)}
      />

      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 space-y-6">
            <LeagueStandings
              teams={teams}
              showJumpButton={showJumpButton}
              onJumpToTeam={() => {}}
            />
            <ChatFeed
              messages={messages}
              currentUser={currentUser}
              onSendMessage={handleSendMessage}
              onDeleteMessage={handleDeleteMessage}
              onReactToMessage={handleReactToMessage}
            />
          </div>

          <div className="lg:col-span-5 space-y-6">
            <FixturesList fixtures={fixtures} />
            <LeagueInsights />
          </div>
        </div>
      </div>

      {showSettings && (
        <LeagueSettings onClose={() => setShowSettings(false)} />
      )}
    </div>
  );
}