import { Radar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  type ChartOptions,
} from 'chart.js';
import type { CategoryScore } from '../../types';

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip);

interface RadarChartProps {
  categoryScores: CategoryScore[];
}

export function RadarChart({ categoryScores }: RadarChartProps) {
  const data = {
    labels: categoryScores.map((c) => c.label),
    datasets: [
      {
        label: 'Score',
        data: categoryScores.map((c) => c.score),
        backgroundColor: 'rgba(79, 124, 255, 0.18)',
        borderColor: 'rgba(79, 124, 255, 0.9)',
        borderWidth: 2,
        pointBackgroundColor: 'rgba(79, 124, 255, 1)',
        pointBorderColor: '#fff',
        pointRadius: 4,
      },
    ],
  };

  const options: ChartOptions<'radar'> = {
    responsive: true,
    maintainAspectRatio: true,
    scales: {
      r: {
        min: 0,
        max: 100,
        ticks: {
          stepSize: 25,
          color: '#6b6f7a',
          backdropColor: 'transparent',
          font: { size: 10 },
        },
        grid: { color: 'rgba(255,255,255,0.08)' },
        angleLines: { color: 'rgba(255,255,255,0.08)' },
        pointLabels: {
          color: '#a4a8b3',
          font: { size: 12, family: 'Inter' },
        },
      },
    },
    plugins: {
      tooltip: {
        backgroundColor: '#16181d',
        borderColor: '#33363f',
        borderWidth: 1,
        titleColor: '#f4f5f7',
        bodyColor: '#a4a8b3',
        padding: 10,
      },
    },
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <Radar data={data} options={options} />
    </div>
  );
}
