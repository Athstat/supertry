/* eslint-disable @typescript-eslint/no-explicit-any */
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ChartOptions,
} from 'chart.js';
import usePowerRankings from '../../../../hooks/athletes/usePowerRankings';
import { format } from 'date-fns';
import { IProAthlete } from '../../../../types/athletes';
import { useTheme } from '../../../../contexts/app_state/ThemeContext';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

type Props = {
  player: IProAthlete;
};

export function PowerRankingChartTab({ player }: Props) {
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark';

  const { data, isLoading, error } = usePowerRankings(player.tracking_id);

  // Calculate average power ranking
  const averageRating =
    data && data.length > 0
      ? (data.reduce((sum, item) => sum + item.updated_power_ranking, 0) / data.length).toFixed(1)
      : null;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-500"></div>
        <span className="ml-3 text-gray-600 dark:text-gray-400">
          Loading power ranking history...
        </span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center p-8 text-red-500 dark:text-red-400">
        {error}
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="flex justify-center items-center p-8 text-gray-500 dark:text-gray-400">
        No power ranking history available
      </div>
    );
  }

  // Prepare data for chart
  const chartData = {
    labels: data.map(item => {
      const kickoff = item.game.kickoff_time;

      if (kickoff) {
        return format(kickoff, 'dd MMM yy');
      }

      return '-';
    }),
    datasets: [
      {
        label: 'Power Ranking',
        data: data.map(item => item.updated_power_ranking),
        borderColor: '#3b82f6', // Blue color
        backgroundColor: (context: any) => {
          const ctx = context.chart.ctx;
          const gradient = ctx.createLinearGradient(0, 0, 0, 300);
          gradient.addColorStop(0, 'rgba(59, 130, 246, 0.3)');
          gradient.addColorStop(1, 'rgba(59, 130, 246, 0)');
          return gradient;
        },
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#3b82f6',
        pointBorderColor: isDarkMode ? '#18181b' : '#ffffff',
        pointBorderWidth: 2,
        pointRadius: 5,
        pointHoverRadius: 7,
      },
    ],
  };

  // Chart options
  const chartOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        grid: {
          color: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
          display: false,
        },
        ticks: {
          color: isDarkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)',
        },
      },
      y: {
        grid: {
          color: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
          display: true, // Show grid lines
        },
        border: {
          display: false, // Hide border
        },
        ticks: {
          color: isDarkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)',
        },
        min: 50, // Set minimum value to better visualize changes
        max: 95, // Set maximum value
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: isDarkMode ? 'rgba(0, 0, 0, 0.8)' : 'rgba(255, 255, 255, 0.8)',
        titleColor: isDarkMode ? '#ffffff' : '#000000',
        bodyColor: isDarkMode ? '#e5e5e5' : '#333333',
        borderColor: '#3b82f6',
        borderWidth: 1,
        padding: 12,
        cornerRadius: 6,
        displayColors: false,
        callbacks: {
          title: tooltipItems => {
            const item = data[tooltipItems[0].dataIndex];
            const date = new Date(item.game.kickoff_time ?? new Date());
            return date.toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            });
          },
          label: tooltipItem => {
            const item = data[tooltipItem.dataIndex];
            return [
              `Power Ranking: ${item.updated_power_ranking}`,
              `${item.game.team?.athstat_name || 'Team'} vs ${item.game.opposition_team?.athstat_name || 'Opposition'}`,
            ];
          },
        },
      },
    },
    interaction: {
      mode: 'index',
      intersect: false,
    },
  };

  return (
    <div className="relative overflow-hidden rounded-2xl bg-slate-200/50 dark:bg-slate-800/50 backdrop-blur-md shadow-lg ring-1 ring-white/10">
      {/* Header */}
      <div className="flex justify-between items-center px-4 pt-4 pb-2">
        <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300">
          Power Ranking Trend
        </h3>
        {averageRating && (
          <div className="px-3 py-1 rounded-full bg-blue-500/20 backdrop-blur-sm ring-1 ring-blue-500/30">
            <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">
              Avg: {averageRating}
            </span>
          </div>
        )}
      </div>

      {/* Chart */}
      <div className="p-4 h-52">
        <Line data={chartData} options={chartOptions} />
      </div>
    </div>
  );
}

export default PowerRankingChartTab;
