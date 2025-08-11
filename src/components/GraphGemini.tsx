// src/components/Graph.tsx

import React, { useEffect, useRef, useState } from 'react'; // 変更点: useEffectとuseStateを追加
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

// Chart.jsのコンポーネントを登録
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
};
type ForecastType = ForecastDayType[];

type Props = {
  forecast: ForecastType;
};

const Graph = (props: Props) => {
  // 変更点: optionsを動的に更新するため、useStateで管理するように変更
  // 修正前はoptionsをconstで宣言していましたが、これだと変更できません。
  const [options, setOptions] = useState({});
  //　useRef DOM要素へアクセス　再レンダリングをトリガーしない値の保持
  const chartRef = useRef(null);

  // 変更点: コンポーネントのマウント時と、<body>のクラスが変更された時に実行するロジックをuseEffect内に記述
  useEffect(() => {
    // 追加: <body>要素のクラス変更を監視するためのMutationObserverをインスタンス化
    const observer = new MutationObserver((mutationsList) => {
      // <body>のclass属性が変更されたら、グラフの色を更新する
      for (const mutation of mutationsList) {
        if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
          updateChartColors();
        }
      }
    });

    // 追加: <body>要素を監視対象に設定
    observer.observe(document.body, {
      attributes: true, // 属性の変更を監視
      attributeFilter: ['class'], // class属性のみを監視
    });

    // 追加: CSS変数の値を取得し、グラフのオプションを更新する関数
    const updateChartColors = () => {
      // window.getComputedStyle()を使ってCSS変数の現在値を取得
      const rootStyle = window.getComputedStyle(document.documentElement);
      const chartTextColor = rootStyle.getPropertyValue('--chart-text-color').trim();
      const chartGridColor = rootStyle.getPropertyValue('--chart-grid-color').trim();
      const chartBorderColor = rootStyle.getPropertyValue('--chart-border-color').trim();
      const chartLineColor = rootStyle.getPropertyValue('--chart-line-color').trim();

      //  新しいdataオブジェクトを作成し、線の色を適用
      const newData = {
        labels: props.forecast.map(day => {
          const date = new Date(day.date);
          return `${date.getMonth() + 1}/${date.getDate()}`;
        }),
        datasets: [
          {
            label: '平均気温 (°C)',
            data: props.forecast.map(day => day.avgtemp_c),
            // 変更点: ここで取得したCSS変数の値を設定
            borderColor: chartLineColor,
            tension: 0.1,
          },
        ],
      };

      // 新しいoptionsオブジェクトを作成し、CSS変数の値を適用
      const newOptions = {
        responsive: true,
        plugins: {
          legend: {
            position: 'top' as const,
            labels: {
              // 変更点: ここで取得したCSS変数の値を設定
              color: chartTextColor,
            },
          },
          title: {
            display: true,
            // 変更点: タイトルのテキスト色にCSS変数を適用
            color: chartTextColor,
            text: '3日間の平均気温の変化',
          },
        },
        scales: {
          y: {
            title: {
              // 変更点: Y軸タイトルの色にCSS変数を適用
              color: chartTextColor,
              display: true,
              text: '気温 (°C)',
            },
            ticks: {
              // 変更点: Y軸目盛りの色にCSS変数を適用
              color: chartTextColor,
            },
            // 変更点: gridプロパティのコメントアウトを外し、CSS変数を適用
            grid: {
              color: chartGridColor,
            },
            border: {
              // 変更点: Y軸の枠線の色にCSS変数を適用
              color: chartBorderColor,
            },
          },
          x: {
            ticks: {
              // 変更点: X軸目盛りの色にCSS変数を適用
              color: chartTextColor,
            },
            // 変更点: gridプロパティを追加し、CSS変数を適用
            grid: {
              color: chartGridColor,
            },
            border: {
              // 変更点: X軸の枠線の色にCSS変数を適用
              color: chartBorderColor,
            },
          },
        },
        maintainAspectRatio: false,
      };

      // stateを更新し、グラフを再レンダリングさせる
      setData(newData);
      setOptions(newOptions);
    };

    // コンポーネントの初回レンダリング時に一度だけ実行
    updateChartColors();

    // クリーンアップ関数: コンポーネントがアンマウントされるときに監視を停止
    return () => observer.disconnect();
  }, [props.forecast]); // 空の依存配列[]により、マウント時とアンマウント時のみ実行される

  // グラフに表示するデータを作成
  // 修正前とほぼ同じですが、datasets内のcolorプロパティはoptionsで一括設定するため削除
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
        borderColor: 'rgb(241, 81, 134)', // ここは固定の色
        tension: 0.1,
        // 削除: colorプロパティはオプションで一括設定するため、ここで指定する必要はなくなりました
      },
    ],
  };

  // 削除: 修正前はここにoptionsオブジェクトが直接定義されていました。
  // そのため、コンポーネントが再レンダリングされても値は変更されませんでした。
  // この部分をuseStateとuseEffectに置き換えることで動的な変更が可能になりました。

  return (
    <div className='graphInner'>
      {props.forecast.length > 0 && <Line ref={chartRef} data={data} options={options} />}
    </div>
  );
};

export default Graph;