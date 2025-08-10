// src/components/Graph.tsx

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
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

// 3日間の予報データの型定義
type ForecastDayType = {
  date: string;
  avgtemp_c: number;
}
type ForecastType = ForecastDayType[];

type Props = {
  forecast: ForecastType;
}

const Graph = (props: Props) => {
  // グラフに表示するデータを作成
  const data = {
    labels: props.forecast.map(day => {
      // 日付をフォーマットして表示
      const date = new Date(day.date);
      return `${date.getMonth() + 1}/${date.getDate()}`;
    }),
    datasets: [
      {
        label: '平均気温 (°C)',
        data: props.forecast.map(day => day.avgtemp_c),
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
      },
    ],
  };

  // グラフのオプションを設定
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: '3日間の平均気温の変化',
      },
    },
    scales: {
      y: {
        title: {
          display: true,
          text: '気温 (°C)'
        }
      }
    },
    maintainAspectRatio: false
  };

  return (
    <div className='graph'>
      {props.forecast.length > 0 && <Line data={data} options={options} />}
    </div>
  );
};

export default Graph;