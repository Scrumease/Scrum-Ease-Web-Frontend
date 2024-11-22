import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export type BarChartData = {
  labels: string[] | undefined;
  datasets: {
    label: string;
    data: number[] | undefined;
    backgroundColor: string;
    borderColor: string;
    borderWidth: number;
  }[];
};

export type BarChartOptions = {
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

const defaultOptions = (title: string = ""): BarChartOptions => {
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

const BarChart = ({
  data,
  title = "",
  options = defaultOptions(title),
}: {
  data: BarChartData;
  title?: string;
  options?: BarChartOptions;
}) => {
  return <Bar data={data} options={options} />;
};

export default BarChart;
