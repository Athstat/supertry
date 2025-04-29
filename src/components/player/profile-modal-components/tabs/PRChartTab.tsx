import React from 'react';

interface PRChartTabProps {
  player: any;
}

export const PRChartTab: React.FC<PRChartTabProps> = ({ player }) => {
  return (
    <div className="flex items-center justify-center p-8 text-gray-500 dark:text-gray-400">
      PR Chart coming soon
    </div>
  );
};

export default PRChartTab;
