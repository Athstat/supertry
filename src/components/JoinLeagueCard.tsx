import React from 'react';
import { Users, ChevronRight } from 'lucide-react';

interface JoinLeagueCardProps {
  name: string;
  entryFee: string;
  prizePool: string;
  players: number;
  maxPlayers: number;
}

export function JoinLeagueCard({ name, entryFee, prizePool, players, maxPlayers }: JoinLeagueCardProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 hover:border-indigo-600 transition-all">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold mb-1">{name}</h3>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Users size={16} />
            <span>{players}/{maxPlayers} players</span>
          </div>
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-600">Entry Fee</div>
          <div className="font-semibold">{entryFee}</div>
        </div>
      </div>
      
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm text-gray-600">Prize Pool</div>
          <div className="font-semibold text-green-600">{prizePool}</div>
        </div>
        <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors flex items-center gap-1">
          Join Now
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}