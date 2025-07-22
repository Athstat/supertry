import React from 'react';
import { BarChart, MessageCircle, Trophy } from 'lucide-react';

const OpenActionsSection = () => {
  const actions = [
    {
      icon: BarChart,
      text: 'Predict outcome: Sharks vs Bulls',
      hasNotification: false,
    },
    {
      icon: MessageCircle,
      text: '3 new replies in match chat',
      hasNotification: true,
      notificationCount: 24,
    },
    {
      icon: Trophy,
      text: 'Team selection deadline approaching',
      hasNotification: false,
    },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-4">
      <h3 className="text-base font-medium text-gray-900 dark:text-gray-100 mb-3">OPEN ACTIONS</h3>

      <div className="space-y-3">
        {actions.map((action, index) => {
          const IconComponent = action.icon;

          return (
            <div
              key={index}
              className="flex items-center justify-between py-2 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg px-2 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                  <IconComponent className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                </div>
                <span className="text-sm text-gray-700 dark:text-gray-300">{action.text}</span>
              </div>

              {action.hasNotification && (
                <div className="bg-blue-500 text-white text-xs font-medium px-2 py-1 rounded-full min-w-[24px] text-center">
                  {action.notificationCount}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OpenActionsSection;
