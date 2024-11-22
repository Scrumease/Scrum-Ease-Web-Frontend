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
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export type LineChartData = {
  labels: string[] | undefined;
  datasets: {
    label: string;
    data: number[] | undefined;
    backgroundColor: string;
    borderColor: string;
    borderWidth: number;
  }[];
};

export type LineChartOptions = {
  responsive: boolean;
  plugins: {
    legend: {
      position: "top" | "bottom" | "left" | "right";
    };
    title: {
      display: boolean;
      text: string;
    };
  };
};

const defaultOptions = (title: string): LineChartOptions => {
  return {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: title,
      },
    },
  };
};

const LineChart = ({
  data,
  title,
  options = defaultOptions(title),
}: {
  data: LineChartData;
  title: string;
  options?: LineChartOptions;
}) => {
  return <Line data={data} options={options} />;
};

export default LineChart;
