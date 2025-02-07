import React from 'react';
import { Calendar } from 'lucide-react';
import { Fixture } from '../../types/league';

interface FixturesListProps {
  fixtures: Fixture[];
}

export function FixturesList({ fixtures }: FixturesListProps) {
  return (
    <div className="bg-white dark:bg-dark-850 rounded-xl shadow-sm dark:shadow-dark-sm border border-gray-200 dark:border-dark-600">
      <div className="p-4 border-b border-gray-100 dark:border-dark-600">
        <h2 className="text-xl font-semibold flex items-center gap-2 dark:text-gray-100">
          <Calendar size={24} className="text-primary-500" />
          Upcoming Fixtures
        </h2>
      </div>

      <div className="divide-y divide-gray-100 dark:divide-dark-600">
        {fixtures.map((fixture) => (
          <div key={fixture.id} className="p-4 hover:bg-gray-50 dark:hover:bg-dark-800 transition-colors">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">{fixture.competition}</span>
              <span className="text-sm font-medium dark:text-gray-300">{new Date(fixture.date).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center justify-between mb-2">
              <div className="font-medium dark:text-gray-100">{fixture.homeTeam}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">vs</div>
              <div className="font-medium dark:text-gray-100">{fixture.awayTeam}</div>
            </div>
            <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
              <span>{fixture.time}</span>
              <span>{fixture.venue}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}