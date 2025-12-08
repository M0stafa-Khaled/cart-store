"use client";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
  Filler,
  BarController,
  LineController,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { formatEGPPrice } from "@/utils/formatPrice";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  BarController,
  LineController
);

interface ChartData {
  date: string;
  revenue: number;
  orders: number;
}

interface SalesChartProps {
  data: ChartData[];
}

const SalesChart = ({ data }: SalesChartProps) => {
  const chartData = {
    labels: data.map((d) => d.date.slice(5)), // MM-DD
    datasets: [
      {
        type: "bar" as const,
        label: "Revenue",
        data: data.map((d) => d.revenue),
        backgroundColor: "rgba(147, 51, 234, 0.5)", // Purple-600 with opacity
        borderColor: "rgb(147, 51, 234)",
        borderWidth: 1,
        yAxisID: "y",
        borderRadius: 4,
      },
      {
        type: "line" as const,
        label: "Orders",
        data: data.map((d) => d.orders),
        borderColor: "rgb(59, 130, 246)", // Blue-500
        backgroundColor: "rgba(59, 130, 246, 0.1)",
        borderWidth: 2,
        pointBackgroundColor: "rgb(59, 130, 246)",
        yAxisID: "y1",
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: "index" as const,
      intersect: false,
    },
    plugins: {
      legend: {
        position: "top" as const,
        labels: {
          color: "#374151",
        },
      },
      tooltip: {
        callbacks: {
          label: function (context: any) {
            let label = context.dataset.label || "";
            if (label) {
              label += ": ";
            }
            if (context.dataset.yAxisID === "y") {
              label += formatEGPPrice(context.parsed.y);
            } else {
              label += context.parsed.y;
            }
            return label;
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          color: "rgba(0, 0, 0, 0.1)",
        },
        ticks: {
          color: "#374151",
        },
      },
      y: {
        type: "linear" as const,
        display: true,
        position: "left" as const,
        grid: {
          color: "rgba(0, 0, 0, 0.1)",
        },
        ticks: {
          color: "#374151",
          callback: function (value: any) {
            return formatEGPPrice(value);
          },
        },
      },
      y1: {
        type: "linear" as const,
        display: true,
        position: "right" as const,
        grid: {
          drawOnChartArea: false,
        },
        ticks: {
          color: "#374151",
        },
      },
    },
  };

  return (
    <div className="w-full h-[350px]">
      <div className="relative h-full w-full">
        <Line data={chartData as any} options={options} />
      </div>
    </div>
  );
};

export default SalesChart;
