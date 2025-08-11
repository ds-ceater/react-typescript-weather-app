// src/components/Graph.tsx

import React, { useEffect, useState } from 'react';
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
import type { ChartOptions } from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

// 型定義
type ForecastDayType = { date: string; avgtemp_c: number; };
type ForecastType = ForecastDayType[];
type Props = { forecast: ForecastType; };
type GraphDataType = {
  labels: string[];
  datasets: { label: string; data: number[]; borderColor: string; tension: number; }[];
};

const Graph = (props: Props) => {
  const [data, setData] = useState<GraphDataType>({
    labels: [],
    datasets: [],
  });
  const [options, setOptions] = useState<ChartOptions<'line'>>({});

  // グラフのデータ（数値とラベル）を更新
  useEffect(() => {
    if (props.forecast.length === 0) {
      setData({ labels: [], datasets: [] });
      return;
    }

    const labels = props.forecast.map((day) => {
      const date = new Date(day.date);
      return `${date.getMonth() + 1}/${date.getDate()}`;
    });

    const dataPoints = props.forecast.map((day) => day.avgtemp_c);

    setData((prevData) => ({
      ...prevData,
      labels: labels,
      datasets: [
        {
          ...prevData.datasets[0],
          label: '平均気温 (°C)',
          data: dataPoints,
        },
      ],
    }));
  }, [props.forecast]);

  // グラフの色を更新
  useEffect(() => {
    const updateChartColors = () => {
      const rootStyle = window.getComputedStyle(document.documentElement);
      const chartTextColor = rootStyle.getPropertyValue('--chart-text-color').trim();
      const chartGridColor = rootStyle.getPropertyValue('--chart-grid-color').trim();
      const chartBorderColor = rootStyle.getPropertyValue('--chart-border-color').trim();
      // 折れ線の色は、CSS変数から取得せず、直接指定する
      const chartLineColor = '#f15186';

      setOptions({
        responsive: true,
        plugins: {
          legend: { position: 'top' as const, labels: { color: chartTextColor } },
          title: { display: true, color: chartTextColor, text: '3日間の平均気温の変化' },
        },
        scales: {
          y: {
            title: { color: chartTextColor, display: true, text: '気温 (°C)' },
            ticks: { color: chartTextColor },
            grid: { color: chartGridColor },
            border: { color: chartBorderColor },
          },
          x: {
            ticks: { color: chartTextColor },
            grid: { color: chartGridColor },
            border: { color: chartBorderColor },
          },
        },
        maintainAspectRatio: false,
      });

      setData((prevData) => {
        if (!prevData.datasets[0]) {
          return prevData;
        }
        return {
          ...prevData,
          datasets: [{ ...prevData.datasets[0], borderColor: chartLineColor }],
        };
      });
    };

    const observer = new MutationObserver(() => {
      setTimeout(updateChartColors, 0);
    });

    observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });
    updateChartColors();

    return () => observer.disconnect();
  }, []);

  return (
    <div className="graphInner">
      {props.forecast.length > 0 && <Line data={data} options={options} />}
    </div>
  );
};

export default Graph;