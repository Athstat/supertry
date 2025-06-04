import React from "react";
import { Line } from "react-chartjs-2";
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
} from "chart.js";
import usePowerRankings from "../usePowerRankings";
import { useTheme } from "../../../../contexts/ThemeContext";

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

interface PRChartTabProps {
  player: any;
}

export const PRChartTab: React.FC<PRChartTabProps> = ({ player }) => {
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";

  const { data, isLoading, error } = usePowerRankings(player.athlete_id);

  console.log("playerPR", data);

  // Format dates for display on X-axis
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.toLocaleString("default", {
      month: "short",
    })} ${date.getDate()}`;
  };

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
    labels: data.map((item) => formatDate(item.kickoff_time)),
    datasets: [
      {
        label: "Power Ranking",
        data: data.map((item) => item.updated_power_ranking),
        borderColor: "#10b981", // Green color
        backgroundColor: (context: any) => {
          const ctx = context.chart.ctx;
          const gradient = ctx.createLinearGradient(0, 0, 0, 300);
          gradient.addColorStop(0, "rgba(16, 185, 129, 0.3)");
          gradient.addColorStop(1, "rgba(16, 185, 129, 0)");
          return gradient;
        },
        fill: true,
        tension: 0.4,
        pointBackgroundColor: "#10b981",
        pointBorderColor: isDarkMode ? "#18181b" : "#ffffff",
        pointBorderWidth: 2,
        pointRadius: 5,
        pointHoverRadius: 7,
      },
    ],
  };

  // Chart options
  const chartOptions: ChartOptions<"line"> = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        grid: {
          color: isDarkMode ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)",
          display: false,
        },
        ticks: {
          color: isDarkMode ? "rgba(255, 255, 255, 0.7)" : "rgba(0, 0, 0, 0.7)",
        },
      },
      y: {
        grid: {
          color: isDarkMode ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)",
          display: true, // Show grid lines
        },
        border: {
          display: false, // Hide border
        },
        ticks: {
          color: isDarkMode ? "rgba(255, 255, 255, 0.7)" : "rgba(0, 0, 0, 0.7)",
        },
        min: 70, // Set minimum value to better visualize changes
        max: 95, // Set maximum value
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: isDarkMode
          ? "rgba(0, 0, 0, 0.8)"
          : "rgba(255, 255, 255, 0.8)",
        titleColor: isDarkMode ? "#ffffff" : "#000000",
        bodyColor: isDarkMode ? "#e5e5e5" : "#333333",
        borderColor: "#10b981",
        borderWidth: 1,
        padding: 12,
        cornerRadius: 6,
        displayColors: false,
        callbacks: {
          title: (tooltipItems) => {
            const item = data[tooltipItems[0].dataIndex];
            const date = new Date(item.kickoff_time);
            return date.toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            });
          },
          label: (tooltipItem) => {
            const item = data[tooltipItem.dataIndex];
            return [
              `Power Ranking: ${item.updated_power_ranking}`,
              `${item.team_name} vs ${item.opposition_name}`,
            ];
          },
        },
      },
    },
    interaction: {
      mode: "index",
      intersect: false,
    },
  };

  return (
    <div className="p-4 h-96">
      <Line data={chartData} options={chartOptions} />
    </div>
  );
};

export default PRChartTab;
