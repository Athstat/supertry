import React from 'react';
import { Users, Calendar, Award } from 'lucide-react';

const JoinWeeklyLeagueCard = () => {
  return (
    <div className="rounded-xl overflow-hidden bg-gradient-to-br from-primary-700 to-primary-900 via-primary-800 text-white">
      <div className="p-6">
        <h2 className="text-xl font-bold mb-1">Weekly Rugby Fantasy Leagues</h2>
        <p className="text-sm text-blue-100 mb-4">
          Create your dream team and compete in weekly leagues
        </p>

        <div className="flex flex-wrap gap-4 mb-4">
          {/* Joined count */}
          <div className="flex items-center">
            <Users className="w-4 h-4 mr-2 text-blue-200" />
            <span className="text-sm font-medium">1,247 joined</span>
          </div>

          {/* Time left */}
          <div className="flex items-center">
            <Calendar className="w-4 h-4 mr-2 text-blue-200" />
            <span className="text-sm font-medium">2 days left</span>
          </div>
        </div>

        <button className="w-full bg-white text-primary-800 font-medium py-3 px-4 rounded-md hover:bg-blue-50 transition-colors">
          Join A Weekly League →
        </button>
      </div>
    </div>
  );
};

export default JoinWeeklyLeagueCard;
