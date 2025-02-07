import React from 'react';
import { Shield, Bell, UserCircle } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';

export function Header() {
  return (
    <header className="bg-white dark:bg-dark-850 border-b border-gray-200 dark:border-dark">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <Shield size={32} className="text-primary-500" />
            <span className="text-xl font-bold dark:text-white">RugbyFantasy</span>
          </div>
          
          <nav className="hidden md:flex items-center gap-8">
            <a href="#" className="text-gray-700 dark:text-gray-300 hover:text-primary-500 dark:hover:text-primary-400">Dashboard</a>
            <a href="#" className="text-gray-700 dark:text-gray-300 hover:text-primary-500 dark:hover:text-primary-400">Leagues</a>
            <a href="#" className="text-gray-700 dark:text-gray-300 hover:text-primary-500 dark:hover:text-primary-400">My Teams</a>
            <a href="#" className="text-gray-700 dark:text-gray-300 hover:text-primary-500 dark:hover:text-primary-400">Leaderboard</a>
          </nav>

          <div className="flex items-center gap-4">
            <ThemeToggle />
            <button className="p-2 text-gray-600 dark:text-gray-400 hover:text-primary-500 dark:hover:text-primary-400">
              <Bell size={20} />
            </button>
            <button className="p-2 text-gray-600 dark:text-gray-400 hover:text-primary-500 dark:hover:text-primary-400">
              <UserCircle size={20} />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}