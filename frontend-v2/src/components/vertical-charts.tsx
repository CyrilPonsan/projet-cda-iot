import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { FC, memo } from "react";
import { getStats } from "../helpers/get-stats";
import Statistique from "../utils/types/statistique";

type Props = {
  alerte: number;
  stats: Array<Statistique>;
};

const VerticalCharts: FC<Props> = memo(({ alerte, stats }) => {
  ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
  );

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: false,
      },
    },
  };

  const { labels, averages, seuils } = getStats(stats, alerte);

  const generateColors = (data: number[]) => {
    return data.map((value) => {
      if (value < alerte) {
        return "orange";
      } else {
        return "green";
      }
    });
  };

  const data = {
    labels,
    datasets: [
      {
        label: "Seuil",
        data: seuils,
        backgroundColor: "blue",
      },
      {
        label: "Taux d'humidité",
        data: averages,
        backgroundColor: generateColors(averages),
      },
    ],
  };

  return <Bar options={options} data={data} />;
});

export default VerticalCharts;
