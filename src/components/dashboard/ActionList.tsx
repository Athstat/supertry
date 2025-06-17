import React from 'react';
import { MessageCircle, BarChart, Award } from 'lucide-react';

const ActionList = () => {
  return (
    <div className="rounded-xl bg-gray-50 dark:bg-gray-800 overflow-hidden">
      <div className="p-4">
        <h3 className="text-base font-medium mb-3">OPEN ACTIONS</h3>
        <div className="flex flex-col gap-3">
          {/* Predict outcome action */}
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mr-3">
                <BarChart className="w-4 h-4 text-blue-500 dark:text-blue-300" />
              </div>
              <span className="font-medium">Predict outcome: Sharks vs Bulls</span>
            </div>
          </div>

          {/* Match chat replies */}
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mr-3">
                <MessageCircle className="w-4 h-4 text-blue-500 dark:text-blue-300" />
              </div>
              <span className="font-medium">3 new replies in match chat</span>
            </div>
            <div className="text-xs font-semibold bg-blue-500 text-white rounded-full h-5 min-w-5 flex items-center justify-center px-1.5">
              24
            </div>
          </div>

          {/* Weekly reward */}
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mr-3">
                <Award className="w-4 h-4 text-blue-500 dark:text-blue-300" />
              </div>
              <span className="font-medium">Weekly reward available to claim</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActionList;
